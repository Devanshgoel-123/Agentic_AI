import React from "react";
import Link from "next/link";
import Image from "next/image";
import "./styles.scss";

import Box from "@mui/material/Box";

import { ZETA_INCENTIVES } from "@/utils/images";
import { CLAIM_ROUTE } from "@/utils/route";

export const ZetaIncentiveBanner = () => {
  return (
    <Link style={{ textDecoration: "none" }} href={CLAIM_ROUTE}>
      <Box className="ZetaIncentiveBannerContainer">
        <Box className="BannerDetails">
          <span className="BannerHeading">
            <span className="Green">$ZETA</span> Incentive Season is Here.
          </span>
          <span className="BannerSubHeading">
            Reward season has ended. Stay tuned for more.
          </span>
        </Box>
        <Box className="BannerImage">
          <picture>
            <Image
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              width={0}
              height={0}
              src={ZETA_INCENTIVES}
              alt="eddy"
              quality={100}
              priority={true}
            />
          </picture>
        </Box>
      </Box>
    </Link>
  );
};
