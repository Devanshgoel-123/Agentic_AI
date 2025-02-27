"use client"
import { useQuery } from "@apollo/client";
import { GET_TRADING_VOLUME_ANALYTICS } from "@/components/graphql/queries/getTradingVolumeAnalytics";

const useFetchTradingVolumeAnalytics=(type:string)=>{
    const {
        loading,
        data,
        error
    }=useQuery(GET_TRADING_VOLUME_ANALYTICS,{
        variables:{
            type:`${type}`
        },
        fetchPolicy:"cache-first",
    }) 
    var totalVolume: number = 0;
    let dataArray: Record<string, number>[]=data?.getTradingVolumeAnalytics?.map((item: any) => {
        totalVolume += item?.volume || 0;
        return {
            volume: item.volume,
            date: item.day,
        }
      }) || []
      dataArray=dataArray.slice(-100);
    return {
        dataArray,
        loading,
        totalVolume
    }
}
export default useFetchTradingVolumeAnalytics