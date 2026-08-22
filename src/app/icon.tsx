import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6b2d3c",
          color: "#e4c79a",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        ∞
      </div>
    ),
    size,
  );
}
