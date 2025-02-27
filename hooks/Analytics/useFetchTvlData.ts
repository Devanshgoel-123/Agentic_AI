"use client"
import { useQuery } from "@apollo/client";
import { GET_HISTORICAL_TVL } from "@/components/graphql/queries/getHistoricalTvl";



const useFetchTvlData=()=>{
    const {loading,error,data}=useQuery(GET_HISTORICAL_TVL,{
        fetchPolicy:"cache-first"
    })
    const tvlValue=data?.getHistoricalTvl.tvl || 0;
    var tvlDataArray:Record<string,number>[]=data?.getHistoricalTvl?.tvlHistorical?.map((item:any)=>({
      tvl:item.totalLiquidityUSD,
      date:item.date
    })) || [];
    return {
        loading,
        error,
        tvlDataArray,
        tvlValue
    }
}

export default useFetchTvlData