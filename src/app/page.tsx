"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Shield,
  Palette,
  ArrowRight,
  Image as ImageIcon,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_NAME, APP_TAGLINE, EXAMPLE_PROMPTS } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate images in seconds using optimized AI pipelines with multi-provider fallback.",
  },
  {
    icon: Shield,
    title: "100% Free & Private",
    description: "No data stored on servers. Your prompts and images stay on your device.",
  },
  {
    icon: Palette,
    title: "12+ Art Styles",
    description: "From photorealistic to anime, watercolor to cyberpunk — pick your aesthetic.",
  },
  {
    icon: ImageIcon,
    title: "Multiple Sizes",
    description: "Generate square, landscape, or portrait images. Perfect for any use case.",
  },
  {
    icon: Wand2,
    title: "Smart Enhancement",
    description: "AI-powered prompt enhancement ensures you get the best possible results.",
  },
  {
    icon: Sparkles,
    title: "Open Source",
    description: "Fully open-source. Fork it, modify it, self-host it. The code is yours.",
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Gradient background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-[300px] w-[400px] rounded-full bg-gradient-to-l from-blue-500/8 to-purple-500/8 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Powered by open-source AI models
            </Badge>
          </motion.div>

          <motion.h1
            className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              {APP_TAGLINE}
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Transform your ideas into stunning visuals with {APP_NAME}. Free, fast, and powered by
            state-of-the-art open-source AI models.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/generate" className={cn(buttonVariants({ size: "lg" }), "group gap-2 px-8")}>
                Start Generating
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/gallery" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2 px-8")}>
              View Gallery
            </Link>
          </motion.div>

          {/* Example prompts */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="mb-3 text-sm text-muted-foreground">Try something like:</p>
            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2">
              {EXAMPLE_PROMPTS.slice(0, 4).map((prompt) => (
                <Link key={prompt} href={`/generate?prompt=${encodeURIComponent(prompt)}`}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer px-3 py-1.5 text-xs transition-colors hover:bg-accent"
                  >
                    {prompt.length > 45 ? prompt.slice(0, 45) + "..." : prompt}
                  </Badge>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-border/40 px-4 py-20 md:py-28">
        <div className="container mx-auto">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need
            </h2>
            <p className="mt-3 text-muted-foreground">
              A complete AI image generation toolkit, free and open source.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group rounded-xl border border-border/50 bg-card/50 p-6 transition-colors hover:border-border hover:bg-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t border-border/40 px-4 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to create?
          </h2>
          <p className="mt-3 text-muted-foreground">
            No sign-up required. Start generating images right now.
          </p>
          <Link href="/generate" className={cn(buttonVariants({ size: "lg" }), "mt-8 gap-2 px-8")}>
              <Sparkles className="h-4 w-4" />
              Generate your first image
          </Link>
        </div>
      </section>
    </div>
  );
}
