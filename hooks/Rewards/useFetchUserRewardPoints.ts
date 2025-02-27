
import { useQuery } from "@apollo/client";
import { GET_USER_REWARD_POINTS } from "@/components/graphql/queries/getUserRewardPoints";
import { useEffect,useMemo } from "react";
import useWalletConnectStore from "@/store/wallet-store";
import { useShallow } from "zustand/react/shallow";
import { useAccount } from "wagmi";
export const useFetchUserRewardPoints = () =>{
    const {address:walletAddress}=useAccount();
      const {
        userRewardPoints
    }=useWalletConnectStore(useShallow((state)=>({
        userRewardPoints:state.userRewardPoints
      })))
      const addressAlreadyThere = useMemo(() => {
        return (
            Array.isArray(userRewardPoints) && userRewardPoints.findIndex((points) => points.walletAddress === walletAddress)!==-1
        );
      }, [walletAddress, userRewardPoints]);
    const skip = walletAddress ? addressAlreadyThere ? true : false : true;
    const { loading, error, data, } = useQuery(GET_USER_REWARD_POINTS, {
        variables: {
        walletAddress: walletAddress,
        },
        skip:skip,
    });
    const rewardPoints = data?.getRewardsForUser;
    useEffect(()=>{
        if(rewardPoints && rewardPoints.add_liquidity_points!==null && rewardPoints.cross_chain_points!==null && rewardPoints.total_points!==null){
            useWalletConnectStore.getState().setUserRewardPoints({
                walletAddress:walletAddress,
                addLiquidtyPoints:rewardPoints.add_liquidity_points,
                crossChainPoints:rewardPoints.cross_chain_points,
                nftCaptain:rewardPoints.nft_captain ? 1:0,
                nftMariner:rewardPoints.nft_mariner ? 1:0,
                nftNavigator:rewardPoints.nft_navigator ? 1:0,
                nftVoyager:rewardPoints.nft_voyager ? 1:0,
                nftSkipper:rewardPoints.nft_skipper ? 1:0,
                rewardsMulitplier:rewardPoints.rewards_multiplier,
                totalPoints:rewardPoints.total_points,
                _typename:rewardPoints.__typename
            });
        }
    },[data,rewardPoints,walletAddress,userRewardPoints]);
    return {
        loading,
        error,
    };
}