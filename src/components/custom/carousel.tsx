"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function Carousel() {
  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()]);

  return (
    <div className="embla rounded-xl" ref={emblaRef}>
      <div className="embla__container">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="embla__slide">
            <Image
              src={`/banner.png`}
              alt={`Slide ${i + 1}`}
              width={1000}
              height={500}
              className="h-[50dvh] w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
