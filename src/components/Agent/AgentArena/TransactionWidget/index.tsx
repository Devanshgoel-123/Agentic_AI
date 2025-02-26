import React from "react";
import { Box } from "@mui/material";
import CustomIcon from "@/components/common/CustomIcon";
import { TokenDetailsContainer } from "./TokenDetails";
import { Token } from "@/store/types/token-type";
import "./styles.scss"
import { IoSwapVertical } from "react-icons/io5";
interface Props{
    fromToken:Token;
    toToken:Token;
    minReceivedAmount:string;
    slippageTolerance:string;
    gasFees:string;
    estimatedReceivedAmount:string;
}
export const TransactionSummary=({fromToken,toToken,minReceivedAmount,slippageTolerance,gasFees,estimatedReceivedAmount}:Props)=>{
    
    const estimatedAmount=(Number(estimatedReceivedAmount)/(10**toToken.decimal)).toFixed(toToken.decimal)
    return (
        <div className="SummaryWrapper">
            <div className="HeaderText">
                <span>Your Transaction Summary</span>
            </div>
            <div className="TokenChatSummary">
                <TokenDetailsContainer tokenDetails={fromToken as Token}/>
                <Box className="SwapLogoSummary">
                <IoSwapVertical />
              </Box>
                <TokenDetailsContainer tokenDetails={toToken as Token}/>
            </div>
            <div className="SummaryText">
                    <div className="SummaryRow">
                        <span>Est. Received Amount</span>
                        <div className="tokenLogoAmount">
                        <span>{Number(estimatedAmount).toFixed(6)}</span>
                        <div className="tokenLogo">
                        <CustomIcon src={toToken.tokenLogo}/>
                        </div>
                       </div>
                    </div>
                    <div className="SummaryRow">
                        <span>Slippage Tolerance</span>
                        <span>{Number(slippageTolerance)/1000}%</span>
                    </div>
                    <div className="SummaryRow">
                        <span>Gas Fees</span>
                        <span>${!Number(gasFees) ? 0.00 : gasFees}</span>
                    </div>

            </div>
        </div>
    )
}