
import {z} from "zod";
import { tool } from "@langchain/core/tools";
import { prisma } from "../Db/db";
import axios from "axios";
import { Swap } from "./Swap";
export const CHAIN_NAMES:Record<string,string>={
    "BNB":"bsc",
    "ETH":"eth",
    "ETHEREUM":"eth",
    "ARBITRUM":"arbitrum",
    "POLYGON":"polygon_pos",
    "BASE":"base",
    "BSC":"bsc"
}

export const CHAIN_IDS={
    ETHEREUM:1,
    POLYGON:137,
    BASE:8453,
    ARBITRUM:42161,
    BNB:56,
    BSC:56
}
export const fetchChainId=async (chainName:string):Promise<number>=>{
    if (!chainName) return 0;
    if(chainName.includes("eth") || chainName.includes("ethereum")){
        return CHAIN_IDS.ETHEREUM;
    }else if(chainName.includes("arb") || chainName.includes("arbitrum")){
        return CHAIN_IDS.ARBITRUM
    }else if(chainName.includes("pol") || chainName.includes("polygon")){
        return CHAIN_IDS.POLYGON
    }else if(chainName.includes("bsc") || chainName.includes("bnb") || chainName.includes("binance smart")){
        return CHAIN_IDS.BSC
    }
    return CHAIN_IDS.BASE
}

export const fetchTokenDetails=async(tokenAddress:string,chainName?:string)=>{
    try{
        if(chainName && chainName!==""){
            const chainId=await fetchChainId(chainName);
            const result=await prisma.token.findFirst({
                where:{
                    address:tokenAddress,
                    chainId:chainId
                }
            })
            return result;
        }else{
            const result=await prisma.token.findFirst({
                where:{
                    address:tokenAddress,
                }
            })
            return result;
        }
    }catch(error){
        console.log(error)
    }
}

export const swapTool=tool(
    async({sourceChain,sourceToken,destinationChain,destinationToken,amount})=>{
        console.log(destinationChain,sourceChain)
        try{
        const fromChain = await fetchChainId(sourceChain)
        const toChain = await fetchChainId(destinationChain)
        console.log(fromChain,toChain)
        let sourceTokenAddress = sourceToken.startsWith("0x")
        ? sourceToken
        : await fecthTokenAddressTool.invoke({ tokenName: sourceToken.toLowerCase(), chainName:sourceChain.toUpperCase()});
  
      let destinationTokenAddress = destinationToken.startsWith("0x")
        ? destinationToken
        : await fecthTokenAddressTool.invoke({ tokenName: destinationToken.toLowerCase(),chainName:destinationChain.toUpperCase()});
        const result=await Swap(sourceTokenAddress,destinationTokenAddress,fromChain.toString(),toChain.toString(),amount)
        return result;
    }catch(err){
        console.log(err)
    }
    },
    {
     name:"swap",
     description:"swap or bridges two tokens from one chain to another by extracting the 5 parameters from the prompt accurately and calling the swap function",
     schema:z.object({
        sourceChain:z.string().describe("the source chain"),
        destinationChain:z.string().describe("the destination chain"),
        sourceToken:z.string().describe("the starting token"),
        destinationToken:z.string().describe("the destination token"),
        amount:z.string().describe("the amount of token to swap")
     })   
    }
  )


export const fetchTokenPriceInUsdTool=tool(
    async({tokenAddress})=>{
        try {
            const result = await fetchTokenPriceInUsd(tokenAddress);
            return `Current price of token: $${result.usdValue}`;
          } catch (error) {
            return "Sorry, I couldn't fetch the token price at this moment. Please try again later.";
         }
    },
    {
     name:"fetchTokenPriceInUsd",
     description:"fetches the price of a token in usd using the token Address as a parameter but calls the fetchTokenAddressTool if instead of address name is provided, if there's an error craft a sorry message yourself and return it",
     schema:z.object({
        tokenAddress:z.string().describe("the token Address for which we need to find the token price in usd"),
     })   
    }
  )
  

  export  const fecthTokenAddressTool=tool(
    async({tokenName,chainName})=>{
        try {
            const result = await fetchTokenAddress(tokenName,chainName);
            if (!result) {
              return `Sorry, I couldn't find details for ${tokenName}`;
            }
            return result;
          } catch (error) {
            return `Sorry, there was an error fetching details for ${tokenName}`;
          }
    },
    {
     name:"fetchTokenAddress",
     description:"fetches the address of a token using the token name and chain name as a parameter",
     schema:z.object({
        tokenName:z.string().describe("the token Name for which we need to find the token Address and if the user asks for the price in usd also then call the fectchTokenPriceInUsdTool otherwise just return the address, if there's an error craft a sorry message yourself and return it"),
        chainName:z.string().describe("the chain Name for the token which needs to be fetched")
     })   
    }
  )

  export const fetchTokenDetailsTool = tool(
    async ({ tokenAddress }) => {
      try {
        const result = await fetchTokenDetails(tokenAddress);
        if (!result) {
          return `Sorry, I couldn't find details for ${tokenAddress}`;
        }
        return result;
      } catch (error) {
        return `Sorry, there was an error fetching details for ${tokenAddress}`;
      }
    },
    {
      name: "fetchTokenDetails",
      description:
        "fetches the token details  of a token using the token address as a parameter",
      schema: z.object({
        tokenAddress: z
          .string()
          .describe(
            "the token Address for which we need to find the token details"
          ),
      }),
    }
  );


  export const fetchTokenAddress=async (tokenName:string,chainName:string):Promise<string>=>{
    try{
        const chainId=await fetchChainId(chainName.toLowerCase());
        const tokenDetails=await prisma.token.findFirst({
            where:{
                tokenName:{
                    search:tokenName
                },
                chainId:chainId
            },
            select:{
                address:true,
            }
        })
        return tokenDetails?.address as string
    }catch(error){
        console.log(error)
        return "Couldn't fetch the token details at the moment"
    }
  }
  
  
  export const fetchTokenPriceInUsd=async (tokenAddress:string):Promise<{
    usdValue:string,
    decimals:string
  }>=>{
    try{ 
        const tokenDetails=await prisma.token.findFirst({
            where:{
                address:tokenAddress
            },
            select:{
                chain:true,
            }
        })
        console.log(tokenDetails?.chain.name)
        const chainName=CHAIN_NAMES[tokenDetails?.chain.name as string]
        console.log(chainName)
        const url=`https://api.geckoterminal.com/api/v2/networks/${chainName}/tokens/${tokenAddress}`
        const result=await axios.get(url);
        const usdValue=result.data.data.attributes.price_usd;
        const decimals=result.data.data.attributes.decimals;
        return {
            usdValue,
            decimals
        }
    }catch(err){
        console.log(err)
        return {
            usdValue: "0",
            decimals: "0",
          };
      
    }  
  }