import React from "react";
import "./styles.scss";
import { motion } from "framer-motion";
import CustomIcon from "@/components/common/CustomIcon";
import Image from "next/image";
import {
  BINANCE_BANNER,
  BINANCE_LOGO_TEXT,
  CAMPAIGN_BG_SOLANA,
  EDDY_LOGO_TEXT,
} from "@/utils/images";
import { useRewardsStore } from "@/store/rewards-store";
import { SOLANA_LOGO } from "@/utils/images";
export const BinanceCampaign = () => {
  return (
    <motion.div 
    transition={{
      delay:0.2
    }}
    initial={{
      opacity:0
    }}
    animate={{
      opacity:1
    }}
    className="BinanceCampaignContainer">
      <div  className="centerImage">
      <Image src={SOLANA_LOGO} height={30} width={30} alt="solanaImage" className="image"/>
      </div>
      <div className="leftTopImage">
      <Image src={SOLANA_LOGO} height={30} width={30}  alt="solanaImage"  className="image"/>
      </div>
      <div className="rightTopImage">
      <Image src={SOLANA_LOGO} height={30} width={30}  alt="solanaImage" className="image"/>
      </div>
      <div className="leftBottomImage">
      <Image src={SOLANA_LOGO} height={30} width={30}  alt="solanaImage" className="image"/>
      </div>
      <div className="rightBottomImage">
      <Image src={SOLANA_LOGO} height={30} width={30}  alt="solanaImage" className="image"/>
      </div>    
      <div className="HeadingContainer">
        <div className="Logo">
          <CustomIcon src={EDDY_LOGO_TEXT} />
          </div>
        </div>
      <div className="DetailsContainer">
      <span className="Heading">Solana Campaign is Live</span>
        <span className="SubHeading">
        <span className="Green">$10,000</span>Reward Pool
        </span>
      </div>
    </motion.div>
  );
};
