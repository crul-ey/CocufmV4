"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageNode {
  url: string;
  altText: string | null;
}

interface Props {
  images: ImageNode[];
}

export default function ProductImageGallery({ images }: Props) {
  // Houd bij welke afbeelding de 'actieve' is
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square relative bg-stone-100 rounded-2xl flex items-center justify-center">
        <p className="text-stone-500">Geen afbeelding beschikbaar</p>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="space-y-4">
      {/* Hoofdafbeelding */}
      <div className="aspect-square relative bg-stone-50 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={activeImage.url}
          alt={activeImage.altText ?? "Productafbeelding"}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 90vw, 45vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={image.url}
              onClick={() => setActiveIndex(index)}
              className={`aspect-square relative rounded-lg overflow-hidden transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-stone-400
              ${
                activeIndex === index
                  ? "ring-2 ring-stone-900 shadow-md"
                  : "opacity-70 hover:opacity-100 hover:scale-105"
              }
              `}
            >
              <Image
                src={image.url}
                alt={image.altText ?? `Productafbeelding ${index + 1}`}
                fill
                className="object-cover"
                sizes="20vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
