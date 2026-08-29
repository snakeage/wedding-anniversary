import Background from "@/components/Background";
import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Hero } from "@/components/Hero";
import { RsvpForm } from "@/components/RsvpForm";
import { SiteHeader } from "@/components/SiteHeader";
import { VenueMap } from "@/components/VenueMap";
import type { EventContent } from "@/content/types";

export function QuietLuxury({ event }: { event: EventContent }) {
  return (
    <>
      <Background />
      <GrainOverlay />
      <SiteHeader event={event} />
      <main className="relative z-10">
        <Hero event={event} />
        <Countdown event={event} />
        <Gallery event={event} />
        <Details event={event} />
        <VenueMap event={event} />
        <RsvpForm />
        <Footer event={event} />
      </main>
    </>
  );
}
