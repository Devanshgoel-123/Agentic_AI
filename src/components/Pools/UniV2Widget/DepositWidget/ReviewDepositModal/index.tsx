import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";
import Modal from "@mui/material/Modal"
import useMediaQuery  from "@mui/material/useMediaQuery";
import React, { useState } from "react";
import "./styles.scss";

import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import useUniV2Store from "@/store/univ2-store";
import useFetchDepositContractConfig from "@/hooks/Pools/useFetchDepositContractConfig";
import useSendAddLiquidityUniV2 from "@/hooks/Pools/useSendAddLiquidityUniV2";
import useSendPoolApproval from "@/hooks/Pools/useSendPoolApproval";
import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";

import CustomIcon from "@/components/common/CustomIcon";
import { ARROW_LEFT } from "@/utils/images";
import GradientText from "@/components/common/GradientText";
import { SlippageInfo } from "../../common/SlippageInfo";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import { PoolContractType } from "@/store/types/pool-type";
import { MODAL_STYLE } from "@/utils/constants";

interface Props {
  poolChainId: number;
  poolName: string;
  open: boolean;
  lpTokenImage: string;
  lpTokenName: string;
  handleResetTransactionState: () => void;
  handleClose: () => void;
}

export const ReviewDepositModal = ({
  poolChainId,
  poolName,
  open,
  handleClose,
  lpTokenImage,
  lpTokenName,
  handleResetTransactionState,
}: Props) => {
  const { address } = useAccount();
  const mobileDevice = useMediaQuery("(max-width: 600px)");

  const { lpTokenAmount, isDepositQuoteLoading } = useUniV2Store(
    useShallow((state) => ({
      tokenABalanceObject: state.tokenABalanceObject,
      tokenBBalanceObject: state.tokenBBalanceObject,
      tokenAAmount: state.tokenAAmount,
      tokenBAmount: state.tokenBAmount,
      lpTokenAmount: state.lpTokenAmount,
      isDepositQuoteLoading: state.isDepositQuoteLoading,
      contractConfig: state.depositContractConfig,
    }))
  );
  /**
   * !Important
   * This loader tracks transition from
   * Approval txn -> Withdrawal txn
   * set it false if Approval is not required.
   * Handle with care.
   */
  const [transitionLoader, setTransitionLoader] = useState<boolean>(false);

  const {
    tokenABalanceObject,
    tokenBBalanceObject,
    tokenAAmount,
    tokenBAmount,
    depositContractConfig: contractConfig,
  } = useUniV2Store();

  const handleAddLiquidityCallBack = () => {
    handleResetTransactionState();
    handleClose();
  };
  const { loading: sendAddLiquidityLoading, sendAddLiquidityTransaction } =
    useSendAddLiquidityUniV2({
      poolChainId: poolChainId,
      poolName: poolName,
      tokenABalanceObject: tokenABalanceObject,
      tokenBBalanceObject: tokenBBalanceObject,
      contractConfig: contractConfig as PoolContractType,
      callBackFn: handleAddLiquidityCallBack,
    });

  /**
   * Callback function after tokenB approval
   * Step - 1: Refetch approval status to update it
   * Step - 2: call next step as call back function in refetch promise.
   * !Important set transition loader to false.
   */
  const handleTokenBApprovalCallBack = () => {
    setTransitionLoader(true);
    refetchTokenBApproval()
      .then(() => {
        sendAddLiquidityTransaction();
      })
      .finally(() => {
        setTransitionLoader(false);
      });
  };
  const {
    approval: tokenBApproval,
    sendApprovalTransaction: sendTokenBApproval,
    loading: tokenBApprovalLoading,
    refetch: refetchTokenBApproval,
  } = useSendPoolApproval({
    contractConfig: contractConfig as PoolContractType,
    amount: tokenBAmount,
    tokenId: tokenBBalanceObject.token?.id as number,
    tokenDecimal: tokenBBalanceObject.token?.decimal as number,
    chainId: tokenBBalanceObject.token?.chain.chainId as number,
    address: address,
    callBackFunction: handleTokenBApprovalCallBack,
  });

  /**
   * Call back function after token A approval
   * Call token B approval if approval token B is false
   * else call add liquidity function.
   * Step - 1: Refetch approval status to update it
   * Step - 2: call next step as call back function in refetch promise.
   * !Important set transition loader to false.
   */
  const handleTokenAApprovalCallBack = () => {
    setTransitionLoader(true);
    refetchTokenAApproval()
      .then(() => {
        if (!tokenBApproval) {
          sendTokenBApproval();
        } else {
          sendAddLiquidityTransaction();
        }
      })
      .finally(() => {
        setTransitionLoader(false);
      });
  };

  const {
    approval: tokenAApproval,
    sendApprovalTransaction: sendTokenAApproval,
    loading: tokenAApprovalLoading,
    refetch: refetchTokenAApproval,
  } = useSendPoolApproval({
    contractConfig: contractConfig as PoolContractType,
    amount: tokenAAmount,
    tokenId: tokenABalanceObject.token?.id as number,
    tokenDecimal: tokenABalanceObject.token?.decimal as number,
    chainId: tokenABalanceObject.token?.chain.chainId as number,
    address: address,
    callBackFunction: handleTokenAApprovalCallBack,
  });

  const { loading, error } = useFetchDepositContractConfig();

  const { data: tokenADollar } = useFetchTokenDollarValue({
    tokenId: tokenABalanceObject.token?.id as number,
  });

  const { data: tokenBDollar } = useFetchTokenDollarValue({
    tokenId: tokenBBalanceObject.token?.id as number,
  });

  /**
   * Main button function
   * Checks for token approvals first
   * if done then directly sends add liquidity transaction.
   */
  const sendMainTransaction = () => {
    if (!tokenAApproval) {
      sendTokenAApproval();
    } else if (!tokenBApproval) {
      sendTokenBApproval();
    } else {
      sendAddLiquidityTransaction();
    }
  };

  const returnBtnState = () => {
    if (
      isDepositQuoteLoading ||
      loading ||
      sendAddLiquidityLoading ||
      tokenAApprovalLoading ||
      tokenBApprovalLoading ||
      transitionLoader
    ) {
      return (
        <div className="ActionBtnGreen">
          <CustomSpinner size={"20"} color="#323227" />
        </div>
      );
    } else {
      return (
        <div className="ActionBtnGreen" onClick={sendMainTransaction}>
          {!tokenAApproval || !tokenBApproval ? "Approve" : "Confirm Deposit"}
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
      <div className="ReviewUniV2DepositModalWrapper">
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
                <div className="TokenInputWrapper">
                  <div className="TokenInputContainer">
                    <div className="InputContainer">
                      <span className="Token-Input">{tokenAAmount}</span>
                      <div className="DollarValue">
                        $
                        {(Number(tokenAAmount) * Number(tokenADollar)).toFixed(
                          4
                        )}
                      </div>
                    </div>
                    <div className="TokenInfoContainer">
                      <div className="TokenLogo">
                        <CustomIcon
                          src={tokenABalanceObject.token?.tokenLogo as string}
                        />
                        <div className="ChainLogo">
                          <CustomIcon
                            src={
                              tokenABalanceObject.token?.chain
                                .chainLogo as string
                            }
                          />
                        </div>
                      </div>
                      <div className="TokenName">
                        {tokenABalanceObject.token?.name}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="TokenInputWrapper">
                  <div className="TokenInputContainer">
                    <div className="InputContainer">
                      <span className="Token-Input">{tokenBAmount}</span>
                      <div className="DollarValue">
                        $
                        {(Number(tokenBAmount) * Number(tokenBDollar)).toFixed(
                          4
                        )}
                      </div>
                    </div>
                    <div className="TokenInfoContainer">
                      <div className="TokenLogo">
                        <CustomIcon
                          src={tokenBBalanceObject.token?.tokenLogo as string}
                        />
                        <div className="ChainLogo">
                          <CustomIcon
                            src={
                              tokenBBalanceObject.token?.chain
                                .chainLogo as string
                            }
                          />
                        </div>
                      </div>
                      <div className="TokenName">
                        {tokenBBalanceObject.token?.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SlippageInfo />
              <div className="OutputTokenDetails">
                <span className="Label">You’ll Receive</span>
                <div className="LpTokenDetails">
                  <span className="Value">
                    {Number(lpTokenAmount).toFixed(4)}
                  </span>
                  <div className="LpTokenLogo">
                    <CustomIcon src={lpTokenImage} />
                  </div>
                  <span className="Value">{lpTokenName}</span>
                </div>
              </div>
              <div className="ButtonsContainer">
                <div className="ActionBtnGreen">{returnBtnState()}</div>
              </div>
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
                <div className="TokenInputWrapper">
                  <div className="TokenInputContainer">
                    <div className="InputContainer">
                      <span className="Token-Input">{tokenAAmount}</span>
                      <div className="DollarValue">
                        $
                        {(Number(tokenAAmount) * Number(tokenADollar)).toFixed(
                          4
                        )}
                      </div>
                    </div>
                    <div className="TokenInfoContainer">
                      <div className="TokenLogo">
                        <CustomIcon
                          src={tokenABalanceObject.token?.tokenLogo as string}
                        />
                        <div className="ChainLogo">
                          <CustomIcon
                            src={
                              tokenABalanceObject.token?.chain
                                .chainLogo as string
                            }
                          />
                        </div>
                      </div>
                      <div className="TokenName">
                        {tokenABalanceObject.token?.name}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="TokenInputWrapper">
                  <div className="TokenInputContainer">
                    <div className="InputContainer">
                      <span className="Token-Input">{tokenBAmount}</span>
                      <div className="DollarValue">
                        $
                        {(Number(tokenBAmount) * Number(tokenBDollar)).toFixed(
                          4
                        )}
                      </div>
                    </div>
                    <div className="TokenInfoContainer">
                      <div className="TokenLogo">
                        <CustomIcon
                          src={tokenBBalanceObject.token?.tokenLogo as string}
                        />
                        <div className="ChainLogo">
                          <CustomIcon
                            src={
                              tokenBBalanceObject.token?.chain
                                .chainLogo as string
                            }
                          />
                        </div>
                      </div>
                      <div className="TokenName">
                        {tokenBBalanceObject.token?.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SlippageInfo />
              <div className="OutputTokenDetails">
                <span className="Label">You’ll Receive</span>
                <div className="LpTokenDetails">
                  <span className="Value">
                    {Number(lpTokenAmount).toFixed(4)}
                  </span>
                  <div className="LpTokenLogo">
                    <CustomIcon src={lpTokenImage} />
                  </div>
                  <span className="Value">{lpTokenName}</span>
                </div>
              </div>
              <div className="ButtonsContainer">
                <div className="ActionBtnGreen">{returnBtnState()}</div>
              </div>
            </div>
          </Slide>
        )}
      </div>
    </Modal>
  );
};
