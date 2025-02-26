import React from "react";
import "./styles.scss";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import useFetchPositionsForWallet from "@/hooks/Pools/useFetchPositionsForWallet";
import useWalletConnectStore from "@/store/wallet-store";

import { CustomSpinner } from "@/components/common/CustomSpinner";
import { PositionRow } from "./PositionsRow";
import { PositionsResponse } from "@/store/types/pool-type";

interface Props {
  query: string;
}

export const PositionsTable = ({ query }: Props) => {
  const { address } = useAccount();
  const { handleOpen } = useWalletConnectStore();
  const { data, loading, contract, error } = useFetchPositionsForWallet({
    wallet: address,
  });

  const returnPositionsData = () => {
    if (address) {
      if (loading) {
        return (
          <div className="LoadingContainer">
            <CustomSpinner size="20" color="#909090" />
          </div>
        );
      } else if (error) {
        return (
          <div className="LoadingContainer">
            <CustomSpinner size="20" color="#909090" />
          </div>
        );
      } else {
        if (data.length === 0) {
          return (
            <div className="NoPositionPlaceHolder">
              <span className="Heading">No Positions yet</span>
              <Link
                style={{
                  textDecoration: "none",
                }}
                href={"/pools"}
              >
                <div className="ActionBtn">Add Liquidity</div>
              </Link>
            </div>
          );
        } else {
          return data
            .filter((item: PositionsResponse) =>
              item.poolName.toLowerCase().includes(query.toLowerCase())
            )
            .map((item, index) => (
              <PositionRow
                key={index}
                index={index}
                nftId={item.id}
                slug={item.poolSlug}
                fee={item.lpFee}
                token0={item.token0}
                token1={item.token1}
                poolName={item.poolName}
                isInRange={item.isInRange}
                token0PriceLower={item.token0PriceLower}
                token0PriceUpper={item.token0PriceUpper}
                token1PriceLower={item.token1PriceLower}
                token1PriceUpper={item.token1PriceUpper}
                depositedToken0={item.depositedToken0}
                depositedToken1={item.depositedToken1}
                collectedFeesToken0={item.collectedFeesToken0}
                collectedFeesToken1={item.collectedFeesToken1}
                tickLower={Number(item.tickLower.tickIdx)}
                tickUpper={Number(item.tickUpper.tickIdx)}
                token0Amount={item.token0Amount}
                token1Amount={item.token1Amount}
                contract={contract}
              />
            ));
        }
      }
    } else {
      return (
        <div className="NoPositionPlaceHolder">
          <span className="Heading">Connect your wallet to view positions</span>
          <div className="ActionBtn" onClick={handleOpen}>
            Connect Wallet
          </div>
        </div>
      );
    }
  };
  return (
    <div className="PositionsTable">
      <div className="TableHeader">
        <div className="Header">Pool</div>
        <div className="Header">Status</div>
        <div className="Header">Range</div>
        <div className="Header">Liquidity</div>
        <div className="Header"></div>
      </div>
      <motion.div
        transition={{ delay: 0.2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="TableBody"
      >
        {returnPositionsData()}
      </motion.div>
    </div>
  );
};
