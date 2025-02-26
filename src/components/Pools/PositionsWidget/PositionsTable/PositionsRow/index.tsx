import React from "react";
import "./styles.scss";

import { motion } from "framer-motion";

import { useAccount } from "wagmi";
import useCustomModal from "@/hooks/common/useCustomModal";
import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";

import { DiTokenLogo } from "@/components/Pools/PoolsWidget/PoolsTable/PoolRow/DiTokenLogo";
import { UniV3PoolLabel } from "@/components/Pools/PoolsWidget/PoolsTable/PoolRow/UniV3Label";
import { ReviewFeesModal } from "./ReviewFeesModal";
import { PositionButtonsWidget } from "./PositionButtonsWidget";
import { Token } from "@/store/types/token-type";
import { RemoveLiquidityModal } from "./RemoveLiquidityModal";
import { AddLiquidityModal } from "./AddLiquidityModal";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { formatNumberWithDecimals } from "@/utils/number";

interface Props {
  index: number;
  nftId: string;
  slug: string;
  fee: number;
  token0: Token;
  token1: Token;
  poolName: string;
  isInRange: boolean;
  token0PriceLower: number;
  token1PriceLower: number;
  token0PriceUpper: number;
  token1PriceUpper: number;
  depositedToken0: number;
  depositedToken1: number;
  collectedFeesToken0: number;
  collectedFeesToken1: number;
  tickLower: number;
  tickUpper: number;
  contract: string;
  token0Amount: string;
  token1Amount: string;
}

export const PositionRow = ({
  index,
  nftId,
  slug,
  fee,
  token0,
  token1,
  poolName,
  isInRange,
  token0PriceLower,
  token0PriceUpper,
  token1PriceLower,
  token1PriceUpper,
  depositedToken0,
  depositedToken1,
  collectedFeesToken0,
  collectedFeesToken1,
  tickLower,
  tickUpper,
  contract,
  token0Amount,
  token1Amount,
}: Props) => {
  const { address } = useAccount();
  const { open, handleClose, handleOpen } = useCustomModal();
  const {
    open: openRemoveLiquidityModal,
    handleClose: closeRemoveLiquidityModal,
    handleOpen: handleOpenRemoveLiquidityModal,
  } = useCustomModal();
  const {
    open: openAddLiquidityModal,
    handleClose: closeAddLiquidityModal,
    handleOpen: handleOpenAddLiquidityModal,
  } = useCustomModal();

  const { data: token0Dollar, loading: token0Loading } =
    useFetchTokenDollarValue({
      tokenId: token0.id,
    });

  const { data: token1Dollar, loading: token1Loading } =
    useFetchTokenDollarValue({
      tokenId: token1.id,
    });

  /**
   * Return range as per token type.
   */
  const returnRange = () => {
    return `${Number(token1PriceLower).toFixed(5)} - ${Number(
      token1PriceUpper
    ).toFixed(5)}`;
  };

  /**
   * Return Total Deposited Liquidity.
   * @returns
   */
  const returnDepositedLiquidity = () => {
    if (token0Loading || token1Loading) {
      return <CustomTextLoader text="0.0000" />;
    } else {
      const token0AmountDollar = Number(token0Amount) * Number(token0Dollar);
      const token1AmountDollar = Number(token1Amount) * Number(token1Dollar);
      const totalLiquidity = token0AmountDollar + token1AmountDollar;
      return totalLiquidity.toFixed(3);
    }
  };

  const returnPositionLiquidity = () => {
    const token0AmountDollar = Number(token0Amount) * Number(token0Dollar);
    const token1AmountDollar = Number(token1Amount) * Number(token1Dollar);
    const totalLiquidity = token0AmountDollar + token1AmountDollar;
    return formatNumberWithDecimals(totalLiquidity);
  };

  return (
    <motion.div
      transition={{ delay: 0.2 + index / 50 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="PositionRow"
    >
      <div className="MobilePoolInfo">
        {<UniV3PoolLabel />}
        <div className="FeeLabel">Fee {fee}%</div>
        {isInRange ? (
          <div className="PositionRangeLabel">In Range</div>
        ) : (
          <div className="PositionOutOfRangeLabel">Out of Range</div>
        )}
      </div>
      <div className="PoolDetailsContainer">
        <div className="TokenLogoContainer">
          <DiTokenLogo tokenLogos={[token1.tokenLogo, token0.tokenLogo]} />
        </div>
        <div className="TokenDetailsContainer">
          <div className="PoolName">{poolName}</div>
          <div className="PoolInfo">
            {<UniV3PoolLabel />}
            <div className="FeeLabel">Fee {fee}%</div>
            <div className="FeeLabel">NFT ID: {nftId}</div>
          </div>
        </div>
      </div>
      <div className="PositionStatus">
        {isInRange ? (
          <div className="PositionRangeLabel">In Range</div>
        ) : (
          <div className="PositionOutOfRangeLabel">Out of Range</div>
        )}
      </div>
      <div className="PositionRange">
        <span className="Label">Range</span>
        {returnRange()}
      </div>
      <div className="PositionLiquidity">
        <span className="Label">Liquidity</span>
        <span className="LiquidityValue">${returnDepositedLiquidity()}</span>
      </div>
      <div className="PositionDetailsContainer">
        <PositionButtonsWidget
          slug={slug}
          handleOpen={handleOpen}
          handleOpenRemoveLiquidityModal={handleOpenRemoveLiquidityModal}
          handleOpenAddLiquidityModal={handleOpenAddLiquidityModal}
        />
      </div>
      <ReviewFeesModal
        open={open}
        nftId={nftId}
        token0Logo={token0.tokenLogo}
        token1Logo={token1.tokenLogo}
        poolName={poolName}
        fee={fee}
        range={returnRange()}
        token0Dollar={Number(token0Dollar).toString()}
        token1Dollar={Number(token1Dollar).toString()}
        token0={token0}
        token1={token1}
        contract={contract}
        handleClose={handleClose}
      />
      <AddLiquidityModal
        slug={slug}
        open={openAddLiquidityModal}
        token0={token0}
        token1={token1}
        poolName={poolName}
        range={returnRange()}
        liquidity={returnPositionLiquidity()}
        fee={fee.toString()}
        nftId={nftId}
        tickLower={tickLower}
        tickUpper={tickUpper}
        handleClose={closeAddLiquidityModal}
      />
      <RemoveLiquidityModal
        slug={slug}
        nftId={nftId}
        open={openRemoveLiquidityModal}
        token0={token0}
        token1={token1}
        token0Dollar={token0Dollar}
        token1Dollar={token1Dollar}
        depositedToken0={depositedToken0}
        depositedToken1={depositedToken1}
        collectedFeesToken0={collectedFeesToken0}
        collectedFeesToken1={collectedFeesToken1}
        handleClose={closeRemoveLiquidityModal}
        contract={contract}
        poolName={poolName}
      />
    </motion.div>
  );
};
