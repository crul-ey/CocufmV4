import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cocúfum - Premium Lifestyle & Zomerproducten",
    short_name: "Cocúfum",
    description:
      "Ontdek onze luxe collectie van strandhanddoeken, lifestyle producten en zomer essentials. Premium kwaliteit voor jouw perfecte zomer.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5f3",
    theme_color: "#1c1917",
    orientation: "portrait-primary",
    categories: ["shopping", "lifestyle", "fashion"],
    lang: "nl",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshot-narrow.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  }
}
