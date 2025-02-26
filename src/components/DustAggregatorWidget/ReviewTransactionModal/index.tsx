import React, { useEffect , useState} from "react";
import "./styles.scss"
import  Modal  from "@mui/material/Modal";
import useDustAggregatorStore from "@/store/dust-aggregator-store";
import { useShallow } from "zustand/react/shallow";
import { MODAL_STYLE } from "@/utils/constants";
import { FaArrowLeft } from "react-icons/fa6";
import CustomIcon from "@/components/common/CustomIcon";
import { Token} from "@/store/types/token-type";
import Box from "@mui/material/Box"
import { Grow } from "@mui/material";
import GradientText from "@/components/common/GradientText";
import { ETH_LOGO } from "@/utils/images";
import { useSendPermitApprovalTransaction } from "@/hooks/DustAggregator/useSendPermitApprovalTransaction";
import { useWriteContractInteraction } from "@/hooks/DustAggregator/useWriteContractInteraction";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import { useAccount } from "wagmi";
import { useFetchPermitApproval } from "@/hooks/DustAggregator/useFetchPermitApproval";
import useSendDustSwapTransaction from "@/hooks/DustAggregator/useWriteSwapTransaction";
import { closeSnackbar } from "notistack";

export const ReviewTransactionModal=()=>{
    const {address}=useAccount();
    const {
        openReviewTransactionModal,
        sourceTokens,
        destinationToken,
        approvalStatuses,
        sourceChain,
        destinationChain
    }=useDustAggregatorStore(useShallow((state)=>({
       openReviewTransactionModal:state.openReviewTransactionModal,
        sourceTokens:state.sourceTokens,
        destinationChain:state.destinationChain,
        destinationToken:state.destinationToken,
        sourceChain:state.sourceChain,
        approvalStatuses:state.approvalStatus
    })))
   
    
    const {
      loading: approvalLoading,
      // approvalStatuses,
      fetchApprovalStatuses,
    } = useFetchPermitApproval()

  useEffect(()=>{
    if(sourceTokens.length===0 || address===undefined){
      return
    }
    fetchApprovalStatuses()
  },[address,useDustAggregatorStore.getState().sourceTokens,useDustAggregatorStore.getState().sourceTokens.length,useDustAggregatorStore.getState().tokenSwapForPermit])

    const finalCallbackForApproval = () => {
      useDustAggregatorStore.getState().setApprovalStatusTrueForConfirmation()
       handleSendTransaction()
    };

    const { startApprovals, loading: approvalTransactionLoading }=useSendPermitApprovalTransaction({
      address: address,
      approvalStatuses: useDustAggregatorStore.getState().approvalStatus,
      tokenDetails: useDustAggregatorStore.getState().tokenSwapForPermit,
      finalCallback: finalCallbackForApproval,
    });
     

   
    const handleCrossChainTransactionCallBackFunction = () => {
      useDustAggregatorStore.getState().clearSourceChainToken();
      useDustAggregatorStore.getState().clearTokenSwapForPermit();
      useDustAggregatorStore.getState().setCloseReviewTransactionModal();
      useDustAggregatorStore.getState().handleOpenTransactionStatusModalDust();
      useDustAggregatorStore.getState().setClearTotalDustValue()
       
    };

    const handleSwapTransactionCallBackFunction=()=>{
      useDustAggregatorStore.getState().setCloseReviewTransactionModal();
      useDustAggregatorStore.getState().clearSourceChainToken();
      useDustAggregatorStore.getState().clearTokenSwapForPermit();
      useDustAggregatorStore.getState().setClearTotalDustValue()
    }

    const { sendWriteTransaction,isLoading:swapLoading}=useWriteContractInteraction(
      {
        callBackFn: handleCrossChainTransactionCallBackFunction,
      }
    ); 
    
    const { sendSwapTransaction,loading:isLoading }=useSendDustSwapTransaction({
      callBackFn:handleSwapTransactionCallBackFunction
    });

    const handleSendTransaction = () => {
      closeSnackbar()
      if(sourceChain===destinationChain){
        sendSwapTransaction()
      } else{
        sendWriteTransaction()
      } 
    };

    const handleApprovalTransaction=()=>{
      closeSnackbar()
      startApprovals()
    }
    
    /**
 * Function to determine text for the transaction modal button
 * @returns nothing
 */

const renderButtonState = () => {
    if(
     approvalTransactionLoading || swapLoading ||  isLoading
    ){
      return (
        <Box className="ButtonVariantGreen ActionBtnGreen" >
        <CustomSpinner size={"20"} color="#323227" />
      </Box>
      );
    }else{
      if (approvalStatuses.some((item)=>item?.approval===false)) {  
        return (
          <div className="ActionBtnGreen" onClick={handleApprovalTransaction}>
            Approve
          </div>
        );
      } else {
        return (
          <div className="ActionBtnGreen" onClick={handleSendTransaction}>
            Confirm Transaction
          </div>
        );
      }
    }
};
const approvedCount=useDustAggregatorStore.getState().initialApprovalLength-useDustAggregatorStore.getState().approvalStatus.filter((item)=>item?.approval===false).length;
const divisor=100/useDustAggregatorStore.getState().initialApprovalLength;
    return (
        <Modal
        open={openReviewTransactionModal}
        sx={MODAL_STYLE}
        onClose={() => {
          useDustAggregatorStore.getState().setCloseReviewTransactionModal();
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description" 
        >
          <Box  className="ReviewTransactionWrapperDust">
          <Grow in={openReviewTransactionModal}>
            <Box className="ReviewTransactionContainerDust">
              <Box className="HeadingWrapper">
                <Box className="HeadingContainer">
                  <Box
                    className="BackBtn"
                    onClick={() => {
                      useDustAggregatorStore.getState().setCloseReviewTransactionModal()
                    }}
                  >
                    <FaArrowLeft />
                  </Box>
                  <Box className="HeadingText">
                    <GradientText text="Review Transaction" />
                  </Box>
                </Box>
              </Box>
               <Box className="QuoteDetailsContainer">
                <span>Your Tokens</span>
                <div className="TokenLogoContainer">
                     {sourceTokens?.map((item: Token) => (
                       <div key={item.address} className="TokenLogo">
                         <CustomIcon src={item.tokenLogo} />
                       </div>
                     )).slice(0,3)
                     }
                     {
                       sourceTokens && sourceTokens?.length>3 && <div className="TokenLogo TokenText" >
                         +{sourceTokens.length-3}
                       </div>
                     }
                </div>
              </Box>  
              <Box className="AmountsDetailsContainer">
                {useDustAggregatorStore.getState().approvalStatus.length >0 &&  
                <Box className="ApprovalContainerWrapper">
                  <div className="ApprovalContainer">
                    <span>Approval Done</span>
                    <span>
                      {
                      approvedCount
                      }
                      /
                      {
                      useDustAggregatorStore.getState().initialApprovalLength
                     }
                  </span>
                  </div>
                  <Box className="progressBarFull">
                <Box className="progressBarPartial" width={`${approvedCount*(divisor)}%`}></Box>
            </Box>
                </Box>}
                <Box className="AmountsTile">
                  <span className="AmountsLabelDust">Source Chain</span>
                  <Box className="AmountValueContainer">
                  <span className="AmountValue">{sourceTokens.length >0 && (sourceTokens[0].chain.name==="Binance Smart Chain" ? "BNB" : sourceTokens[0].chain.name)}</span>
                    <Box className="TokenLogo">
                      <CustomIcon src={ sourceTokens.length >0 && sourceTokens[0].chain.chainLogo || ETH_LOGO} />
                    </Box>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabelDust">Source Chain Gas Fees</span>
                  <Box className="AmountValueContainer">
                  <span className="AmountValue">${useDustAggregatorStore.getState().sourceChainGasFeesUsd || "0.00"}</span>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabelDust">Destination Chain</span>
                  <Box className="AmountValueContainer">
                    <span className="AmountValue">
                      {destinationToken?.chain.name ==="Binance Smart Chain" ? "BNB":destinationToken?.chain.name}
                    </span>
                    <Box className="TokenLogo">
                      <CustomIcon src={destinationToken?.chain.chainLogo || ETH_LOGO} />
                    </Box>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabelDust">Destination Chain Gas Fees</span>
                  <Box className="AmountValueContainer">
                  <span className="AmountValue">${useDustAggregatorStore.getState().outputValue || 0.00}</span>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabelDust">Destination Token</span>
                  <Box className="AmountValueContainer">
                    <span className="AmountValue">{destinationToken?.name}</span>
                    <Box className="AmountValueContainer">
                    <Box className="TokenLogo">
                      <CustomIcon src={ destinationToken?.tokenLogo || ETH_LOGO} />
                    </Box>
                  </Box>
                  </Box>
                </Box>
              </Box>
              {renderButtonState()}
            </Box>
          </Grow>
          </Box>
          
        </Modal>
    )
}