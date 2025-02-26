import React from "react";
import "./styles.scss";
import Image from "next/image";
import {AERODROME_LOGO} from "@/utils/images";
export const AeroDromeBanner = () => {
  return (
    <div className="AerodromeContainer">
      <div className="BannerText">
        <p className="aerodromeHeaderBg">AERODROME TOKEN LIVE</p>
        <p className="aerodromeHeader">AERODROME TOKEN LIVE</p>
        <div className="textContainer">
          <span className="onText">on</span>
          <span className="baseText">BASE</span>
      </div>
    </div>
    <div className="TokenContainer">
          <Image src={AERODROME_LOGO} height={35} width={35} className="aerodromeImage" alt="aeroImage"/>
      </div>
    </div>
  );
};
