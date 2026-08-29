import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { demoEvent } from "@/events";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const title = `${demoEvent.couple.one} & ${demoEvent.couple.two} — годовщина свадьбы`;

export const metadata: Metadata = {
  title,
  description: demoEvent.inviteLead,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title,
    description: demoEvent.inviteLead,
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: demoEvent.inviteLead,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream font-sans text-ink">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
