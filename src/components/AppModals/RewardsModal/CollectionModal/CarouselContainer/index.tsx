"use client"

import Box from "@mui/material/Box"
import { NFT_CAPTAIN, NFT_VOYAGER, NFT_MARINER, NFT_NAVIGATOR, NFT_SKIPPER } from "@/utils/images"
import Image from "next/image"
import { StackedCarousel, ResponsiveContainer, StackedCarouselSlideProps } from 'react-stacked-center-carousel'
import "./styles.scss"
import { useState, useMemo, useRef } from "react"
import useWalletConnectStore from "@/store/wallet-store"
import { useShallow } from "zustand/react/shallow"
import React from "react"
import { NFTConfig } from "@/store/types/token-type"
import { useAccount } from "wagmi"
import { userRewardPoints } from "@/store/types/token-type"
interface CardProps extends StackedCarouselSlideProps {
  data: NFTConfig[];
  dataIndex: number;
}
interface PaginationProps{
  data:NFTConfig[],
  centerSlideDataIndex:number
}

const Card = React.memo((props: CardProps) => {
  const { data, dataIndex } = props;
  const nft = data[dataIndex];

  return (
    <Box className="card-container">
      <Image
        alt={nft.alt || "nft image"}
        draggable={false}
        src={nft.image}
        height={200}
        width={150}
        className="nft-image"
      />
    </Box>
  );
});

Card.displayName = "Card";

function Pagination(props:PaginationProps ) {
  return (
          <Box className="pagination">
              {props.data.map((_, index) => {
                  const isCenterSlide = props.centerSlideDataIndex === index;
                  return <Box className="paginationDots" key={index} style={{background: isCenterSlide ? '#959595' : 'white', border: '1px solid black' }}/>
              })}
          </Box>
  );
}


export const CarouselContainer = () => {
  const ref = useRef<StackedCarousel>();
  const [centerSlideDataIndex, setCenterSlideDataIndex] = React.useState(1);
  const onCenterSlideDataIndexChange = (newIndex: number) => {
      setCenterSlideDataIndex(newIndex);
  };
  const {address}=useAccount();
  const {
      userRewardPointsArray
  }=useWalletConnectStore(useShallow((state)=>({
      userRewardPointsArray:state.userRewardPoints
  })))
  const pointsArray:userRewardPoints[] = useMemo(() => {
    return (
      Array.isArray(userRewardPointsArray) && userRewardPointsArray?.filter((item: userRewardPoints) => {
        return item.walletAddress === address;
      }) || []
    );
  }, [userRewardPointsArray, address]);
  const nftConfig: NFTConfig[] = useMemo(() => [
    { 
      image: NFT_CAPTAIN, 
      alt: "NFT Captain", 
      name: "nftCaptain", 
      value: pointsArray[0]?.nftCaptain || 0,
    },
    { 
      image: NFT_MARINER, 
      alt: "NFT Mariner", 
      name: "nftMariner", 
      value: pointsArray[0]?.nftMariner || 0,
    },
    { 
      image: NFT_VOYAGER,
      alt: "NFT Voyager", 
      name: "nftVoyager", 
      value: pointsArray[0]?.nftVoyager || 0,

    },
    { 
      image: NFT_NAVIGATOR,
      alt: "NFT Navigator", 
      name: "nftNavigator", 
      value: pointsArray[0]?.nftNavigator || 0,
    },
    { 
      image: NFT_SKIPPER,
      alt: "NFT Skipper", 
      name: "nftSkipper", 
      value: pointsArray[0]?.nftSkipper|| 0,
    }
  ], [pointsArray]);

  const ownedNfts = useMemo(() => 
     nftConfig.filter(nft => nft.value > 0),
  [nftConfig]);

  if (!pointsArray.length || ownedNfts.length === 0) {
    return <Box className="carousel-container">No NFTs available</Box>;
  }else if(ownedNfts.length>1){
      return ( <Box className="carousel-wrapper">
        <ResponsiveContainer
          carouselRef={ref}
          render={(parentWidth, carouselRef) => {
            let slideWidth=115;
            let maxVisibleSlide= ownedNfts.length>3 ? 5: 3;
            return (
              <StackedCarousel
                ref={carouselRef}
                data={ownedNfts}
                carouselWidth={parentWidth}
                slideWidth={slideWidth}
                slideComponent={Card}
                maxVisibleSlide={maxVisibleSlide}
                currentVisibleSlide={0}
                useGrabCursor
                onActiveSlideChange={onCenterSlideDataIndexChange}
              />
            );
          }}
          />
          <Pagination centerSlideDataIndex={centerSlideDataIndex} data={ownedNfts}/>
        </Box>
        )
  }else{
      return (
        <Box className="carousel-wrapper">
          <Image alt={ownedNfts[0].alt} src={ownedNfts[0].image} key={ownedNfts[0].name} height={140} width={110}></Image>
          <Pagination centerSlideDataIndex={centerSlideDataIndex} data={ownedNfts}/>
        </Box>
      )
    }
  };

