"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";

import useDustAggregatorStore from "@/store/dust-aggregator-store";
import { useShallow } from "zustand/react/shallow";
import { formattedValueToDecimals } from "@/utils/number";
import GradientText from "../common/GradientText";
import { FaArrowDown } from "react-icons/fa";
import { useFetchQuoteDustForTransaction } from "@/hooks/DustAggregator/useFetchQuoteForTransaction";
import { Token } from "@/store/types/token-type";
import { TransactionStatusModal } from "./TransactionStatusModal";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";
import dynamic from "next/dynamic";
import { MdOutlineQuestionMark } from "react-icons/md";
import { CHAIN_IDS, TOKEN_FORM_LINK } from "@/utils/constants";
import { ChainIds } from "@/utils/enums";
import useBTCWalletValidation from "@/hooks/Transfer/useBTCWalletValidation";
import { useFetchQuoteForDustBtcTransaction } from "@/hooks/DustAggregator/useFetchQuoteForDustBtcTraxn";
import { useLazyQuery } from "@apollo/client";
import { GET_TOKEN_DOLLAR_VALUE } from "../graphql/queries/getDollarValueOfToken";


const DynamicCampaignContainer = dynamic(
  () => import("../CrossChainWidget/CampaginContainer").then((mod) => mod.CampaginContainer),
  {
    ssr: false,
  }
);

const DynamicThresholdContainer=dynamic(
  ()=>import("../DustAggregatorWidget/ThresholdContainer").then((mod)=>mod.ThresholdContainer),
  {
    ssr:false,
    loading:()=><div className="DynamicPlaceholder"> </div>
  }
)

const DynamicTokenInfoWidget=dynamic(
  ()=>import("../DustAggregatorWidget/TokenInfoWidget").then((mod)=>mod.TokenInfoWidget),
  {
    ssr:false,
     loading:()=><div className="DynamicPlaceholderInput"> </div>
  }
)

const DynamicReviewTransactionModal=dynamic(
  ()=>import("../DustAggregatorWidget/ReviewTransactionModal").then((mod)=>mod.ReviewTransactionModal),
  {
    ssr:false
  }
)

const DynamicDestinationAddressWidget=dynamic(
  ()=>import("./DestinationAddressWidget").then((mod)=>mod.DestinationAddressWidget),
  {
    ssr:false
  }
)


export const DustAggregatorWidget = () => {
  const {address}=useAccount();
  const [getDollarValue,{loading:dollarLoading,error:dollarError,data:dollarData,refetch}]=useLazyQuery(GET_TOKEN_DOLLAR_VALUE);

  const {
    sourceChainDetails,
    destinationChainDetails,
    sourceChain,
    destinationChain,
    handleSetSourceChain,
    handleSetDestinationChain,
    sourceTokens,
    intermediateToken,
    inputValue,
    outputValue,
    destinationToken
  } = useDustAggregatorStore(
    useShallow((state) => ({
      sourceChain: state.sourceChain,
      destinationChain: state.destinationChain,
      sourceChainDetails: state.defaultSourceChain,
      destinationChainDetails: state.defaultDestinationChain,
      handleSetSourceChain: state.setSourceChain,
      handleSetDestinationChain: state.setDestinationChain,
      sourceTokens: state.sourceTokens,
      intermediateToken:state.sourceChainIntermediateToken,
      inputValue:state.inputValue,
      outputValue:state.outputValue,
      destinationToken:state.destinationToken
    }))
  );

  const {
    btcWalletAddress,
    destinationAddress,
    btcWalletId
  }=useWalletConnectStore(useShallow((state)=>({
    btcWalletAddress:state.btcWalletAddress,
    destinationAddress:state.destinationAddress,
    btcWalletId: state.btcWalletId,
  })))

  const {
    isValid,
    loading:btcValidationLoading,
    error:btcValidationError
  }=useBTCWalletValidation();

  const {
    loading,
    error
  }=useFetchQuoteDustForTransaction({
    destinationToken:destinationToken as Token,
    isRefetch:false,
    isSkip:sourceTokens.length===0,
    sourceChain:sourceChain,
    destinationChain:destinationChain
  })

  const sourceTokenAddress=useDustAggregatorStore.getState().tokenSwapForPermit.map((item)=>{
    return {
      tokenAddress:item.token,
      amount:item.amount.toString()
    }
  })
  
  const {
    loading:btcLoading,
    error:btcError
  }=useFetchQuoteForDustBtcTransaction({
    sourceChain,
    sourceTokenAddress,
    destinationChain
  })

  const {switchChain}=useSwitchChain();
  const chainId=useChainId();

  const {
    open: openWalletModal,
    handleClose: handleCloseWalletModal,
    handleOpen: handleOpenWalletModal,
  } = useWalletConnectStore();
   /**
   * Function to open external links.
   * @param link Link to be opened.
   */
   const handleOpenLink = (link: string) => {
    window.open(link, "_blank");
  };
   const {
    sourceChainIntermediateToken,
    minAmountOut,
    gasFeesDestination,
    destinationChainGasToken,
    sourceChainGasToken,
    sourceGasAmount,
    sourceChainGasAmountUsd
   }=useDustAggregatorStore(useShallow((state)=>({
    sourceChainIntermediateToken:state.sourceChainIntermediateToken,
    minAmountOut:state.minAmountOut,
    gasFeesDestination:state.gasFeesDestination,
    destinationChainGasToken:state.destinationChainGasToken,
    sourceChainGasToken:state.sourceChainGasToken,
    sourceGasAmount:state.sourceGasAmount,
    sourceChainGasAmountUsd:state.sourceChainGasFeesUsd
   })))
  
  
 
   useEffect(() => {
    /**
   * Function to fetch the total value of any amount of a token in usd
   * @param token the token for which we need to fecth value
   * @param amount the amount of token
   * @returns 
   */
    const fetchTokenValues = async () => {
      if (minAmountOut && destinationChainGasToken && destinationToken && sourceChainGasToken) {
        let minInputAmountOut: string = "0";
        if(sourceChainGasToken && Number(sourceGasAmount)>0){
          await calcAmountinUsd(sourceChainGasToken, sourceGasAmount as string, "sourceGas");
        }
        if (sourceChain === CHAIN_IDS.ZETACHAIN) {
          await calcAmountinUsd(destinationToken, minAmountOut as string, "sourceToken");
        
        } else if (sourceChainIntermediateToken && sourceChain !== CHAIN_IDS.ZETACHAIN) {
          await calcAmountinUsd(sourceChainIntermediateToken, minAmountOut as string, "sourceToken");
        } else {
          minInputAmountOut = "0";
        }
        let outputGasFees: string;
        if (gasFeesDestination !== undefined && gasFeesDestination !== "0") {
        calcAmountinUsd(destinationChainGasToken, gasFeesDestination, "destinationGas");
        } else {
          outputGasFees = "0";
        }
      }
    };
  
    fetchTokenValues();
  }, [sourceChainIntermediateToken, minAmountOut, destinationToken, gasFeesDestination, destinationChainGasToken, sourceChainGasToken,sourceChain,sourceChainGasToken]);


  const calcAmountinUsd = async (token: Token, amount: string, type: string) => {
    if (amount === "") return "0";
    try {
        if (type === "sourceToken") {
          const { data: dollarUsdData } = await getDollarValue({ variables: { tokenId: token.id } });
      if (dollarUsdData?.getDollarValueForToken) {
        const tokenValueUsd = Number(dollarUsdData.getDollarValueForToken.price) / 10 ** Math.abs(dollarUsdData.getDollarValueForToken.expo);
        const userTokenHoldingsInUsd: string = formattedValueToDecimals(
          (Number(tokenValueUsd) * (Number(amount) / 10 ** Number(token.decimal))).toString(),
          4
        );
          useDustAggregatorStore.getState().setInputValue(userTokenHoldingsInUsd);
      }
        } else if (type === "sourceGas") {
          const { data: dollarUsdData } = await getDollarValue({ variables: { tokenId: sourceChainGasToken?.id } });
          const tokenValueUsdSourceGasToken = Number(dollarUsdData.getDollarValueForToken.price) / 10 ** Math.abs(dollarUsdData.getDollarValueForToken.expo);
          const sourceChainGasFees: string = formattedValueToDecimals(
            (Number(tokenValueUsdSourceGasToken) * Number(amount)).toString(),
            4
          );
          useDustAggregatorStore.getState().setSourceChainGasFeesUsd(sourceChainGasFees);
        } else {
          const { data: dollarUsdData } = await getDollarValue({ variables: { tokenId: token.id } });
      if (dollarUsdData?.getDollarValueForToken) {
        const tokenValueUsd = Number(dollarUsdData.getDollarValueForToken.price) / 10 ** Math.abs(dollarUsdData.getDollarValueForToken.expo);
        const userTokenHoldingsInUsd: string = formattedValueToDecimals(
          (Number(tokenValueUsd) * (Number(amount) / 10 ** Number(token.decimal))).toString(),
          4
        );
          useDustAggregatorStore.getState().setOutputValue(userTokenHoldingsInUsd);
        }
      }
    } catch (error) {
      console.error("Error fetching token value in USD:", error);
      return "0";
    }
  };
  const renderButtonText =() => {
    const reviewText = "Review Transaction";
    const selectTokenText = "Select Source Tokens";
    const connectWalletText = "Connect Wallet";
    const switchChainText = "Switch Network";
    const connectBTCWalletText="Connect BTC Wallet";
    const BalanceText="Insufficient Gas Balance";
    const buttonColor=():string=>{
      if(address===undefined || (destinationChain===CHAIN_IDS.BITCOIN_MAINNET && btcWalletAddress===undefined && destinationAddress===undefined)){
        return "ActionBtnActive"
      }else if(!sourceTokens.length){
        return "ActionBtnInActive"
      }else if(chainId && sourceChain!==chainId){
        return "ActionBtnActive"
      }else if(Number(inputValue)!==0 && (Number(inputValue) < (Number(outputValue) as number))){
        return "ActionBtnInActive"
      }
      return "ActionBtnActive"
    }
    return (
      <div className="ButtonsContainer">
       <div
          className={
            buttonColor()
          }
          onClick={() => {
            if (address === undefined || (destinationChain===CHAIN_IDS.BITCOIN_MAINNET && btcWalletAddress===undefined  && destinationAddress===undefined)){
              handleOpenWalletModal();
              return;
            }
            if(chainId && sourceChain!==chainId && sourceTokens.length>0){
              switchChain({
                chainId:sourceChain
              })
              return;
            }
            if (sourceTokens.length > 0 && inputValue && (Number(inputValue)!==0 && (Number(inputValue)>(Number(outputValue)+Number(sourceChainGasAmountUsd))))) {
              useDustAggregatorStore.getState().setOpenReviewTransactionModal();
            }
          }}
        >  
{
address === undefined 
    ? connectWalletText 
    : destinationChain !== ChainIds.BITCOIN 
      ? sourceTokens.length > 0
         ? chainId && sourceChain === chainId 
         ? (Number(inputValue)!==0 && (Number(inputValue)> (Number(outputValue)+Number(sourceChainGasAmountUsd)))) ? reviewText : BalanceText
         : switchChainText
          : selectTokenText
      : btcWalletAddress === undefined && (destinationAddress===undefined || !isValid) 
        ? connectBTCWalletText
        : sourceTokens.length > 0
          ? chainId && sourceChain === chainId 
            ?  (Number(inputValue)!==0 && (Number(inputValue)> (Number(outputValue)+Number(sourceChainGasAmountUsd)))) ? reviewText: BalanceText
            :  switchChainText 
          : selectTokenText
}
        </div>
      </div>
    );
  };

  return (
    <div className="DustAggregatorComponent">
      <DynamicCampaignContainer/>
      <div className="WidgetComponent">
        <div className="HeadingContainer">
          <span className="Heading">
            <GradientText text="Dust Aggregator" />
          </span>
        </div>
        <DynamicThresholdContainer/>
        <DynamicTokenInfoWidget
          chainId={sourceChain}
          actionType="source"
          currentChain={sourceChain}
          chainDetails={sourceChainDetails}
          setterFunction={handleSetSourceChain}
          sourceTokens={sourceTokens}
          isMulti={true}
        />
        {address!==undefined && <div className="TotalDustValue">
          <span>Total: $ {useDustAggregatorStore.getState().totalDustValue && useDustAggregatorStore.getState().totalDustValue>0 ? useDustAggregatorStore.getState().totalDustValue.toFixed(4) : "0.00"}</span>
          </div>}
        <div className="ArrowDownIcon">
          <FaArrowDown />
        </div>
        <DynamicTokenInfoWidget
          chainId={destinationChain}
          actionType="destination"
          currentChain={destinationChain}
          chainDetails={destinationChainDetails}
          setterFunction={handleSetDestinationChain}
          destinationToken={destinationToken}
          isMulti={false}
        />
        {destinationChain == ChainIds.BITCOIN && !btcWalletAddress && (
              <DynamicDestinationAddressWidget isValid={isValid} />
        )}
        {
        renderButtonText()
      }
      
      </div>
      
      <div className="InfoPillComponent">
        <div className="InfoIcon">
        <MdOutlineQuestionMark />
        </div>
        <div className="PillText">
          can&apos;t find your token? let us know  <span className="linkText" onClick={()=>{
            handleOpenLink(TOKEN_FORM_LINK)
          }}>Click here</span>
        </div>
      </div>
      <DynamicReviewTransactionModal/>
      <TransactionStatusModal/>
    </div>
  
  );
};
