import { NextRequest, NextResponse } from "next/server";
import { IMAGE_STYLES, IMAGE_SIZES } from "@/lib/constants";

interface GenerateBody {
  prompt: string;
  style?: string;
  size?: "square" | "landscape" | "portrait";
}


function buildPrompt(base: string, styleId?: string): string {
  const style = IMAGE_STYLES.find((s) => s.id === styleId);
  if (style && style.prompt) {
    return `${base}, ${style.prompt}`;
  }
  return base;
}

function getSize(sizeId?: string) {
  const size = IMAGE_SIZES.find((s) => s.id === sizeId);
  return size || IMAGE_SIZES[0]; // default square
}

// Provider 1: Cloudflare Workers AI
async function generateWithCloudflare(prompt: string, width: number, height: number): Promise<string | null> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return null;

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          width: Math.min(width, 1024),
          height: Math.min(height, 1024),
        }),
      }
    );

    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch {
    return null;
  }
}


// Provider 2: HuggingFace Inference API
async function generateWithHuggingFace(prompt: string): Promise<string | null> {
  const apiToken = process.env.HUGGINGFACE_API_TOKEN || process.env.HUGGINGFACE_API_KEY;
  if (!apiToken) return null;

  // Try models in order — FLUX.1 schnell may not be available on free tier
  const models = [
    "black-forest-labs/FLUX.1-schnell",
    "stabilityai/stable-diffusion-xl-base-1.0",
    "runwayml/stable-diffusion-v1-5",
  ];

  for (const model of models) {
    try {
      console.log(`[HuggingFace] Trying model: ${model}`);
      const res = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.log(`[HuggingFace] ${model} failed (${res.status}): ${errorText}`);
        continue;
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("image")) {
        console.log(`[HuggingFace] ${model} returned non-image content: ${contentType}`);
        continue;
      }

      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = contentType.includes("jpeg") ? "image/jpeg" : "image/png";
      return `data:${mimeType};base64,${base64}`;
    } catch (err) {
      console.log(`[HuggingFace] ${model} error:`, err);
      continue;
    }
  }

  return null;
}

// Provider 3: Together AI
async function generateWithTogether(prompt: string, width: number, height: number): Promise<string | null> {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.together.xyz/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell-Free",
        prompt,
        width: Math.min(width, 1024),
        height: Math.min(height, 1024),
        n: 1,
        response_format: "b64_json",
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return null;
    return `data:image/png;base64,${b64}`;
  } catch {
    return null;
  }
}


export async function POST(request: NextRequest) {
  try {
    const body: GenerateBody = await request.json();

    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (body.prompt.length > 1000) {
      return NextResponse.json(
        { success: false, error: "Prompt too long (max 1000 chars)" },
        { status: 400 }
      );
    }

    const fullPrompt = buildPrompt(body.prompt.trim(), body.style);
    const size = getSize(body.size);

    // Try providers in order (cascade fallback)
    // 1. Cloudflare Workers AI
    let image = await generateWithCloudflare(fullPrompt, size.width, size.height);
    if (image) {
      return NextResponse.json({ success: true, image, provider: "cloudflare" });
    }

    // 2. Together AI
    image = await generateWithTogether(fullPrompt, size.width, size.height);
    if (image) {
      return NextResponse.json({ success: true, image, provider: "together" });
    }

    // 3. HuggingFace
    image = await generateWithHuggingFace(fullPrompt);
    if (image) {
      return NextResponse.json({ success: true, image, provider: "huggingface" });
    }

    // All providers failed
    return NextResponse.json(
      {
        success: false,
        error: "Image generation failed. Check your API keys in .env.local (HUGGINGFACE_API_TOKEN or HUGGINGFACE_API_KEY, CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN, or TOGETHER_API_KEY). Check server console for detailed errors.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
