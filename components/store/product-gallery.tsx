"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useState } from "react";
import type { ProductImage } from "@/lib/commerce/types";

export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  const [selected, setSelected] = useState(0);
  const photos = images.filter((image) => image.url);
  const current = photos[selected] || photos[0];
  const multiple = photos.length > 1;
  const move = (direction: number) =>
    setSelected((index) => (index + direction + photos.length) % photos.length);

  return (
    <div
      className="gallery"
      role="group"
      aria-label={`${name} product pictures`}
      onKeyDown={(event) => {
        if (!multiple || !["ArrowLeft", "ArrowRight"].includes(event.key))
          return;
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      }}
    >
      <div className="gallery-main">
        {current ? (
          <Image
            key={current.url}
            src={current.url}
            alt={current.alt || name}
            fill
            sizes="(max-width: 800px) 90vw, 50vw"
            preload={selected === 0}
            placeholder={current.lqip ? "blur" : "empty"}
            blurDataURL={current.lqip}
          />
        ) : (
          <Package
            className="gallery-placeholder"
            size={64}
            strokeWidth={1}
            aria-label="Product photo unavailable"
          />
        )}
        {multiple && (
          <div className="gallery-navigation">
            <button
              type="button"
              aria-label="Previous product picture"
              onClick={() => move(-1)}
            >
              <ChevronLeft size={19} />
            </button>
            <span aria-live="polite" aria-atomic="true">
              {selected + 1} / {photos.length}
            </span>
            <button
              type="button"
              aria-label="Next product picture"
              onClick={() => move(1)}
            >
              <ChevronRight size={19} />
            </button>
          </div>
        )}
      </div>
      {multiple && (
        <div
          className="gallery-thumbnails"
          aria-label="Choose a product picture"
        >
          {photos.map((photo, index) => (
            <button
              key={`${photo.url}-${index}`}
              type="button"
              aria-label={
                index === 0
                  ? "View main product picture"
                  : `View additional picture ${index}`
              }
              aria-pressed={selected === index}
              className={selected === index ? "selected" : ""}
              onClick={() => setSelected(index)}
            >
              <Image
                src={photo.url}
                alt={photo.alt || name}
                width={76}
                height={76}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
