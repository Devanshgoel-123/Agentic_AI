"use client"
import React, { act } from "react";
import "./styles.scss";
import CustomIcon from "@/components/common/CustomIcon";
import { EDDY_LOGO_WHITE } from "@/utils/images";
import { useMediaQuery } from "@mui/material";
import { useRewardsStore } from "@/store/rewards-store";
import { useShallow } from "zustand/react/shallow";
import { useAccount } from "wagmi";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
export const PointsInfoContainer = () => {
  const mobileDeviceLg=useMediaQuery('(max-width:600px)');
  const {address}=useAccount();
  const {
    userRewards
  }=useRewardsStore(useShallow((state)=>({
    userRewards:state.userSeasonRewards
  })))
  return (
    <div className="PointsInfoContainer">
      <div className="PointsCard">
        <span className="Label">Your Nori Points:</span>
        <div className="PointsInfo">
          <span className="PointsValue">{
            userRewards.length===0 ? <CustomTextLoader text="0.00"/> : userRewards[0]?.total_points
          }</span>
          <div className="Icon">
            <CustomIcon src={EDDY_LOGO_WHITE} />
          </div>
        </div>
      </div>
      <div className="PointsCard">
        <span className="Label">Level Up On:</span>
        <div className="PointsInfo">
          <span className="PointsValue">{ userRewards.length===0 ? <CustomTextLoader text="10"/> : userRewards[0]?.user_level.max_points}</span>
          <div className="Icon">
            <CustomIcon src={EDDY_LOGO_WHITE} />
          </div>
        </div>
      </div>
      {!mobileDeviceLg &&  <div className="PlaceHolderCard">
        <span className="Label">Checkout Daily Missions</span>
        <div className="ActionBtn" onClick={()=>{
          useRewardsStore.setState({
            activeTab:3
          })
        }}>Participate</div>
      </div> }
    </div>
  );
};
