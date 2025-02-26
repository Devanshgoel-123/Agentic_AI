import React, { useState } from "react";
import "./styles.scss";

import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import useSendLpTokenApproval from "@/hooks/Pools/useSendLpTokenApproval";
import useSendRemoveLiquidityCurve from "@/hooks/Pools/useSendRemoveLiquidityCurve";
import useFetchCurveWithdrawContractConfig from "@/hooks/Pools/useFetchCurveWithdrawContractConfig";
import useCurveStore from "@/store/curve-store";

import CustomIcon from "@/components/common/CustomIcon";
import GradientText from "@/components/common/GradientText";
import { ARROW_LEFT } from "@/utils/images";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";
import Modal from "@mui/material/Modal"
import useMediaQuery  from "@mui/material/useMediaQuery";
import { SlippageInfo } from "../../common/SlippageInfo";
import { OutputTokenDetails } from "./OutPutTokenDetails";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import { PoolContractType } from "@/store/types/pool-type";
import { MODAL_STYLE } from "@/utils/constants";

interface Props {
  open: boolean;
  contract: string;
  lpTokenName: string;
  lpTokenImage: string;
  lpTokenAddress: string;
  lpTokenDecimal: number;
  isBalanced: boolean;
  poolChainId: number;
  poolName: string;
  handleResetWidget: () => void;
  handleClose: () => void;
}

export const ReviewWithdrawModal = ({
  open,
  contract,
  lpTokenName,
  lpTokenImage,
  lpTokenAddress,
  lpTokenDecimal,
  isBalanced,
  poolChainId,
  poolName,
  handleResetWidget,
  handleClose,
}: Props) => {
  const mobileDevice = useMediaQuery("(max-width: 600px)");

  /**
   * !Important
   * This loader tracks transition from
   * Approval txn -> Withdrawal txn
   * set it false if Approval is not required.
   * Handle with care.
   */
  const [transitionLoader, setTransitionLoader] = useState<boolean>(false);
  const { address } = useAccount();
  const {
    tokenLpInput,
    minAmountTokens,
    minAmountOneToken,
    withdrawContractConfig,
  } = useCurveStore(
    useShallow((state) => ({
      tokenLpInput: state.tokenLpInput,
      minAmountTokens: state.minAmountTokens,
      minAmountOneToken: state.minAmountOneToken,
      withdrawContractConfig: state.withdrawContractConfig,
    }))
  );

  const { loading, error } = useFetchCurveWithdrawContractConfig({
    contract: contract,
    isBalanced: isBalanced,
    isDiPool: minAmountTokens.length === 2,
    lpTokenDecimal: lpTokenDecimal,
  });

  const handleResetTransaction = () => {
    handleResetWidget();
    handleClose();
  };

  const {
    loading: sendRemoveTransactionLoading,
    sendRemoveLiquidityTransaction,
  } = useSendRemoveLiquidityCurve({
    poolName: poolName,
    isBalanced: isBalanced,
    chainId: poolChainId,
    callBackFn: handleResetTransaction,
  });

  const handleApprovalCallBack = () => {
    setTransitionLoader(true);
    refetch()
      .then(() => sendRemoveLiquidityTransaction())
      .finally(() => {
        setTransitionLoader(false);
      });
  };

  const {
    approval,
    sendApprovalTransaction,
    loading: approvalLoading,
    refetch,
  } = useSendLpTokenApproval({
    contractConfig: withdrawContractConfig as PoolContractType,
    amount: tokenLpInput,
    lpTokenAddress: lpTokenAddress,
    lpTokenDecimal: lpTokenDecimal,
    chainId: poolChainId,
    address: address,
    callBackFunction: handleApprovalCallBack,
  });

  /**
   * Function to render output tokens as per isBalances.
   * isBalanced = true -> render amounts.
   * isBalanced = false -> render amount one coin.
   * @returns JSX of Output tokens.
   */
  const renderOutPutTokens = () => {
    if (isBalanced) {
      return minAmountTokens.map((el, index) => (
        <OutputTokenDetails
          key={index}
          tokenId={el.token.id}
          tokenLogo={el.token.tokenLogo}
          amount={el.amount}
          decimal={el.token.decimal}
          name={el.token.name}
        />
      ));
    } else {
      return (
        minAmountOneToken && (
          <OutputTokenDetails
            tokenId={minAmountOneToken.token.id}
            tokenLogo={minAmountOneToken.token.tokenLogo}
            amount={minAmountOneToken.amount}
            decimal={minAmountOneToken.token.decimal}
            name={minAmountOneToken.token.name}
          />
        )
      );
    }
  };

  const handleSendTransaction = () => {
    if (!approval) {
      sendApprovalTransaction();
    } else {
      sendRemoveLiquidityTransaction();
    }
  };

  /**
   * Check of loading and error states.
   * @returns JSX as per loading and error states
   */
  const returnButtonState = () => {
    if (
      loading ||
      sendRemoveTransactionLoading ||
      approvalLoading ||
      transitionLoader
    ) {
      return (
        <div className="ActionBtnGreen">
          <CustomSpinner size={"20"} color="#323227" />
        </div>
      );
    } else {
      if (!approval) {
        return (
          <div className="ActionBtnGreen" onClick={handleSendTransaction}>
            Approve
          </div>
        );
      } else {
        return (
          <div className="ActionBtnGreen" onClick={handleSendTransaction}>
            Confirm Withdrawal
          </div>
        );
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={MODAL_STYLE}
    >
      <div className="ReviewWithdrawModalWrapper">
        {!mobileDevice && (
          <Grow in={open}>
            <div className="ReviewWithdrawModal">
              {" "}
              <Box className="HeadingContainer">
                <Box
                  className="BackBtn"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <CustomIcon src={ARROW_LEFT} />
                </Box>
                <Box className="HeadingText">
                  <GradientText text="Review Withdrawal" />
                </Box>
              </Box>
              <div className="OutputTokenDetails">
                <span className="Label">You Sell</span>
                <div className="LpTokenDetails">
                  <span className="Value">
                    {Number(tokenLpInput).toFixed(4)}
                  </span>
                  <div className="LpTokenLogo">
                    <CustomIcon src={lpTokenImage} />
                  </div>
                  <span className="Value">{lpTokenName}</span>
                </div>
              </div>
              <div className="TransactionDetailContainer">
                <span className="Label">You Receive</span>
                {renderOutPutTokens()}
              </div>
              <SlippageInfo />
              <div className="ButtonsContainer">{returnButtonState()}</div>
            </div>
          </Grow>
        )}
        {mobileDevice && (
          <Slide in={open} direction="up">
            <div className="ReviewWithdrawModal">
              {" "}
              <Box className="HeadingContainer">
                <Box
                  className="BackBtn"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <CustomIcon src={ARROW_LEFT} />
                </Box>
                <Box className="HeadingText">
                  <GradientText text="Review Withdrawal" />
                </Box>
              </Box>
              <div className="OutputTokenDetails">
                <span className="Label">You Sell</span>
                <div className="LpTokenDetails">
                  <span className="Value">
                    {Number(tokenLpInput).toFixed(4)}
                  </span>
                  <div className="LpTokenLogo">
                    <CustomIcon src={lpTokenImage} />
                  </div>
                  <span className="Value">{lpTokenName}</span>
                </div>
              </div>
              <div className="TransactionDetailContainer">
                <span className="Label">You Receive</span>
                {renderOutPutTokens()}
              </div>
              <SlippageInfo />
              <div className="ButtonsContainer">{returnButtonState()}</div>
            </div>
          </Slide>
        )}
      </div>
    </Modal>
  );
};
