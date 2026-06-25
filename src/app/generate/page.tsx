"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Download,
  Copy,
  RefreshCw,
  Shuffle,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { IMAGE_STYLES, IMAGE_SIZES, EXAMPLE_PROMPTS } from "@/lib/constants";
import { saveToGallery } from "@/lib/store";
import { GeneratedImage } from "@/lib/types";

function GeneratePageContent() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("none");
  const [size, setSize] = useState<"square" | "landscape" | "portrait">("square");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [lastProvider, setLastProvider] = useState<string | null>(null);

  useEffect(() => {
    const promptParam = searchParams.get("prompt");
    if (promptParam) setPrompt(promptParam);
  }, [searchParams]);

  const handleRandomPrompt = () => {
    const random = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    setPrompt(random);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), style, size }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Generation failed");
      }

      setGeneratedImage(data.image);
      setLastProvider(data.provider || "unknown");

      // Save to local gallery
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        prompt: prompt.trim(),
        style,
        size,
        provider: data.provider || "unknown",
        imageUrl: data.image,
        createdAt: new Date().toISOString(),
      };
      saveToGallery(newImage);

      toast.success("Image generated!", {
        description: `Provider: ${data.provider}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error("Generation failed", { description: message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `pixora-${Date.now()}.png`;
    link.click();
    toast.success("Image downloaded!");
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied!");
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Generate Image</h1>
        <p className="mt-1 text-muted-foreground">
          Describe what you want to see and let AI create it.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,1fr]">
        {/* Left: Controls */}
        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="prompt" className="text-sm font-medium">
                Prompt
              </Label>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={handleRandomPrompt}
                >
                  <Shuffle className="h-3 w-3" />
                  Random
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={handleCopyPrompt}
                  disabled={!prompt}
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
              </div>
            </div>
            <Textarea
              id="prompt"
              placeholder="A serene Japanese garden with cherry blossoms falling, golden hour lighting..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleGenerate();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Press <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">Ctrl</kbd> + <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">Enter</kbd> to generate
            </p>
          </div>

          {/* Style Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Style</Label>
            <Select value={style} onValueChange={(v) => v && setStyle(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a style" />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_STYLES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Size Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Size</Label>
            <div className="grid grid-cols-3 gap-2">
              {IMAGE_SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id as "square" | "landscape" | "portrait")}
                  className={`rounded-lg border px-3 py-2.5 text-center text-sm transition-colors ${
                    size === s.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-border/80 hover:bg-accent"
                  }`}
                >
                  <div className="font-medium">{s.label}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    {s.width}x{s.height}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quick prompts</Label>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_PROMPTS.slice(0, 6).map((p) => (
                <Badge
                  key={p}
                  variant="outline"
                  className="cursor-pointer text-[11px] transition-colors hover:bg-accent"
                  onClick={() => setPrompt(p)}
                >
                  {p.length > 35 ? p.slice(0, 35) + "..." : p}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Image Preview */}
        <div className="flex flex-col items-center">
          <Card className="relative w-full overflow-hidden bg-muted/30 border-dashed">
            <div
              className={`relative flex items-center justify-center ${
                size === "portrait"
                  ? "aspect-[3/4]"
                  : size === "landscape"
                  ? "aspect-[16/9]"
                  : "aspect-square"
              }`}
            >
              <AnimatePresence mode="wait">
                {isGenerating ? (
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
                        <Sparkles className="h-6 w-6 animate-pulse text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-sm font-medium">Creating your image...</p>
                      <p className="text-xs text-muted-foreground">
                        This usually takes 5-15 seconds
                      </p>
                    </div>
                  </motion.div>
                ) : generatedImage ? (
                  <motion.img
                    key="image"
                    src={generatedImage}
                    alt={prompt}
                    className="h-full w-full object-cover"
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
                    <p className="text-sm">Your generated image will appear here</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Image Actions */}
          {generatedImage && (
            <motion.div
              className="mt-4 flex gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button size="sm" variant="outline" className="gap-1.5" onClick={handleDownload}>
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate
              </Button>
              {lastProvider && (
                <Badge variant="secondary" className="text-xs">
                  via {lastProvider}
                </Badge>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12">Loading...</div>}>
      <GeneratePageContent />
    </Suspense>
  );
}
