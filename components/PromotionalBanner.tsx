'use client'

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCallback } from "react";

export default function PromotionalBanner() {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (api) {
        api.scrollNext();
      }
    }, 2000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [api]);

  const handleSelect = useCallback((api: any) => setApi(api), []);

  return (
    <div className="w-full p-8">
      <Carousel
        className="w-full"
        onSelect={handleSelect}
      >
        <CarouselPrevious className="absolute left-0 z-10 p-2">Prev</CarouselPrevious>
        <CarouselContent className="w-full">
          <CarouselItem className="flex items-center justify-center w-full h-auto">
            <img
              src="https://i.ibb.co/0VKNx6C/IamBlack.png"
              alt="BannerCarrusel"
              className="rounded-lg"
            />
          </CarouselItem>
          <CarouselItem className="flex items-center justify-center w-full h-auto">
            <img
              src="https://i.ibb.co/0903M70/2.png"
              alt="BannerCarrusel"
              className="rounded-lg"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselNext className="absolute right-0 z-10 p-2">Next</CarouselNext>
      </Carousel>
  
    </div>
  );
}

