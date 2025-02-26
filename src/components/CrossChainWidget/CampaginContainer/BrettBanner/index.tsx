import React from "react";
import "./styles.scss";
import CustomIcon from "@/components/common/CustomIcon";
import { DEGEN_LOGO,BRETT_LOGO} from "@/utils/images";

import Image from "next/image";
export const BrettBanner = () => {
  return (
    <div className="BrettBannerContainer">
      <div className="TokenContainer">
        <div className="Logo1">
          <Image src={DEGEN_LOGO} height={20} width={20} alt="logoImage"className="degenImage" />
        </div>
        <div className="Logo2">
          <Image src={BRETT_LOGO} height={20} width={20} alt="logoImage" className="degenImage" />
        </div>
      </div>
      <div className="BannerText">
        <div>
        <span className="bannerHeader">Meme Tokens now on EDDY</span>
        </div>
        <div>
        <span className="bannerTokenName">DEGEN & BRETT</span> available on <span className="baseText">BASE</span>
      </div>
    </div>
    </div>
  );
};
