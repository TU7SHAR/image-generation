import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{APP_NAME} — Open source AI image generation</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Powered by open-source AI models. No data stored on servers.
        </p>
      </div>
    </footer>
  );
}
