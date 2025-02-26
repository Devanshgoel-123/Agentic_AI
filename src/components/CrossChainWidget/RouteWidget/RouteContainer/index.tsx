import React, { Fragment } from "react";
import "./styles.scss";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";

import CustomIcon from "@/components/common/CustomIcon";
import { ARROW_RIGHT, SWAP_HORIZONTAL_LOGO } from "@/utils/images";
import { RouteImage } from "@/store/types/transaction-type";

interface Props {
  sourceChainRoute: RouteImage | undefined;
  intermediate: RouteImage[] | undefined;
  destinationRoute: RouteImage | undefined;
}

export const RouteContainer = ({
  sourceChainRoute,
  intermediate,
  destinationRoute,
}: Props) => {
  return (
    <Box className="RouteContainer">
      {sourceChainRoute && (
        <>
          <motion.div
            transition={{ delay: 0.2 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="RouteToken"
          >
            <CustomIcon src={sourceChainRoute.tokenImage} />
            <Box className="ChainLogo">
              <CustomIcon src={sourceChainRoute.chainImage} />
            </Box>
          </motion.div>
          <Box className="ArrowIcon">
            <CustomIcon src={ARROW_RIGHT} />
          </Box>
        </>
      )}
      {intermediate &&
        intermediate.length === 1 &&
        intermediate.map((item, index) => (
          <Fragment key={index}>
            <motion.div
              transition={{ delay: 0.2 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="RouteToken"
            >
              <CustomIcon src={item.tokenImage} />
              <Box className="ChainLogo">
                <CustomIcon src={item.chainImage} />
              </Box>
            </motion.div>
            <Box className="ArrowIcon">
              <CustomIcon src={ARROW_RIGHT} />
            </Box>
          </Fragment>
        ))}
      {intermediate && intermediate.length > 1 && (
        <>
          <Box className="RouteGreenContainer">
            {intermediate.map((item, index) => (
              <Fragment key={index}>
                <Box className="SwapTokenContainer">
                  <Box className="TokenLogo">
                    <CustomIcon src={item.tokenImage} />
                  </Box>
                </Box>
                {index !== intermediate.length - 1 && (
                  <Box className="SwapLogo">
                    <CustomIcon src={SWAP_HORIZONTAL_LOGO} />
                  </Box>
                )}
              </Fragment>
            ))}
          </Box>
          <Box className="ArrowIcon">
            <CustomIcon src={ARROW_RIGHT} />
          </Box>
        </>
      )}
      {destinationRoute && (
        <>
          <motion.div
            transition={{ delay: 0.2 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="RouteToken"
          >
            <CustomIcon src={destinationRoute.tokenImage} />
            <Box className="ChainLogo">
              <CustomIcon src={destinationRoute.chainImage} />
            </Box>
          </motion.div>
        </>
      )}
    </Box>
  );
};
