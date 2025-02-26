import React, { Suspense, useCallback, useEffect, useState } from "react";
import "./styles.scss";
import { motion } from "framer-motion";

import useEmblaCarousel from "embla-carousel-react";

import Autoplay from "embla-carousel-autoplay";
import { EmblaCarouselType } from "embla-carousel";
import dynamic from "next/dynamic";
import Link from "next/link";

const DynamicSolanaBanner=dynamic(
  ()=>import("./SolanaBanner").then((mod)=>mod.SolanaBanner),
  {
    ssr:false,
    loading:()=><div className="DynamicPlace"></div>
  }
)

const DynamicZeroFeeBanner=dynamic(
  ()=>import("./ZeroFeeBanner").then((mod)=>mod.ZeroFeeBanner),
  {
    ssr:false,
    loading:()=><div className="DynamicPlace"></div>,
  }
)

const DynamicDustContainer=dynamic(
  ()=>import("./DustBanner").then((mod)=>mod.DustCampaign),
  {
    ssr:false,
    loading:()=><div className="DynamicPlace"></div>,
  }
)

const DynamicBrettContainer=dynamic(
  ()=>import("./BrettBanner").then((mod)=>mod.BrettBanner),
  {
    ssr:false,
    loading:()=><div className="DynamicPlace"></div>,
  }
)

const DynamicCbBTCContainer=dynamic(
  ()=>import("./cbBTCBanner").then((mod)=>mod.CBBTCBanner),
  {
    ssr:false,
    loading:()=><div className="DynamicPlace"></div>
  }
)

const DynamicAeroDromeContainer=dynamic(
  ()=>import("./AerodromeBanner").then((mod)=>mod.AeroDromeBanner),
  {
    ssr:false,
    loading:()=><div className="DynamicPlace"></div>
  }
)

const DynamicBaseContainer=dynamic(
  ()=>import("./BaseBanner").then((mod)=>mod.BaseBanner),
  {
    ssr:false,
    loading:()=><div className="DynamicPlace"></div>
  }
)


type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

const useDotButton = (
  emblaApi: EmblaCarouselType | undefined
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

export const CampaginContainer = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000 }),
  ]);
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  return (
    <motion.div
      transition={{ delay: 0.2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="CampaignWrapper"
    >
      <div className="CampaignContainer embla" ref={emblaRef}>
        <div className="embla__container">
        <div className="embla__slide" key={1}>
          <DynamicSolanaBanner/>
          </div>
        <div className="embla__slide" key={3}>
          <Link href={"/dust-aggregator"} className="dustLink">
          <DynamicDustContainer/>
          </Link>   
          </div> 
          
        <div className="embla__slide" key={2}>
          <DynamicZeroFeeBanner/>
          </div>
          
        <div className="embla__slide" key={4}>
          <DynamicBrettContainer/>
          </div>
          <div className="embla__slide" key={5}>
            <DynamicAeroDromeContainer/>
          </div>
          <div className="embla__slide" key={6}>
           <DynamicCbBTCContainer/>

          </div>
          <div className="embla__slide" key={7}>
            <DynamicBaseContainer/>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
