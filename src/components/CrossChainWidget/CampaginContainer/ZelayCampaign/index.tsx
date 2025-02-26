import React from "react";
import Image from "next/image";
import { ZEALY_BANNER } from "@/utils/images";
import "./styles.scss";

export const ZealyCampaign = () => {
  const openCampaignLink = () => {
    const url = "https://zealy.io/cw/eddyfinance-3679/questboard";
    window.open(url, "target:blank");
  };
  return (
    <div className="ZealyBannerContainer" onClick={openCampaignLink}>
      <div className="BannerImage">
        <picture>
          <Image
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            width={0}
            height={0}
            src={ZEALY_BANNER}
            alt="eddy"
            priority={true}
          />
        </picture>
      </div>
      <div className="BannerDetails">
        <span className="BannerHeading">
          <span className="Green">$100</span> Daily Rewards{" "}
        </span>
        <span className="BannerSubHeading">
          Get registered for a chance to win <span className="Green">$100</span>{" "}
          daily.
        </span>
      </div>
    </div>
  );
};
