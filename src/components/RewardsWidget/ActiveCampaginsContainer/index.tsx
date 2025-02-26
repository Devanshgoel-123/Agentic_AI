"use client"
import "./styles.scss";
import { useCallback, useEffect,useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { EmblaCarouselType } from "embla-carousel";
import { useMediaQuery } from "@mui/material";
import { Box } from "@mui/material";
type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

const DynamicBinanceCampaignContainer=dynamic(
  ()=>import("./Campagins/BinanceCampagin").then((mod)=>mod.BinanceCampaign),
  {
    ssr:false,
    loading:()=><div className="DynamicCampaignDiv"></div>
  }
)
const DynamicSeason1CampaignContainer=dynamic(
  ()=>import("./Campagins/Season1Campagin").then((mod)=>mod.Season1Campaign),
  {
    ssr:false,
    loading:()=><div className="DynamicCampaignDiv"></div>
  }
)

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


export const ActiveCampaignContainer = () => {
  const mobileDevice = useMediaQuery("(max-width:600px)");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000 }),
  ]);
  const { selectedIndex, scrollSnaps, onDotButtonClick } =useDotButton(emblaApi);
  return (
    <div className="ActiveCampaignContainer">
      {mobileDevice ? (
        <motion.div
          transition={{ delay: 0.2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="CampaignWrapper"
        >
          <div className="ActiveCampaign embla" ref={emblaRef}>
          <div className="embla__container">
              <div className="embla__slide">
                <DynamicBinanceCampaignContainer />
              </div>
              <div className="embla__slide">
                <DynamicSeason1CampaignContainer />
              </div>
          </div>
          </div>
          <div className="PaginationDotWrapper">
          <div className="paginationDots" style={{background: selectedIndex===0 ? '#959595' : 'white', border: '1px solid black' }} onClick={()=>{
            onDotButtonClick(0)
          }}/>  
          <div className="paginationDots" style={{background: selectedIndex===1 ? '#959595' : 'white', border: '1px solid black' }} onClick={()=>{
            onDotButtonClick(1)
          }}/>  
          </div>
         
        </motion.div>
      ) : (
        <>
          <div className="ActiveCampaign">
            <DynamicBinanceCampaignContainer />
          </div>
          <div className="ActiveCampaign">
            <DynamicSeason1CampaignContainer />
          </div>
        </>
      )}
    </div>
  );
};



