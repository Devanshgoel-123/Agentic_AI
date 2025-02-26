import React from "react";
import "./styles.scss";

import Box from "@mui/material/Box";

import { useShallow } from "zustand/react/shallow";
import useTransferStore from "@/store/transfer-store";
import useFetchChainFlipQuote from "@/hooks/Transfer/useFetchChainFlipQuote";
import useFetchThorswapQuote from "@/hooks/Transfer/useFetchThorswapQuote";

import GradientText from "@/components/common/GradientText";
import { BridgeFee } from "./BridgeFee";

export const FeeContainer = () => {
  const { srcChainGasFees, destChainGasFees, zetaChainGas, estimatedTime } =
    useTransferStore(
      useShallow((state) => ({
        srcChainGasFees: state.srcChainGasFees,
        destChainGasFees: state.destChainGasFees,
        zetaChainGas: state.zetaChainGas,
        estimatedTime: state.estimatedTime,
      }))
    );
  const { loading, error, data } = useFetchChainFlipQuote();
  const {
    loading: thorswapLoading,
    error: thorswapError,
    data: thorswapData,
  } = useFetchThorswapQuote();

  return (
    <Box className="FeeContainer">
      <Box className="FeeHeading">
        <GradientText text="Fee comparison" />
      </Box>
      <Box className="FeeDetailContainer">
        <BridgeFee
          bridgeName={"Eddy"}
          isEddy={true}
          totalGas={(
            Number(srcChainGasFees) +
            Number(destChainGasFees) +
            Number(zetaChainGas)
          )
            .toFixed(4)
            .toString()}
          estimatedTime={Math.ceil(Number(estimatedTime) / 60).toString()}
          eddyFee={(
            Number(srcChainGasFees) +
            Number(destChainGasFees) +
            Number(zetaChainGas)
          )
            .toFixed(4)
            .toString()}
        />
        <BridgeFee
          bridgeName={"ThorSwap"}
          isEddy={false}
          totalGas={Number(thorswapData.bridgeFee).toFixed(4)}
          estimatedTime={Math.ceil(
            Number(thorswapData.estimatedTime) / 60
          ).toString()}
          loading={thorswapLoading}
          error={thorswapError}
          eddyFee={(
            Number(srcChainGasFees) +
            Number(destChainGasFees) +
            Number(zetaChainGas)
          )
            .toFixed(4)
            .toString()}
        />
        <BridgeFee
          bridgeName={"ChainFlip"}
          isEddy={false}
          totalGas={Number(data.bridgeFee).toFixed(4)}
          estimatedTime={Math.ceil(Number(data.estimatedTime) / 60).toString()}
          loading={loading}
          error={error}
          eddyFee={(
            Number(srcChainGasFees) +
            Number(destChainGasFees) +
            Number(zetaChainGas)
          )
            .toFixed(4)
            .toString()}
        />
      </Box>
    </Box>
  );
};
