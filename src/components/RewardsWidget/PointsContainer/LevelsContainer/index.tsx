import React from "react";
import "./styles.scss";
import { motion } from "framer-motion";
import CustomIcon from "@/components/common/CustomIcon";
import { EDDY_LOGO_WHITE } from "@/utils/images";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import { useRewardsStore } from "@/store/rewards-store";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
export const LevelsContainer = () => {
  const {address}=useAccount();
  const {
    userRewards
  }=useRewardsStore(useShallow((state)=>({
    userRewards:state.userSeasonRewards
  })))
  
  return (
    <motion.div 
    className="LevelsContainer">
      <div className="HeadingContainer">
        <span className="Heading">Sprints Completed</span>
        <div className="Points">
          <div className="Value">{
            userRewards.length===0 ? <CustomTextLoader text="0.00"/> : userRewards[0].user_level.max_points-userRewards[0].total_points
            }</div>
          <div className="Label">
            <div className="Icon">
              <CustomIcon src={EDDY_LOGO_WHITE} />
            </div>
            <span>left</span>
          </div>
        </div>
      </div>
      <div className="LevelBar">
     {userRewards.length>0  ? <motion.div 
        initial={{
           opacity: 0, 
           width:0
          }}
        transition={{
          duration:0.5
        }}
        animate={{ 
          opacity: 1 ,
          width:`${(userRewards[0].total_points/userRewards[0].user_level.max_points)*100}%` || "10%"
        }}
        className="ActiveLevel">
        </motion.div>
        :
        <div className="LevelBar"></div>
      }
        </div>
    </motion.div>
  );
};
