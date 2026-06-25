# Pixora — AI Image Generation

A beautiful, SaaS-quality AI image generation app built with Next.js.
Generate stunning images from text using free, open-source AI models.

## Features

- **Multi-provider cascade** — Cloudflare Workers AI → Together AI → HuggingFace
- **12+ art styles** — Photorealistic, Anime, Digital Art, Watercolor, Cyberpunk, and more
- **Multiple sizes** — Square (1024x1024), Landscape (1280x768), Portrait (768x1280)
- **Local gallery** — Images saved to localStorage, no server storage
- **Dark/Light mode** — Gorgeous UI in both themes
- **Fully responsive** — Works great on mobile and desktop
- **Zero sign-up** — Start generating immediately

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **AI Providers:** Cloudflare Workers AI, Together AI, HuggingFace
- **Models:** FLUX.1 Schnell (Apache 2.0)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up API keys

Copy `.env.example` to `.env.local` and add your keys:

```bash
cp .env.example .env.local
```

Get free API keys from:
- **Cloudflare:** https://dash.cloudflare.com → AI → Workers AI
- **HuggingFace:** https://huggingface.co/settings/tokens
- **Together AI:** https://api.together.xyz/settings/api-keys

> You only need ONE provider to work. The app cascades through them.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy to Vercel in one click:

```bash
npm run build
```

Or deploy to any platform that supports Next.js.

## License

MIT
