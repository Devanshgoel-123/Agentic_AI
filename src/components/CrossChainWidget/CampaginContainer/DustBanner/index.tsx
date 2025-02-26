import React from "react";
import "./styles.scss";
import { DUST_BANNER_UNION, DUST_BANNER_BLUE_TRIANGLE, DUST_BANNER_CIRCLE_BLUE, DUST_BANNER_CIRCLE_RED, DUST_BANNER_CIRCLE_GREEN, DUST_BANNER_FLUO_TRIANGLE, DUST_BANNER_YELLOW_TRIANGLE,DUST_BANNER_VECTOR} from "@/utils/images";
import Image from "next/image";
import Link from "next/link";
export const DustCampaign = () => {
  return (
    <div className="DustCampaignContainer" >
        <Image src={DUST_BANNER_UNION} height={20} width={20} alt="union" className="imageUnion1"/>
        <Image src={DUST_BANNER_BLUE_TRIANGLE} height={20} width={20} alt="union" className="imageTriangle1"/>
        <Image src={DUST_BANNER_CIRCLE_RED} height={10} width={10} alt="union"className="imageCircle1" />
        <Image src={DUST_BANNER_VECTOR} height={13} width={13} alt="union" className="imageUnion2"/>
        <Image src={DUST_BANNER_VECTOR} height={30} width={25} alt="union" className="imageUnion3"/>
        <Image src={DUST_BANNER_FLUO_TRIANGLE} height={10} width={10} alt="union" className="imageTriangle2"/>
        <Image src={DUST_BANNER_CIRCLE_GREEN} height={10} width={10} alt="union"className="imageCircle2" />
        <Image src={DUST_BANNER_YELLOW_TRIANGLE} height={15} width={15} alt="union" className="imageTriangle3"/>
        <Image src={DUST_BANNER_CIRCLE_BLUE} height={13} width={13} alt="union"className="imageCircle3" />
        <Image src={DUST_BANNER_UNION} height={10} width={10} alt="union" className="imageUnion4"/>

        <div className="DustBannerCenterText">
            <span>
            Dust Aggregator is Live
            </span>
        </div>
      
    </div>
  );
};
