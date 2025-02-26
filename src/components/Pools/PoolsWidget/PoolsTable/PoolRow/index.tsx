import React from "react";
import "./styles.scss";

import { motion } from "framer-motion";
import Link from "next/link";

import { useAccount } from "wagmi";
import useFetchLpTokenBalance from "@/hooks/Pools/useFetchLpTokenBalance";

import { BoostAPYData } from "@/store/types/pool-type";
import { Token } from "@/store/types/token-type";
import { DiTokenLogo } from "./DiTokenLogo";
import { MultiTokenLogo } from "./MultiTokenLogo";
import CustomIcon from "@/components/common/CustomIcon";
import { BOOST_LOGO } from "@/utils/images";
import { CurvePoolLabel } from "./CurvePoolLabel";
import { UniV2PoolLabel } from "./UniV2PoolLabel";
import { POOL_TYPE } from "@/utils/enums";
import { Tooltip, useMediaQuery } from "@mui/material";
import { UniV3PoolLabel } from "./UniV3Label";

interface Props {
  name: string;
  tvl: number;
  apy: number;
  lpFee: number;
  slug: string;
  poolType: string;
  boostInfo: BoostAPYData[];
  tokens: Token[];
  index: number;
  lpTokenImage: string;
  lpSymbol: string;
}

export const PoolRow = ({
  name,
  tvl,
  apy,
  lpFee,
  slug,
  poolType,
  boostInfo,
  tokens,
  index,
  lpTokenImage,
  lpSymbol,
}: Props) => {
  const { address } = useAccount();
  const mobileDevice = useMediaQuery("(max-width: 768px)");
  const { data } = useFetchLpTokenBalance({
    poolId: slug,
    walletAddress: address,
    lpTokenDecimal: 18,
    isPolling: false,
    setterFunction: (val: string) => {},
    isSkip: mobileDevice || poolType === POOL_TYPE.UNI_V3,
  });
  /**
   * Return boosted apy pill.
   * @returns JSX
   */
  const returnBoostedAPYLabel = () => {
    if (
      boostInfo.length > 0 &&
      boostInfo.some((item) => item.isBoosted === true)
    ) {
      return boostInfo.map((item, index) => (
        <Tooltip
          key={index}
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: "12px",
                bgcolor: "#121212",
                border: "2px solid #1E1E1E",
                fontFamily: "Manrope",
              },
            },
          }}
          title="Earn extra rewards. Eddy Finance distributes 5,335.44 ZETA weekly as liquidity incentives on this boosted pool."
        >
          <div className="BoostedAPY">
            <div className="TokenLogo">
              <CustomIcon src={item.tokenImage} />
            </div>
            +{item.boost.toFixed(2)}%
          </div>
        </Tooltip>
      ));
    }
  };

  /**
   * Get pool page from pool type.
   * @returns pool page route
   */
  const returnPoolPageFromPoolType = () => {
    if (poolType === POOL_TYPE.CURVE) {
      return `/pools/curve/${slug}`;
    } else if (poolType === POOL_TYPE.UNI_V2) {
      return `/pools/univ2/${slug}`;
    } else {
      return `/pools/univ3/${slug}/add`;
    }
  };

  return (
    <motion.div
      transition={{ delay: 0.2 + index / 50 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="PoolRow"
    >
      <div className="MobilePoolInfo">
        {poolType === POOL_TYPE.CURVE && <CurvePoolLabel />}
        {poolType === POOL_TYPE.UNI_V2 && <UniV2PoolLabel />}
        {poolType === POOL_TYPE.UNI_V3 && <UniV3PoolLabel />}
        <div className="FeeLabel">Fee {lpFee}%</div>
      </div>
      <div className="PoolDetailsContainer">
        <div className="TokenLogoContainer">
          {tokens.length === 2 && (
            <DiTokenLogo tokenLogos={tokens.map((item) => item.tokenLogo)} />
          )}
          {tokens.length === 4 && (
            <MultiTokenLogo tokenLogos={tokens.map((item) => item.tokenLogo)} />
          )}
        </div>
        <div className="TokenDetailsContainer">
          <div className="PoolName">
            {name}
            {boostInfo.length > 0 &&
              boostInfo.some((item) => item.isBoosted === true) && (
                <div className="BoostLogo">
                  <CustomIcon src={BOOST_LOGO} />
                </div>
              )}
          </div>
          <div className="PoolInfo">
            {poolType === POOL_TYPE.CURVE && <CurvePoolLabel />}
            {poolType === POOL_TYPE.UNI_V2 && <UniV2PoolLabel />}
            {poolType === POOL_TYPE.UNI_V3 && <UniV3PoolLabel />}
            <div className="FeeLabel">Fee {lpFee}%</div>
          </div>
        </div>
      </div>
      <div className="PoolTVLContainer">
        <span className="Label">TVL</span>
        <span className="TVLValue">${Number(tvl).toLocaleString()}</span>
      </div>
      <div className="APYContainer">
        <span className="Label">APY</span>
        <div className="APYValueContainer">
          <span className="APYValue">{apy.toFixed(2)}%</span>
          {returnBoostedAPYLabel()}
        </div>
        <div className="APYButtonsContainer">
          {Number(data) > 0 && poolType !== POOL_TYPE.UNI_V3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="LpTokenInfoContainer"
            >
              <span className="LpLabel">Bal.</span>
              <span className="LpTokenName">
                {(Number(data) / 10 ** 18).toFixed(2)}
              </span>
              <span className="LpTokenName">{lpSymbol}</span>
              <motion.div
                transition={{ delay: 0.2 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="InvestedIcon"
              >
                <CustomIcon src={lpTokenImage} />
              </motion.div>
            </motion.div>
          )}
          <Link
            style={{
              textDecoration: "none",
            }}
            href={returnPoolPageFromPoolType() ?? "/"}
          >
            <div className="ManageButton">
              {poolType === POOL_TYPE.UNI_V3 ? "Add Liquidity" : "Manage"}
            </div>
          </Link>
        </div>
      </div>
      <div className="MobileButtonsContainer">
        <Link
          style={{
            width: "100%",
            textDecoration: "none",
          }}
          href={returnPoolPageFromPoolType() ?? "/"}
        >
          <div className="ManageButton">
            {poolType === POOL_TYPE.UNI_V3 ? "Add Liquidity" : "Manage"}
          </div>
        </Link>
      </div>
    </motion.div>
  );
};
