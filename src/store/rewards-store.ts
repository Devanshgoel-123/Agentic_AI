import { create } from "zustand";
import { UserRewards } from "./types/rewards";
import { userRewardPoints } from "./types/token-type";

interface RewardsStore {
  userSeasonRewards:UserRewards[];
  setUserSeasonRewards:(rewards:UserRewards)=>void;
  activeTab:number;
}


export const useRewardsStore = create<RewardsStore>((set)=>({
    userSeasonRewards:[],
    setUserSeasonRewards: (rewards: UserRewards) => {
        set((state) => {
          return {
            userSeasonRewards: [rewards],
          };
        });
    },
    activeTab:5
}))