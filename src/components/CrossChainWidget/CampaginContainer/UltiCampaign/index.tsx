import React from "react";
import "./styles.scss";

import Image from "next/image";
import { ULTI_BANNER } from "@/utils/images";

export const UltiCampaign = () => {
  return (
    <div className="UltiCampaignContainer">
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
            src={ULTI_BANNER}
            alt="eddy"
            priority={true}
          />
        </picture>
      </div>
      <div className="BannerDetails">
        <span className="BannerHeading">
          <span className="Colored">$5000</span> in Rewards over next 4 Weeks
        </span>
        <span className="BannerSubHeading">
          Swap and get a chance to win from a pool of $5000
        </span>
      </div>
    </div>
  );
};
