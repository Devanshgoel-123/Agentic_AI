import React from "react";
import "./styles.scss";


import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";
import Modal from "@mui/material/Modal"
import useMediaQuery  from "@mui/material/useMediaQuery";

import { useAccount } from "wagmi";
import useFetchCurveDepositContractConfig from "@/hooks/Pools/useFetchCurveDepositContractConfig";
import useCurveStore, { TokenInputObject } from "@/store/curve-store";
import useSendCurveDepositTransaction from "@/hooks/Pools/useSendCurveDepositTransaction";
import useSendCurvePoolApproval from "@/hooks/Pools/useSendCurvePoolApproval";

import CustomIcon from "@/components/common/CustomIcon";
import { ARROW_LEFT } from "@/utils/images";
import GradientText from "@/components/common/GradientText";
import { SlippageInfo } from "../../common/SlippageInfo";
import { DepositTokenInfo } from "./DepositTokenInfo";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import useFetchCurvePoolApproval from "@/hooks/Pools/useFetchCurvePoolApproval";
import { MODAL_STYLE } from "@/utils/constants";

interface Props {
  poolName: string;
  open: boolean;
  lpTokenName: string;
  lpTokenImage: string;
  lpTokenDecimal: number;
  contract: string;
  handleClose: () => void;
}

export const ReviewDepositModal = ({
  poolName,
  open,
  handleClose,
  lpTokenImage,
  lpTokenName,
  lpTokenDecimal,
  contract,
}: Props) => {
  const { address } = useAccount();
  const mobileDevice = useMediaQuery("(max-width: 600px)");

  const { loading, error } = useFetchCurveDepositContractConfig({
    contract: contract,
  });

  const {
    loading: approvalLoading,
    approvalStatuses,
    fetchApprovalStatuses: refetchApproval,
    setApprovalStatusesAfterCallBack,
  } = useFetchCurvePoolApproval({ contract });

  const { sendDepositTransaction, loading: depositLoading } =
    useSendCurveDepositTransaction({
      tokenInputs: useCurveStore.getState().tokenInputs,
      chainId: 7000,
      callBackFunction: handleClose,
      poolName: poolName,
    });

  const finalCallbackForDeposit = () => {
    approvalStatuses.forEach((el) => {
      if (el && !el?.approval) {
        el.approval = true;
      }
    });
    sendDepositTransaction();
  };

  const { startApprovals, loading: approvalTransactionLoading } =
    useSendCurvePoolApproval({
      address: address,
      poolChainId: 7000,
      approvalStatuses: approvalStatuses,
      tokenDetails: useCurveStore.getState().tokenInputs,
      finalCallback: finalCallbackForDeposit,
    });

  const handleSendTransaction = () => {
    if (approvalStatuses.some((el) => !el?.approval)) {
      startApprovals();
    } else {
      sendDepositTransaction();
    }
  };

  const returnBtnState = () => {
    if (
      loading ||
      approvalLoading ||
      approvalTransactionLoading ||
      depositLoading
    ) {
      return (
        <div className="ActionBtnGreen">
          <CustomSpinner size={"20"} color="#323227" />
        </div>
      );
    } else {
      if (approvalStatuses.some((el) => !el?.approval)) {
        return (
          <div className="ActionBtnGreen" onClick={handleSendTransaction}>
            Approve
          </div>
        );
      } else {
        return (
          <div className="ActionBtnGreen" onClick={handleSendTransaction}>
            Confirm Deposit
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
      <div className="ReviewDepositModalWrapper">
        {!mobileDevice && (
          <Grow in={open}>
            <div className="ReviewDepositModal">
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
                  <GradientText text="Review Deposit" />
                </Box>
              </Box>
              <div className="TransactionDetailContainer">
                <span className="Label">You Deposit</span>

                {useCurveStore
                  .getState()
                  .tokenInputs.map((item: TokenInputObject, index: number) => {
                    if (item.token && Number(item.amount) !== 0) {
                      return (
                        <DepositTokenInfo
                          key={index}
                          amount={item.amount}
                          token={item.token}
                        />
                      );
                    } else return null;
                  })
                  .filter(Boolean)}
              </div>
              <SlippageInfo />
              <div className="OutputTokenDetails">
                <span className="Label">You’ll Receive</span>
                <div className="LpTokenDetails">
                  <span className="Value">
                    {(
                      Number(useCurveStore.getState().minLpAmount) /
                      10 ** lpTokenDecimal
                    ).toFixed(4)}
                  </span>
                  <div className="LpTokenLogo">
                    <CustomIcon src={lpTokenImage} />
                  </div>
                  <span className="Value">{lpTokenName}</span>
                </div>
              </div>
              <div className="ButtonsContainer">{returnBtnState()}</div>
            </div>
          </Grow>
        )}
        {mobileDevice && (
          <Slide in={open} direction="up">
            <div className="ReviewDepositModal">
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
                  <GradientText text="Review Deposit" />
                </Box>
              </Box>
              <div className="TransactionDetailContainer">
                <span className="Label">You Deposit</span>

                {useCurveStore
                  .getState()
                  .tokenInputs.map((item: TokenInputObject, index: number) => {
                    if (item.token && Number(item.amount) !== 0) {
                      return (
                        <DepositTokenInfo
                          key={index}
                          amount={item.amount}
                          token={item.token}
                        />
                      );
                    } else return null;
                  })
                  .filter(Boolean)}
              </div>
              <SlippageInfo />
              <div className="OutputTokenDetails">
                <span className="Label">You’ll Receive</span>
                <div className="LpTokenDetails">
                  <span className="Value">
                    {(
                      Number(useCurveStore.getState().minLpAmount) /
                      10 ** lpTokenDecimal
                    ).toFixed(4)}
                  </span>
                  <div className="LpTokenLogo">
                    <CustomIcon src={lpTokenImage} />
                  </div>
                  <span className="Value">{lpTokenName}</span>
                </div>
              </div>
              <div className="ButtonsContainer">{returnBtnState()}</div>
            </div>
          </Slide>
        )}
      </div>
    </Modal>
  );
};
