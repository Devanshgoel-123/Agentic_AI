"use client"
import React, { useEffect } from "react";
import "./styles.scss";
import { PointsContainer } from "./PointsContainer";
import { ActiveCampaignContainer } from "./ActiveCampaginsContainer";
import { SprintsContainer } from "./SprintsContainer";
import { useAccount } from "wagmi";
import { useFetchUserRewardSeasonPoints } from "@/hooks/Rewards/useFetchUserRewardSeasonPoints";
import useWalletConnectStore from "@/store/wallet-store";
import dynamic from "next/dynamic";
import { useShallow } from "zustand/react/shallow";

const DynamicPointsContainer=dynamic(
  () => import("./PointsContainer").then((mod) => mod.PointsContainer),
  {
    ssr: false,
    loading:()=><div className="DynamicPlaceHolderRewardsTopContainer"></div>
  }
)

const DynamicConnectWalletWrapper=dynamic(
  ()=>import("./ConnectWalletContainer").then((mod)=>mod.ConnectWalletContainer),
  {
    ssr:false,
    loading:()=><div className="DynamicPlaceHolderRewardsTopContainer"></div>
  }
)

const DynamicCampaignContainer=dynamic(
  ()=>import("./ActiveCampaginsContainer").then((mod)=>mod.ActiveCampaignContainer),
  {
    ssr:false,
    loading:()=><div className="DynamicPlaceHolderRewards"></div>
  }
)

const DynamicTaskContainer=dynamic(
  ()=>import("./SprintsContainer").then((mod)=>mod.SprintsContainer),
  {
    ssr:false,
    loading:()=><div className="DynamicPlaceHolderRewards"></div>
  }
)

export const RewardsWidget = () => {
  const {address}=useAccount();
  const {
    data,
    loading
  }=useFetchUserRewardSeasonPoints()
  return (
    <div className="RewardsWidgetWrapper">
      {
        <div className="PointsStateWrapper">
         {address===undefined  && <DynamicConnectWalletWrapper/>
        }
         <DynamicPointsContainer />
         </div>
      }

      <DynamicCampaignContainer/>
      <DynamicTaskContainer/>
    </div>
  );
};
