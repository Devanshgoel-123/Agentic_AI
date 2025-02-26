import React from "react";
import "./styles.scss";
import CustomIcon from "@/components/common/CustomIcon";
import { MISO_SOUP, SEAWEED, STEAK, SUSHI, TEMAKI, TEST_AVATAR } from "@/utils/images";
import { useAccount } from "wagmi";
import { useRewardsStore } from "@/store/rewards-store";
import { useShallow } from "zustand/react/shallow";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import Image from "next/image";
export const AvatarContainer = ({className}:{className:string}) => {
  const {address}=useAccount();
  const {
    userRewards
  }=useRewardsStore(useShallow((state)=>({
    userRewards:state.userSeasonRewards
  })))
  const level:Record<number,string>={
    1:SEAWEED,
    2:SUSHI,
    3:MISO_SOUP,
    4:TEMAKI,
    5:STEAK,
  }
  return (
    <div className={`AvatarContainer ${className}`}>
     {userRewards[0] && userRewards[0].user_level?.level ?  <div className="AvatarIcon">
      <CustomIcon src={ level[`${Number(userRewards[0].user_level.level)}`]}/>  
      </div>
      :
      <div className="AvatarShimmer">
         <CustomIcon src={ level[1]}/>
        </div>
        }
      <div className="AvatarLevel">{userRewards.length>0 ? `Level ${userRewards[0].user_level.level}` : <CustomTextLoader text="User Level "/>}</div>
      <div className="AvatarName">{userRewards.length>0 ? userRewards[0].user_level.name : <CustomTextLoader text="Level Name"/>}</div>
    </div>
  );
};
