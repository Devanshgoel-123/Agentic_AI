import { privateKeyToAccount } from "viem/accounts"
import { createSmartWallet } from "@coinbase/coinbase-sdk";


export const createSmartWalletTool=async (key:string)=>{
   const owner=privateKeyToAccount(key as `0x${string}`);
   const wallet=await createSmartWallet({
    signer:owner
   })
   return wallet
}