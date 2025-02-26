import React, { useState } from "react";
import "./styles.scss";


import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";
import Modal from "@mui/material/Modal"
import useMediaQuery  from "@mui/material/useMediaQuery";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import useSendRemoveLiquidityUniV2 from "@/hooks/Pools/useSendRemoveLiquidityUniV2";
import useFetchWithdrawUniV2ContractConfig from "@/hooks/Pools/useFetchWithdrawUniV2ContractConfig";
import useUniV2Store from "@/store/univ2-store";
import useSendLpTokenApproval from "@/hooks/Pools/useSendLpTokenApproval";

import CustomIcon from "@/components/common/CustomIcon";
import GradientText from "@/components/common/GradientText";
import { ARROW_LEFT } from "@/utils/images";
import { SlippageInfo } from "../../common/SlippageInfo";
import { WithdrawTokenInfo } from "./WithdrawTokenInfo";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import { PoolContractType } from "@/store/types/pool-type";
import { MODAL_STYLE } from "@/utils/constants";

interface Props {
  poolName: string;
  open: boolean;
  poolChainId: number;
  lpTokenImage: string;
  lpTokenDecimal: number;
  lpTokenAddress: string;
  lpTokenName: string;
  handleResetTransactionState: () => void;
  handleClose: () => void;
}

export const ReviewWithdrawModal = ({
  poolName,
  open,
  lpTokenImage,
  handleClose,
  lpTokenDecimal,
  lpTokenAddress,
  lpTokenName,
  poolChainId,
  handleResetTransactionState,
}: Props) => {
  const { address } = useAccount();
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  /**
   * !Important
   * This loader tracks transition from
   * Approval txn -> Withdrawal txn
   * set it false if Approval is not required.
   * Handle with care.
   */
  const [transitionLoader, setTransitionLoader] = useState<boolean>(false);
  const { tokenLpInput, minAmountTokenBObject, minAmountTokenAObject } =
    useUniV2Store(
      useShallow((state) => ({
        tokenLpInput: state.tokenLpInput,
        minAmountTokenAObject: state.minAmountTokenAObject,
        minAmountTokenBObject: state.minAmountTokenBObject,
      }))
    );

  const { loading, error } = useFetchWithdrawUniV2ContractConfig({
    lpTokenDecimal: lpTokenDecimal,
  });

  /**
   * Callback function after Lp token approval
   * Step - 1: Refetch approval status to update it
   * Step - 2: call next step as call back function in refetch promise.
   * !Important set transition loader to false.
   */
  const handleTokenApprovalCallBack = () => {
    setTransitionLoader(true);
    refetchLpTokenApproval()
      .then(() => {
        sendRemoveLiquidityTransaction();
      })
      .finally(() => {
        setTransitionLoader(false);
      });
  };
  const {
    loading: approvalLoading,
    sendApprovalTransaction,
    approval,
    refetch: refetchLpTokenApproval,
  } = useSendLpTokenApproval({
    address: address,
    amount: useUniV2Store.getState().tokenLpInput,
    contractConfig: useUniV2Store.getState()
      .withdrawContractConfig as PoolContractType,
    lpTokenAddress: lpTokenAddress,
    lpTokenDecimal: lpTokenDecimal,
    chainId: poolChainId,
    callBackFunction: handleTokenApprovalCallBack,
  });

  /**
   * Reset widget state after transaction.
   */
  const handleResetTransaction = () => {
    handleResetTransactionState();
    handleClose();
  };

  const {
    loading: sendRemoveLiquidityLoading,
    sendRemoveLiquidityTransaction,
  } = useSendRemoveLiquidityUniV2({
    poolName: poolName,
    chainId: poolChainId,
    callBackFn: handleResetTransaction,
  });

  const handleMainButtonClick = () => {
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
      error ||
      sendRemoveLiquidityLoading ||
      approvalLoading ||
      transitionLoader
    ) {
      return (
        <div className="ActionBtnGreen">
          <CustomSpinner size={"20"} color="#323227" />
        </div>
      );
    } else {
      return (
        <div className="ActionBtnGreen" onClick={handleMainButtonClick}>
          {!approval ? "Approve" : "Confirm Withdrawal"}
        </div>
      );
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
      <div className="ReviewUniV2WithdrawModalWrapper">
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
                    {Number(tokenLpInput).toFixed(5)}
                  </span>
                  <div className="LpTokenLogo">
                    <CustomIcon src={lpTokenImage} />
                  </div>
                  <span className="Value">{lpTokenName}</span>
                </div>
              </div>
              <div className="TransactionDetailContainer">
                <span className="Label">You Receive</span>
                <WithdrawTokenInfo
                  token={minAmountTokenAObject.token}
                  amount={minAmountTokenAObject.amount}
                />
                <WithdrawTokenInfo
                  token={minAmountTokenBObject.token}
                  amount={minAmountTokenBObject.amount}
                />
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
                    {Number(tokenLpInput).toFixed(5)}
                  </span>
                  <div className="LpTokenLogo">
                    <CustomIcon src={lpTokenImage} />
                  </div>
                  <span className="Value">{lpTokenName}</span>
                </div>
              </div>
              <div className="TransactionDetailContainer">
                <span className="Label">You Receive</span>
                <WithdrawTokenInfo
                  token={minAmountTokenAObject.token}
                  amount={minAmountTokenAObject.amount}
                />
                <WithdrawTokenInfo
                  token={minAmountTokenBObject.token}
                  amount={minAmountTokenBObject.amount}
                />
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
