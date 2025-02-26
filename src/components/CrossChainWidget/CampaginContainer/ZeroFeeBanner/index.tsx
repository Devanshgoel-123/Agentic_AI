import React from "react";
import Image from "next/image";
import "./styles.scss";
import Box from "@mui/material/Box";
import { ZERO_FEE } from "@/utils/images";

export const ZeroFeeBanner = () => {
  return (
    <Box className="BannerContainer">
      <Box className="BannerDetails">
        <span className="BannerHeading">0% Fees!</span>
        <span className="BannerSubHeading">
          Enjoy 0% protocol Fees across platform
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
            src={ZERO_FEE}
            alt="eddy"
            priority={true}
          />
        </picture>
      </Box>
    </Box>
  );
};
