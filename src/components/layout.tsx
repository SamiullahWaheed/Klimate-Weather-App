import type { PropsWithChildren } from "react";
import { Header } from "./header";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-15%] h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[380px] w-[380px] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[20%] h-[440px] w-[440px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>
      <Header />
      <main className="min-h-screen container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-border/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 dark:border-white/10">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Made with 💗 by <a className="text-primary hover:text-primary/80 transition-colors" href="https://samiullahwaheedportfolio.netlify.app/" target="_blank" rel="noopener noreferrer">@Samiullah Waheed</a> </p>
        </div>
      </footer>
    </div>
  );
}
