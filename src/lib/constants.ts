export const APP_NAME = "Pixora";
export const APP_DESCRIPTION = "AI-powered image generation. Create stunning visuals from text in seconds.";
export const APP_TAGLINE = "Imagine it. Generate it.";

export const IMAGE_STYLES = [
  { id: "none", label: "No style", prompt: "" },
  { id: "photorealistic", label: "Photorealistic", prompt: "photorealistic, ultra detailed, 8k, professional photography" },
  { id: "anime", label: "Anime", prompt: "anime style, vibrant colors, detailed illustration" },
  { id: "digital-art", label: "Digital Art", prompt: "digital art, concept art, trending on artstation" },
  { id: "oil-painting", label: "Oil Painting", prompt: "oil painting style, textured brushstrokes, classical art" },
  { id: "watercolor", label: "Watercolor", prompt: "watercolor painting, soft edges, artistic, flowing colors" },
  { id: "pixel-art", label: "Pixel Art", prompt: "pixel art style, retro, 16-bit aesthetic" },
  { id: "3d-render", label: "3D Render", prompt: "3d render, octane render, cinema 4d, blender, highly detailed" },
  { id: "comic", label: "Comic Book", prompt: "comic book style, bold lines, dynamic composition, cel shading" },
  { id: "minimalist", label: "Minimalist", prompt: "minimalist design, clean lines, simple composition, elegant" },
  { id: "cyberpunk", label: "Cyberpunk", prompt: "cyberpunk style, neon lights, futuristic, dark atmosphere" },
  { id: "fantasy", label: "Fantasy", prompt: "fantasy art, magical, ethereal lighting, epic composition" },
] as const;

export const IMAGE_SIZES = [
  { id: "square", label: "Square", width: 1024, height: 1024 },
  { id: "landscape", label: "Landscape", width: 1280, height: 768 },
  { id: "portrait", label: "Portrait", width: 768, height: 1280 },
] as const;

export const EXAMPLE_PROMPTS = [
  "A serene Japanese garden with cherry blossoms falling, golden hour lighting",
  "Astronaut riding a horse on Mars, cinematic wide shot",
  "Cozy coffee shop interior on a rainy day, warm lighting, bookshelves",
  "Underwater city with bioluminescent buildings and jellyfish",
  "A fox wearing a space suit floating through a nebula",
  "Mountain village at sunset with dramatic clouds and mist",
  "Steampunk airship flying over Victorian London",
  "Crystal cave with purple and blue glowing formations",
];
