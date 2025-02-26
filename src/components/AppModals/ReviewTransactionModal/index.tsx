import React, { Fragment, useState } from "react";
import "./styles.scss";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Grow from "@mui/material/Grow";
import dynamic from "next/dynamic";
import Slide from "@mui/material/Slide";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import useTransferStore from "@/store/transfer-store";
import useFetchQuoteForTransaction from "@/hooks/Transfer/useFetchQuoteForTransaction";
import useSlippageStore from "@/store/slippage-store";
import useSendContractTransaction from "@/hooks/Transfer/useSendContractTransaction";
import useWriteContractInteraction from "@/hooks/Transfer/useWriteContractInteraction";
import useSendApprovalTransaction from "@/hooks/Transfer/useSendApprovalTransaction";
import useSendSwapTransaction from "@/hooks/Transfer/useSendSwapTransaction";
import useSendBTCTransaction from "@/hooks/Transfer/useSendBTCTransaction";

import CustomIcon from "@/components/common/CustomIcon";
import { ARROW_RIGHT, ETH_LOGO } from "@/utils/images";
import GradientText from "@/components/common/GradientText";
import {
  formatNumberWithDecimals,
  formattedValueToDecimals,
  returnFormattedValue,
} from "@/utils/number";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { MdError } from "react-icons/md";
import { ChainIds } from "@/utils/enums";
import useWalletConnectStore from "@/store/wallet-store";

import { MODAL_STYLE } from "@/utils/constants";
import { FaArrowLeft } from "react-icons/fa6";
import { MdOutlineRestartAlt } from "react-icons/md";
import useSendSolanaTransaction from "@/hooks/Transfer/useSendSolanaTransaction";
import useFetchActivity from "@/hooks/common/useFetchActivity";
import Tooltip from "@mui/material/Tooltip/Tooltip";

const DynamicCustomSpinner = dynamic(() =>
  import("@/components/common/CustomSpinner").then((mod) => mod.CustomSpinner)
);

const DynamicOutputTokenContainer = dynamic(() =>
  import("./QuoteDetailsContainer").then((mod) => mod.QuoteTokensContainer)
);

interface Props {
  open: boolean;
  handleSetTransactionState: () => void;
  handleClose: () => void;
}

export const ReviewTransactionModal = ({
  open,
  handleClose,
  handleSetTransactionState,
}: Props) => {
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  const [timer, setTimer] = useState(60);
  const { fetchMore } = useFetchActivity({
    currentPage: 1,
    limit: 10,
  });
  /**
   * !Important
   * This loader tracks transition from
   * Approval txn -> Withdrawal txn
   * set it false if Approval is not required.
   * Handle with care.
   */
  const [transitionLoader, setTransitionLoader] = useState<boolean>(false);
  const { address } = useAccount();
  const { btcWalletAddress, btcWalletId } = useWalletConnectStore(
    useShallow((state) => ({
      btcWalletAddress: state.btcWalletAddress,
      btcWalletId: state.btcWalletId,
    }))
  );

  const {
    tokenInAmount,
    tokenOutAmount,
    payToken,
    getToken,
    payChain,
    getChain,
    minimumReceived,
    srcChainGasFees,
    destChainGasFees,
    zetaChainGas,
    route,
    estimatedTime,
    openTransactionStatusModal,
  } = useTransferStore(
    useShallow((state) => ({
      tokenInAmount: state.tokenInAmount,
      tokenOutAmount: state.tokenOutAmount,
      payToken: state.payToken,
      getToken: state.getToken,
      payChain: state.payChain,
      getChain: state.getChain,
      minimumReceived: state.minimumReceived,
      srcChainGasFees: state.srcChainGasFees,
      destChainGasFees: state.destChainGasFees,
      zetaChainGas: state.zetaChainGas,
      route: state.route,
      estimatedTime: state.estimatedTime,
      openTransactionStatusModal: state.openTransactionStatusModal,
    }))
  );

  /**
   * Call back function after transaction.
   */
  const handleTransactionCallBackFunction = () => {
    if (
      useTransferStore.getState().payChain ===
      useTransferStore.getState().getChain
    )
      return;
    useTransferStore.getState().handleOpenTransactionStatusModal();
    setTimer(60);
    fetchMore({
      variables: {
        currentPage: 1,
        limit: 10,
      },
    }).then(() => {});
    handleClose();
  };

  const handleSolanaTransactionCallBack = () => {
    handleClose();
  };

  const { sendCrossChainTransaction, isPending } = useSendContractTransaction({
    callBackFn: handleTransactionCallBackFunction,
  });

  const { sendBTCTransaction, loading: btcTransactionLoading } =
    useSendBTCTransaction();

  const { sendWriteTransaction, isPending: writeTransactionLoading } =
    useWriteContractInteraction({
      callBackFn: handleTransactionCallBackFunction,
    });
  const {
    depositSOL,
    depositSOLToAnyChain,
    depositSPL,
    depositSPLAnyChain,
    loading: solanaTransactionLoading,
  } = useSendSolanaTransaction({
    callBackFn: handleSolanaTransactionCallBack,
  });

  const handleSwapCallBack = () => {
    setTimer(60);
    useTransferStore
      .getState()
      .setTokenInAmount(useTransferStore.getInitialState().tokenInAmount);
    useTransferStore
      .getState()
      .setTokenOutAmount(useTransferStore.getInitialState().tokenOutAmount);
    handleSetTransactionState();
    fetchMore({
      variables: {
        currentPage: 1,
        limit: 10,
      },
    }).then(() => {});
    handleClose();
  };

  const { sendSwapTransaction, loading: swapLoading } = useSendSwapTransaction({
    callBackFn: handleSwapCallBack,
  });

  /**
   * Callback function after approval.
   */
  const handleApprovalCallBack = () => {
    setTransitionLoader(true);
    refetchApproval()
      .then(() => {
        if (
          useTransferStore.getState().payChain ===
          useTransferStore.getState().getChain
        ) {
          sendSwapTransaction();
        } else {
          sendWriteTransaction();
        }
      })
      .finally(() => {
        setTransitionLoader(false);
      });
  };

  const {
    approval,
    sendApprovalTransaction,
    loading: approvalProcessLoading,
    refetch: refetchApproval,
  } = useSendApprovalTransaction({ callBackFunction: handleApprovalCallBack });

  const { slippageValue } = useSlippageStore();

  const { loading, error, refetch } = useFetchQuoteForTransaction({
    fromAmount: tokenInAmount,
    fromChainId: payChain,
    fromToken: payToken,
    toChainId: getChain,
    toToken: getToken,
    fromTokenId: Number(payToken?.id ?? 0),
    toTokenId: Number(getToken?.id ?? 0),
    slippage: Number(slippageValue),
    walletAddress: address,
    isSkip:
      !Number(tokenInAmount) ||
      Number(tokenInAmount) === 0 ||
      !payChain ||
      !payToken ||
      !getChain ||
      !getToken ||
      !Number(payToken?.id ?? 0) ||
      !Number(getToken?.id ?? 0) ||
      !slippageValue ||
      !address ||
      !open ||
      openTransactionStatusModal,
    isRefetch: true,
    timerFunction: setTimer,
  });

  /**
   * Function to manually refetch transaction details from backend.
   */
  const handleManualRefetch = () => {
    refetch();
    setTimer(0);
  };

  /**
   * Check error and loading state and return JSX
   * @param value Value to check
   * @returns Error and loading JSX
   */
  const returnValueCheck = (value: string) => {
    if (loading) {
      return (
        <CustomTextLoader
          text={formattedValueToDecimals(value, 10).toString()}
        />
      );
    } else if (error) {
      return <MdError />;
    } else {
      return formattedValueToDecimals(returnFormattedValue(Number(value)), 10);
    }
  };

  /**
   * Send main transaction after approval
   * @returns void
   */
  const handleSendTransaction = async () => {
    if (
      isPending ||
      writeTransactionLoading ||
      approvalProcessLoading ||
      swapLoading ||
      btcTransactionLoading ||
      solanaTransactionLoading
    )
      return;
    if (payChain === getChain) {
      if (payToken?.isNative) {
        sendSwapTransaction();
        //
      } else {
        if (!approval) {
          sendApprovalTransaction();
        } else {
          sendSwapTransaction();
        }
      }
    } else {
      if (payChain === ChainIds.BITCOIN) {
        sendBTCTransaction(btcWalletId as string);
      } else if (payChain === ChainIds.SOLANA) {
        if (getChain === ChainIds.ZETACHAIN) {
          if (payToken?.isNative) {
            depositSOL();
          } else {
            depositSPL();
          }
        } else {
          if (payToken?.isNative) {
            depositSOLToAnyChain();
          } else {
            depositSPLAnyChain();
          }
        }
      } else if (payChain === ChainIds.ZETACHAIN) {
        if (payToken?.isNative) {
          sendWriteTransaction();
        } else {
          if (!approval) {
            sendApprovalTransaction();
          } else {
            sendWriteTransaction();
          }
        }
      } else {
        if (payToken?.isNative) {
          sendWriteTransaction();
        } else {
          if (!approval) {
            sendApprovalTransaction();
          } else {
            sendWriteTransaction();
          }
        }
      }
    }
  };

  const renderButtonState = () => {
    if (
      isPending ||
      writeTransactionLoading ||
      approvalProcessLoading ||
      swapLoading ||
      btcTransactionLoading ||
      transitionLoader ||
      solanaTransactionLoading
    ) {
      return (
        <Box className="InitiateTransactionBtn">
          <DynamicCustomSpinner size={"20"} color="#323227" />
        </Box>
      );
    } else {
      if (!approval) {
        return (
          <Box
            className="InitiateTransactionBtn"
            onClick={handleSendTransaction}
          >
            Approve
          </Box>
        );
      } else {
        return (
          <Box
            className="InitiateTransactionBtn"
            onClick={handleSendTransaction}
          >
            Confirm Transaction
          </Box>
        );
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setTimer(0);
        handleClose();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={MODAL_STYLE}
    >
      <Box className="ReviewTransactionWrapper">
        {!mobileDevice && (
          <Grow in={open}>
            <Box className="ReviewTransactionContainer">
              <Box className="HeadingWrapper">
                <Box className="HeadingContainer">
                  <Box
                    className="BackBtn"
                    onClick={() => {
                      setTimer(0);
                      handleClose();
                    }}
                  >
                    <FaArrowLeft />
                  </Box>
                  <Box className="HeadingText">
                    <GradientText text="Review Transaction" />
                  </Box>
                </Box>
                <Box className="TimerContainer">
                  <Box className="TimerIcon" onClick={handleManualRefetch}>
                    <MdOutlineRestartAlt />
                  </Box>
                  <span>{timer}s</span>
                </Box>
              </Box>
              <Box className="QuoteDetailsContainer">
                <DynamicOutputTokenContainer
                  logo={payToken?.tokenLogo ?? ETH_LOGO}
                  chainLogo={payToken?.chain.chainLogo ?? ETH_LOGO}
                  tokenName={payToken?.name ?? "Eddy"}
                  chainName={payToken?.chain.name ?? "Eddy"}
                  amount={tokenInAmount}
                  tokenDetails={payToken}
                  loading={loading}
                  error={error}
                  actionType="From"
                />
                <DynamicOutputTokenContainer
                  logo={getToken?.tokenLogo ?? ETH_LOGO}
                  chainLogo={getToken?.chain.chainLogo ?? ETH_LOGO}
                  tokenName={getToken?.name ?? "Eddy"}
                  chainName={getToken?.chain.name ?? "Eddy"}
                  amount={tokenOutAmount}
                  tokenDetails={getToken}
                  loading={loading}
                  error={error}
                  actionType="To"
                />
              </Box>
              <Box className="AmountsDetailsContainer">
                <Box className="AmountsTile">
                  <span className="AmountsLabel">Est. Received Amount</span>
                  <Box className="AmountValueContainer">
                    <span className="AmountValue">
                      {formatNumberWithDecimals(Number(tokenOutAmount))}
                    </span>
                    <Box className="TokenLogo">
                      <CustomIcon src={getToken?.tokenLogo ?? ETH_LOGO} />
                    </Box>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabel">Min. Received Amount</span>
                  <Box className="AmountValueContainer">
                    <span className="AmountValue">
                      {formatNumberWithDecimals(Number(minimumReceived))}
                    </span>
                    <Box className="TokenLogo">
                      <CustomIcon src={getToken?.tokenLogo ?? ETH_LOGO} />
                    </Box>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabel">Slippage</span>
                  <Box className="AmountValueContainer">
                    <span className="AmountValue">{slippageValue}</span>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabel">Gas Fees</span>
                  <Box className="AmountValueContainer">
                    <span className="AmountValue">
                      $
                      {returnValueCheck(
                        (
                          Number(srcChainGasFees) +
                          Number(destChainGasFees) +
                          Number(zetaChainGas)
                        ).toString()
                      )}
                    </span>
                  </Box>
                </Box>
                {getChain === ChainIds.BITCOIN && (
                  <Box className="AmountsTile">
                    <span className="AmountsLabel">Destination Address:</span>
                    <Box className="AmountValueContainer">
                      <span className="AmountValue">
                        {btcWalletAddress?.substring(0, 3) +
                          "..." +
                          btcWalletAddress?.substring(
                            btcWalletAddress.length - 4
                          )}
                      </span>
                    </Box>
                  </Box>
                )}
                <Box className="AmountsTile">
                  <span className="AmountsLabel">Est. time</span>
                  <Box className="AmountValueContainer">
                    <span className="AmountValue">
                      {Math.ceil(Number(estimatedTime) / 60)} mins
                    </span>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabel">Route</span>
                  <Box className="AmountValueContainer">
                    {route && (
                      <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: "#121212",
                              border: "2px solid #1E1E1E",
                              fontFamily: "Manrope",
                            },
                          },
                        }}
                        title={route.source.tokenName}
                      >
                        <Box className="TokenLogo">
                          <CustomIcon src={route.source.tokenImage} />
                        </Box>
                      </Tooltip>
                    )}
                    <Box className="ArrowIcon">
                      <CustomIcon src={ARROW_RIGHT} />
                    </Box>
                    {route &&
                      route.intermediates.map((item, index) => (
                        <Fragment key={`${index}${item.tokenName}`}>
                          <Tooltip
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: "#121212",
                                  border: "2px solid #1E1E1E",
                                  fontFamily: "Manrope",
                                },
                              },
                            }}
                            title={item.tokenName}
                          >
                            <Box className="TokenLogo">
                              <CustomIcon src={item.tokenImage} />
                            </Box>
                          </Tooltip>

                          <Box className="ArrowIcon">
                            <CustomIcon src={ARROW_RIGHT} />
                          </Box>
                        </Fragment>
                      ))}
                    {route && (
                      <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: "#121212",
                              border: "2px solid #1E1E1E",
                              fontFamily: "Manrope",
                            },
                          },
                        }}
                        title={route.destination.tokenName}
                      >
                        <Box className="TokenLogo">
                          <CustomIcon src={route.destination.tokenImage} />
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Box>
              {renderButtonState()}
            </Box>
          </Grow>
        )}
        {mobileDevice && (
          <Slide in={open} direction="up">
            <Box className="ReviewTransactionContainer">
              <Box className="HeadingWrapper">
                <Box className="HeadingContainer">
                  <Box
                    className="BackBtn"
                    onClick={() => {
                      setTimer(0);
                      handleClose();
                    }}
                  >
                    <FaArrowLeft />
                  </Box>
                  <Box className="HeadingText">
                    <GradientText text="Review Transaction" />
                  </Box>
                </Box>
                <Box className="TimerContainer">
                  <Box className="TimerIcon" onClick={handleManualRefetch}>
                    <MdOutlineRestartAlt />
                  </Box>
                  <span>{timer}s</span>
                </Box>
              </Box>
              <Box className="QuoteDetailsContainer">
                <DynamicOutputTokenContainer
                  logo={payToken?.tokenLogo ?? ETH_LOGO}
                  chainLogo={payToken?.chain.chainLogo ?? ETH_LOGO}
                  tokenName={payToken?.name ?? "Eddy"}
                  chainName={payToken?.chain.name ?? "Eddy"}
                  amount={tokenInAmount}
                  tokenDetails={payToken}
                  loading={loading}
                  error={error}
                  actionType="From"
                />
                <DynamicOutputTokenContainer
                  logo={getToken?.tokenLogo ?? ETH_LOGO}
                  chainLogo={getToken?.chain.chainLogo ?? ETH_LOGO}
                  tokenName={getToken?.name ?? "Eddy"}
                  chainName={getToken?.chain.name ?? "Eddy"}
                  amount={tokenOutAmount}
                  tokenDetails={getToken}
                  loading={loading}
                  error={error}
                  actionType="To"
                />
              </Box>
              <Box className="AmountsDetailsContainer">
                <Box className="AmountsTile">
                  <span className="AmountsLabel">Est. Received Amount</span>
                  <Box className="AmountValueContainer">
                    <span className="AmountValue">
                      {formatNumberWithDecimals(Number(tokenOutAmount))}
                    </span>
                    <Box className="TokenLogo">
                      <CustomIcon src={getToken?.tokenLogo ?? ETH_LOGO} />
                    </Box>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabel">Min. Received Amount</span>
                  <Box className="AmountValueContainer">
                    <span className="AmountValue">
                      {formatNumberWithDecimals(Number(minimumReceived))}
                    </span>
                    <Box className="TokenLogo">
                      <CustomIcon src={getToken?.tokenLogo ?? ETH_LOGO} />
                    </Box>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabel">Slippage</span>
                  <Box className="AmountValueContainer">
                    <span className="AmountValue">{slippageValue}</span>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabel">Gas Fees</span>
                  <Box className="AmountValueContainer">
                    <span className="AmountValue">
                      $
                      {returnValueCheck(
                        (
                          Number(srcChainGasFees) +
                          Number(destChainGasFees) +
                          Number(zetaChainGas)
                        ).toString()
                      )}
                    </span>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabel">Protocol Fee</span>
                  <Box className="AmountValueContainer">
                    <span className="AmountValue">
                      {formatNumberWithDecimals(
                        Number(useTransferStore.getState().tokenInAmount) *
                          (Number(useTransferStore.getState().protocolFees) /
                            100)
                      )}
                    </span>
                    <Box className="TokenLogo">
                      <CustomIcon src={payToken?.tokenLogo ?? ETH_LOGO} />
                    </Box>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabel">Est. time</span>
                  <Box className="AmountValueContainer">
                    <span className="AmountValue">
                      {Math.ceil(Number(estimatedTime) / 60)} mins
                    </span>
                  </Box>
                </Box>
                <Box className="AmountsTile">
                  <span className="AmountsLabel">Route</span>
                  <Box className="AmountValueContainer">
                    {route && (
                      <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: "#121212",
                              border: "2px solid #1E1E1E",
                              fontFamily: "Manrope",
                            },
                          },
                        }}
                        title={route.source.tokenName}
                      >
                        <Box className="TokenLogo">
                          <CustomIcon src={route.source.tokenImage} />
                        </Box>
                      </Tooltip>
                    )}
                    <Box className="ArrowIcon">
                      <CustomIcon src={ARROW_RIGHT} />
                    </Box>
                    {route &&
                      route.intermediates.map((item, index) => (
                        <Fragment key={`${index}${item.tokenName}`}>
                          <Tooltip
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: "#121212",
                                  border: "2px solid #1E1E1E",
                                  fontFamily: "Manrope",
                                },
                              },
                            }}
                            title={item.tokenName}
                          >
                            <Box className="TokenLogo">
                              <CustomIcon src={item.tokenImage} />
                            </Box>
                          </Tooltip>

                          <Box className="ArrowIcon">
                            <CustomIcon src={ARROW_RIGHT} />
                          </Box>
                        </Fragment>
                      ))}
                    {route && (
                      <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: "#121212",
                              border: "2px solid #1E1E1E",
                              fontFamily: "Manrope",
                            },
                          },
                        }}
                        title={route.destination.tokenName}
                      >
                        <Box className="TokenLogo">
                          <CustomIcon src={route.destination.tokenImage} />
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Box>
              {renderButtonState()}
            </Box>
          </Slide>
        )}
      </Box>
    </Modal>
  );
};
