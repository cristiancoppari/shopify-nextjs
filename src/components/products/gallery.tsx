"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";

import { Button } from "~/components/ui/button";
import { useProduct, useUpdateUrl } from "~/context/product-context";

import { GridTileImage } from "../grid/grid-tile-image";

export default function Gallery({
  images,
}: {
  images: {
    url: string;
    altText: string;
  }[];
}) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateUrl();
  const imageIndex = state.image ? parseInt(state.image!) : 0;
  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const prevImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  return (
    <form>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {images[imageIndex] && (
          <Image
            src={images[imageIndex]?.url}
            alt={images[imageIndex]?.altText}
            sizes="(min-width: 1024px) 66vw, 100vw"
            fill
            className="object-cover transition-transform hover:scale-105"
            priority
          />
        )}

        {images.length > 1 && (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur">
              <Button
                type="button"
                formAction={() => {
                  const newState = updateImage(prevImageIndex.toString());
                  updateURL(newState);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                formAction={() => {
                  const newState = updateImage(nextImageIndex.toString());
                  updateURL(newState);
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {images.length > 1 && (
          <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
            {images.map((image, i) => {
              const isActive = imageIndex === i;
              return (
                <li key={i} className="h-20 w-20">
                  <Button
                    type="button"
                    formAction={() => {
                      const newState = updateImage(i.toString());
                      updateURL(newState);
                    }}
                  >
                    <GridTileImage src={image.url} alt={image.altText} width={80} height={80} active={isActive} />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </form>
  );
}
