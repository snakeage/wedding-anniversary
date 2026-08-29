import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { EventContent } from "@/content/types";

export const invitationOgSize = { width: 1200, height: 630 };

export async function invitationOgImage(event: EventContent) {
  const font = await readFile(
    join(process.cwd(), "src/app/fonts/CormorantGaramond-SemiBold.woff"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4efe6",
          color: "#2c2420",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 36,
            border: "1px solid #c4a574",
          }}
        />
        <div
          style={{
            fontSize: 22,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#6b2d3c",
          }}
        >
          {event.kicker}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 84,
            fontFamily: "Cormorant",
            lineHeight: 1,
          }}
        >
          {event.couple.one}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 32,
            fontFamily: "Cormorant",
            fontStyle: "italic",
            color: "#c4a574",
          }}
        >
          и
        </div>
        <div
          style={{
            fontSize: 84,
            fontFamily: "Cormorant",
            lineHeight: 1,
          }}
        >
          {event.couple.two}
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 24,
            color: "#2c2420cc",
          }}
        >
          {event.tagline}
        </div>
      </div>
    ),
    {
      ...invitationOgSize,
      fonts: [
        {
          name: "Cormorant",
          data: font,
          weight: 600,
          style: "normal",
        },
      ],
    },
  );
}
