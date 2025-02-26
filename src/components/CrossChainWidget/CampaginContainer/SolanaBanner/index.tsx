import React from "react";
import "./styles.scss";
import Image from "next/image";
import { SOLANA_LOGO } from "@/utils/images";

export const SolanaBanner = () => {
  return (
    <div className="SolanaCampaignContainer">
        <div className="SolanaBannerText">
        <span className="SolanaText">Solana</span>
        <div className="BannerImage">
          <Image
            src={SOLANA_LOGO}
            priority={true}
            height={30}
            width={30}
            alt="solana_logo"
          />
      </div>
      <div className="isLiveText">
        <span>is</span>
        <span>Live </span>
      </div>
        </div>
    </div>
  );
};