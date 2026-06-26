import { NextRequest, NextResponse } from "next/server";

interface EditBody {
  image: string; // base64 data URL of the source image
  prompt: string; // transformation instruction
}

export const maxDuration = 60;

// Strip the "data:image/...;base64," prefix and return raw base64
function stripDataUrl(dataUrl: string): { base64: string; mime: string } {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
  if (match) {
    return { mime: match[1], base64: match[2] };
  }
  return { mime: "image/png", base64: dataUrl };
}


// Provider A: Pollinations kontext (best for style transforms)
// Requires a free API key from enter.pollinations.ai
async function editWithPollinations(
  base64: string,
  mime: string,
  prompt: string
): Promise<string | null> {
  const apiKey = process.env.POLLINATIONS_API_KEY;
  if (!apiKey) return null;

  try {
    // 1. Upload the source image to Pollinations media storage to get a URL
    const buffer = Buffer.from(base64, "base64");
    const blob = new Blob([buffer], { type: mime });
    const form = new FormData();
    form.append("file", blob, "source.png");

    const uploadRes = await fetch("https://media.pollinations.ai/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    if (!uploadRes.ok) {
      console.log(`[Pollinations edit] upload failed (${uploadRes.status})`);
      return null;
    }

    const uploadData = await uploadRes.json();
    const imageUrl =
      uploadData?.url || uploadData?.uri || uploadData?.location;
    if (!imageUrl) {
      console.log(`[Pollinations edit] no URL in upload response`);
      return null;
    }

    // 2. Call kontext model with the image URL + transformation prompt
    const genUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(
      prompt
    )}?model=kontext&image=${encodeURIComponent(imageUrl)}&key=${apiKey}`;

    const genRes = await fetch(genUrl);
    if (!genRes.ok) {
      console.log(`[Pollinations edit] generation failed (${genRes.status})`);
      return null;
    }

    const contentType = genRes.headers.get("content-type") || "";
    if (!contentType.includes("image")) return null;

    const outBuffer = await genRes.arrayBuffer();
    const outBase64 = Buffer.from(outBuffer).toString("base64");
    const outMime = contentType.includes("jpeg") ? "image/jpeg" : "image/png";
    return `data:${outMime};base64,${outBase64}`;
  } catch (err) {
    console.log("[Pollinations edit] error:", err);
    return null;
  }
}


// Provider B: Cloudflare Workers AI img2img (takes raw bytes, no hosting needed)
async function editWithCloudflare(
  base64: string,
  prompt: string
): Promise<string | null> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return null;

  try {
    // Cloudflare expects the image as an array of uint8 integers
    const imageArray = Array.from(Buffer.from(base64, "base64"));

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/runwayml/stable-diffusion-v1-5-img2img`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          image: imageArray,
          strength: 0.75,
          guidance: 8,
        }),
      }
    );

    if (!res.ok) {
      console.log(`[Cloudflare edit] failed (${res.status})`);
      return null;
    }

    const buffer = await res.arrayBuffer();
    const outBase64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${outBase64}`;
  } catch (err) {
    console.log("[Cloudflare edit] error:", err);
    return null;
  }
}


export async function POST(request: NextRequest) {
  try {
    const body: EditBody = await request.json();

    if (!body.image) {
      return NextResponse.json(
        { success: false, error: "An image is required" },
        { status: 400 }
      );
    }
    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "A transformation prompt is required" },
        { status: 400 }
      );
    }

    const { base64, mime } = stripDataUrl(body.image);
    const prompt = body.prompt.trim();

    // Cascade: Pollinations kontext (best) -> Cloudflare img2img
    let result = await editWithPollinations(base64, mime, prompt);
    if (result) {
      return NextResponse.json({ success: true, image: result, provider: "pollinations-kontext" });
    }

    result = await editWithCloudflare(base64, prompt);
    if (result) {
      return NextResponse.json({ success: true, image: result, provider: "cloudflare-img2img" });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Image editing needs a free API key. Add POLLINATIONS_API_KEY (from enter.pollinations.ai) or Cloudflare keys to .env.local. See README.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
