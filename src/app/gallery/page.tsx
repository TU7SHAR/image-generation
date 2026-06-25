"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Download, ImageIcon, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getGallery, removeFromGallery, clearGallery } from "@/lib/store";
import { GeneratedImage } from "@/lib/types";


export default function GalleryPage() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    setImages(getGallery());
  }, []);

  const handleDelete = (id: string) => {
    removeFromGallery(id);
    setImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedImage(null);
    toast.success("Image removed from gallery");
  };

  const handleClearAll = () => {
    clearGallery();
    setImages([]);
    toast.success("Gallery cleared");
  };


  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement("a");
    link.href = image.imageUrl;
    link.download = `pixora-${image.id.slice(0, 8)}.png`;
    link.click();
    toast.success("Image downloaded!");
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="mt-1 text-muted-foreground">
            Your generated images, stored locally on this device.
          </p>
        </div>
        {images.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Clear All
          </Button>
        )}
      </div>


      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
          <h3 className="mt-4 text-lg font-medium">No images yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate your first image and it will appear here.
          </p>
          <Link href="/generate" className={cn(buttonVariants(), "mt-6 gap-2")}>
              <Sparkles className="h-4 w-4" />
              Generate Image
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {images.map((image, i) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden border-border/50 transition-all hover:border-border hover:shadow-lg"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={image.prompt}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {image.prompt}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {image.style}
                      </Badge>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDate(image.createdAt)}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}


      {/* Image Detail Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium">Image Details</DialogTitle>
            <DialogDescription className="text-xs">
              {selectedImage?.prompt}
            </DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.prompt}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary">{selectedImage.style}</Badge>
                  <Badge variant="outline">{selectedImage.size}</Badge>
                  <Badge variant="outline">{selectedImage.provider}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleDownload(selectedImage)}>
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Download
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(selectedImage.id)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
