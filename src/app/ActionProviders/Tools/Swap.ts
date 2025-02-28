import { Squid } from "@0xsquid/sdk";
import dotenv from "dotenv";
import { OnChainExecutionData, SquidData } from "@0xsquid/squid-types";
import { prisma } from "../Db/db";
import { useShallow } from "zustand/react/shallow";
import useWalletConnectStore from "@/store/wallet-store";
import {ethers, Signer} from "v5n"
dotenv.config()
const privateKey: string = process.env.PRIVATE_KEY!;
const integratorId: string = process.env.INTEGRATOR_ID!;
const FROM_CHAIN_RPC: string = `https://bnb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`

if (!privateKey || !integratorId || !FROM_CHAIN_RPC) {
    console.error("Missing environment variables. Ensure PRIVATE_KEY, INTEGRATOR_ID, and FROM_CHAIN_RPC_ENDPOINT are set.");
    process.exit(1);
  }
  


 const provider = new ethers.providers.JsonRpcProvider("https://bnb-mainnet.g.alchemy.com/v2/fDU1soZ266z9Urc9b7gLUBn0hIsr5fVQ");
const signer = new ethers.Wallet(privateKey, provider);
const approveSpending = async (transactionRequestTarget: string, fromToken: string, fromAmount: string,signer:Signer) => {
    const erc20Abi = [
      "function approve(address spender, uint256 amount) public returns (bool)"
    ];
    const tokenContract = new ethers.Contract(fromToken, erc20Abi, signer);
    try {
      const tx = await tokenContract.approve(transactionRequestTarget, fromAmount);
      await tx.wait();
      console.log(`Approved ${fromAmount} tokens for ${transactionRequestTarget}`);
    } catch (error) {
      console.error('Approval failed:', error);
      throw error;
    }
};



export const Swap=(sourceToken:string,destinationToken:string,sourceChain:string,destinationChain:string,amount:string)=>{
   const getSDK = (): Squid => {
        const squid = new Squid({
          baseUrl:"https://apiplus.squidrouter.com",
          integratorId: integratorId,
        });
        return squid;
     };    
   
     const {
        walletAddress
    }=useWalletConnectStore(useShallow((state)=>({
        walletAddress:state.destinationAddress
       })))
  const squid = getSDK();
   squid.init();
   const sourceTokenDecimals= prisma.token.findFirst({
    where:{
        address:sourceToken,
        chainId:Number(sourceChain)
    },
    select:{
        decimal:true
    }
   })
   const AmountInUnits=(Number(amount)*(10**(sourceTokenDecimals?.decimal as number))).toString()
   console.log(AmountInUnits,sourceTokenDecimals)
   const params = {
    fromAddress: walletAddress,
    fromChain: sourceChain,
    fromToken: sourceToken,
    fromAmount: AmountInUnits,
    toChain: destinationChain,
    toToken: destinationToken,
    toAddress: walletAddress,
    enableBoost: false,
  };

  console.log("Parameters:", params); 

  // Get the swap route using Squid SDK

   try{
    const { route, requestId } = squid.getRoute(params);
    console.log("Calculated route:", route.estimate.toAmount);
    const transactionRequest = route.transactionRequest as OnChainExecutionData;
    console.log(transactionRequest)

    // const result=await approvalTransaction(transactionRequest.target,sourceToken,AmountInUnits)
    // console.log(result)
  approveSpending(transactionRequest.target, sourceToken, AmountInUnits,signer);
  const tx = (squid.executeRoute({
    signer,
    route,
  })) as unknown as ethers.providers.TransactionResponse;
  
  // const nonce = await provider.getTransactionCount(wallet.address, "pending");

  const customTransactionObject={
    to:transactionRequest.target,
    data:transactionRequest.data,
    value:ethers.BigNumber.from(transactionRequest.value).toHexString(),
    chainId:Number(sourceChain),
    gasLimit:ethers.BigNumber.from(transactionRequest.gasLimit).toHexString()
  }
  console.log(customTransactionObject)
  //  try{
  //   // const {signedTransaction,encoding}=await privy.walletApi.ethereum.signTransaction({
  //   //   walletId:"hzd8d8e7h0rpkeuofa7rz5ef",
  //   //   transaction:customTransactionObject
  //   // })
  //   // const txResponse = await provider.sendTransaction(signedTransaction);
  //   // console.log("Transaction sent. Hash:", txResponse.hash)
   
  //   // try{
  //   //   const receipt = await txResponse.wait(1); 
  //   //   console.log("Transaction mined. Receipt:", receipt);  
  //   // }catch(err){
  //   //   console.log(err)
  //   // }
    
  //   const {hash}=await privy.walletApi.ethereum.sendTransaction({
  //     walletId:"hzd8d8e7h0rpkeuofa7rz5ef",
  //     caip2:`eip155:56`,
  //     transaction:customTransactionObject
  //   })
  //   // console.log(encoding)
  //   console.log(hash)
  // }catch(err){
  //   console.log(err)
  // }
  
  
  const txReceipt =  tx.wait();

  const axelarScanLink = "https://axelarscan.io/gmp/"
  console.log(`Finished! Check Axelarscan for details: ${axelarScanLink}`)
  console.log("Swap transaction executed:");
}catch(err){
  console.log(err)
  return "sorry couldn't process your transaction at the moment"
}
   
}