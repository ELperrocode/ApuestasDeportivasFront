'use client';

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function PromotionalBanner() {
  const [activePromo, setActivePromo] = useState(0);

  return (
    <div className="w-full mb-8">
      <Carousel
        className="w-full"
        onSelect={(index) => setActivePromo(index)}
      >
        <CarouselContent className="w-full">
          <CarouselItem className="flex items-center justify-center w-full h-96">
            <img
              src="https://i.ibb.co/jHrg9gs/Iam-Black-3.png"
              alt="BannerCarrusel"
              className="rounded-lg"
            />
          </CarouselItem>
          <CarouselItem className="flex items-center justify-center w-full h-96">
            <img
              src="https://i.ibb.co/0903M70/2.png"
              alt="BannerCarrusel"
              className="rounded-lg"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
}