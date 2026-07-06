import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import {
  ProblemStrip,
  HowItWorks,
  LiveDemoWidget,
  WhyItWorks,
  Roadmap,
  Footer,
} from "@/components/landing/Sections";
import { AuthModalProvider } from "@/hooks/use-auth-modal";
import { AuthModal } from "@/components/auth/AuthModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shuttle ETA — Know when the UNILAG shuttle is coming" },
      {
        name: "description",
        content:
          "Real-time shuttle arrival predictions for UNILAG students. No GPS, no app download — just tap when you board. Built for the PESSA Innovation Challenge.",
      },
      { property: "og:title", content: "Shuttle ETA — Know when the UNILAG shuttle is coming" },
      {
        property: "og:description",
        content:
          "Real-time shuttle ETA powered by student taps. No hardware. No app. No cost to the school.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <AuthModalProvider>
      <div className="min-h-screen bg-background">
        <Nav />
        <main>
          <Hero />
          <ProblemStrip />
          <HowItWorks />
          <LiveDemoWidget />
          <WhyItWorks />
          <Roadmap />
        </main>
        <Footer />
      </div>
      <AuthModal />
    </AuthModalProvider>
  );
}
