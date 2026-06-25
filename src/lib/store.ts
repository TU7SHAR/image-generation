"use client";

import { GeneratedImage } from "./types";

const STORAGE_KEY = "pixora_gallery";

export function getGallery(): GeneratedImage[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveToGallery(image: GeneratedImage): void {
  const gallery = getGallery();
  gallery.unshift(image);
  // Keep max 50 images in local storage
  const trimmed = gallery.slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function removeFromGallery(id: string): void {
  const gallery = getGallery();
  const filtered = gallery.filter((img) => img.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearGallery(): void {
  localStorage.removeItem(STORAGE_KEY);
}
