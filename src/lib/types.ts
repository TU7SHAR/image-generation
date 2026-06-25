export interface GenerationRequest {
  prompt: string;
  style?: string;
  size?: "square" | "landscape" | "portrait";
  provider?: "cloudflare" | "huggingface" | "together";
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  size: string;
  provider: string;
  imageUrl: string;
  createdAt: string;
}

export interface GenerationResponse {
  success: boolean;
  image?: string; // base64 data URL
  provider?: string;
  error?: string;
}
