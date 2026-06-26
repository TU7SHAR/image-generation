"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Wand2,
  Download,
  Loader2,
  ImageIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { TRANSFORM_PRESETS } from "@/lib/constants";
import { saveToGallery } from "@/lib/store";
import { GeneratedImage } from "@/lib/types";

// Puter.js is loaded via a script tag in layout.tsx
declare global {
  interface Window {
    puter?: {
      ai: {
        txt2img: (
          prompt: string,
          options?: Record<string, unknown>
        ) => Promise<HTMLImageElement>;
      };
    };
  }
}

export default function EditPage() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image too large (max 8MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setSourceImage(e.target?.result as string);
      setResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handlePreset = (preset: (typeof TRANSFORM_PRESETS)[number]) => {
    setActivePreset(preset.id);
    setPrompt(preset.prompt);
  };

  const handleEdit = async () => {
    if (!sourceImage) {
      toast.error("Please upload an image first");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Pick a style or describe the transformation");
      return;
    }

    if (!window.puter) {
      toast.error("AI engine still loading", {
        description: "Give it a second and try again.",
      });
      return;
    }

    setIsEditing(true);
    setResultImage(null);

    try {
      // Puter.js runs client-side with NO API key (user-pays model).
      // Use Gemini Nano Banana — excellent at style transformations.
      const imageEl = await window.puter.ai.txt2img(prompt.trim(), {
        model: "gemini-2.5-flash-image-preview",
        input_image: sourceImage,
        input_image_mime_type: sourceImage.substring(
          sourceImage.indexOf(":") + 1,
          sourceImage.indexOf(";")
        ),
      });

      const resultUrl = imageEl?.src;
      if (!resultUrl) throw new Error("No image returned");

      setResultImage(resultUrl);
      setProvider("puter / nano-banana");

      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        prompt: `[edit] ${prompt.trim()}`,
        style: activePreset || "custom",
        size: "edit",
        provider: "puter",
        imageUrl: resultUrl,
        createdAt: new Date().toISOString(),
      };
      saveToGallery(newImage);
      toast.success("Image transformed!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error("Transformation failed", { description: message });
    } finally {
      setIsEditing(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `pixora-edit-${Date.now()}.png`;
    link.click();
    toast.success("Downloaded!");
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Transform Image</h1>
        <p className="mt-1 text-muted-foreground">
          Upload a photo and turn it into cartoon, anime, oil painting, and more.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,1fr]">
        <div className="space-y-6">
          {/* Upload area */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Source Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
            {sourceImage ? (
              <div className="relative overflow-hidden rounded-lg border border-border">
                <img src={sourceImage} alt="Source" className="max-h-72 w-full object-contain bg-muted/30" />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-2 top-2 h-7 w-7"
                  onClick={() => {
                    setSourceImage(null);
                    setResultImage(null);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border py-12 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent/50"
              >
                <Upload className="h-8 w-8" />
                <div className="text-center">
                  <p className="text-sm font-medium">Click or drag an image here</p>
                  <p className="text-xs">PNG, JPG up to 8MB</p>
                </div>
              </button>
            )}
          </div>

          {/* Transform presets */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Choose a style</Label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {TRANSFORM_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePreset(preset)}
                  className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-center transition-colors ${
                    activePreset === preset.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <span className="text-xl">{preset.emoji}</span>
                  <span className="text-[11px] font-medium">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom prompt */}
          <div className="space-y-2">
            <Label htmlFor="edit-prompt" className="text-sm font-medium">
              Or describe the transformation
            </Label>
            <Textarea
              id="edit-prompt"
              placeholder="e.g. turn this into a watercolor painting with soft pastel colors"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setActivePreset(null);
              }}
              className="min-h-[80px] resize-none text-sm"
            />
          </div>

          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleEdit}
            disabled={isEditing || !sourceImage || !prompt.trim()}
          >
            {isEditing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Transforming...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Transform Image
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Runs free via Puter.js — first use may ask you to sign in to Puter.
          </p>
        </div>

        {/* Result preview */}
        <div className="flex flex-col items-center">
          <Card className="relative flex aspect-square w-full items-center justify-center overflow-hidden border-dashed bg-muted/30">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="relative">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wand2 className="h-6 w-6 animate-pulse text-primary" />
                    </div>
                  </div>
                  <p className="text-sm font-medium">Transforming your image...</p>
                </motion.div>
              ) : resultImage ? (
                <motion.img
                  key="result"
                  src={resultImage}
                  alt="Result"
                  className="h-full w-full object-contain"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3 text-muted-foreground"
                >
                  <ImageIcon className="h-12 w-12 opacity-30" />
                  <p className="text-sm">Your transformed image appears here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {resultImage && (
            <motion.div
              className="mt-4 flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button size="sm" variant="outline" className="gap-1.5" onClick={handleDownload}>
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
              {provider && (
                <Badge variant="secondary" className="text-xs">
                  via {provider}
                </Badge>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
