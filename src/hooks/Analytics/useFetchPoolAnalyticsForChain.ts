import { GET_POOL_ANALYTICS_FOR_CHAIN } from "@/components/graphql/queries/getPoolAnalyticsForChain";
import { useQuery } from "@apollo/client";


const useFetchPoolAnalyticsForChain=()=>{
    const {data,loading}=useQuery(GET_POOL_ANALYTICS_FOR_CHAIN,{
        variables:{
            chainId:7000
        },
        fetchPolicy:"cache-first"
    })
    return {data,loading}
}

export default useFetchPoolAnalyticsForChain