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

// Image-to-image transformation presets (for the Edit page)
export const TRANSFORM_PRESETS = [
  { id: "cartoon", label: "Cartoon", emoji: "🎨", prompt: "turn this into a vibrant cartoon illustration, bold outlines, flat colors, animated style" },
  { id: "anime", label: "Anime", emoji: "🌸", prompt: "convert this into anime style, cel shading, expressive, detailed anime art" },
  { id: "pixar", label: "3D Pixar", emoji: "🧸", prompt: "transform into a 3D Pixar-style animated character render, soft lighting, big expressive features" },
  { id: "oil-painting", label: "Oil Painting", emoji: "🖼️", prompt: "turn this into a classical oil painting with visible textured brushstrokes" },
  { id: "watercolor", label: "Watercolor", emoji: "💧", prompt: "convert into a soft watercolor painting, flowing colors, artistic" },
  { id: "sketch", label: "Pencil Sketch", emoji: "✏️", prompt: "turn this into a detailed black and white pencil sketch drawing" },
  { id: "pixel", label: "Pixel Art", emoji: "👾", prompt: "convert into retro 16-bit pixel art style" },
  { id: "cyberpunk", label: "Cyberpunk", emoji: "🌃", prompt: "transform into cyberpunk style with neon lights and futuristic atmosphere" },
  { id: "comic", label: "Comic Book", emoji: "💥", prompt: "turn this into a comic book style with bold ink lines and halftone shading" },
  { id: "vangogh", label: "Van Gogh", emoji: "🌌", prompt: "repaint this in the style of Van Gogh's Starry Night, swirling expressive brushstrokes" },
  { id: "statue", label: "Marble Statue", emoji: "🗿", prompt: "transform the subject into a white marble statue sculpture" },
  { id: "lego", label: "LEGO", emoji: "🧱", prompt: "turn this into LEGO brick toy style, plastic minifigure look" },
] as const;
