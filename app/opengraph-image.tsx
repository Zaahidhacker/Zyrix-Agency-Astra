import { ImageResponse } from "next/og";
export const alt = "Zyrix | Premium websites. Half the market price.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#101112",
        color: "#f1f1eb",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 28,
        }}
      >
        <span>zyrix ✳</span>
        <span style={{ fontSize: 18 }}>SRI LANKAN WEBSITE AGENCY</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 94,
          fontWeight: 700,
          letterSpacing: -5,
          lineHeight: 1,
        }}
      >
        <span>BIG WEBSITES.</span>
        <span>
          HALF THE <span style={{ color: "#d3a525" }}>PRICE.</span>
        </span>
      </div>
      <div style={{ display: "flex", fontSize: 19, letterSpacing: 2 }}>
        STRATEGY × DESIGN × DEVELOPMENT
      </div>
    </div>,
    size,
  );
}
