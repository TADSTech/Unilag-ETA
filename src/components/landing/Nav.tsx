import { Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/hooks/use-auth-modal";

export function Nav() {
  const { openModal } = useAuthModal();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bus className="h-5 w-5" />
          </span>
          Shuttle ETA
        </a>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#problem" className="hover:text-foreground">
            Problem
          </a>
          <a href="#how" className="hover:text-foreground">
            How it works
          </a>
          <a href="#demo" className="hover:text-foreground">
            Demo
          </a>
          <a href="#roadmap" className="hover:text-foreground">
            Roadmap
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => openModal("signin")}>
            Sign in
          </Button>
          <Button onClick={() => openModal("signup")}>Get started</Button>
        </div>
      </div>
    </header>
  );
}
