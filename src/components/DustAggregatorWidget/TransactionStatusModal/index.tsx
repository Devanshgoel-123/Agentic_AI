import React, { act, useEffect, useState } from "react";
import "./styles.scss";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Grow from "@mui/material/Grow";

import { enqueueSnackbar, useSnackbar } from "notistack";
import useDustAggregatorStore from "@/store/dust-aggregator-store";
import useTrackCrossChain from "@/hooks/Transfer/useTrackCrossChain";
import { useShallow } from "zustand/react/shallow";

import { ModalHeading } from "@/components/common/ModalHeading";
import CustomIcon from "@/components/common/CustomIcon";
import {
  CHEVRON_LEFT,
  CROSS_RED,
  ETH_LOGO,
  OPEN_ICON,
  TICK_ICON,
  TIMER_LOGO,
  ZETA_LOGO,
} from "@/utils/images";
import GradientText from "@/components/common/GradientText";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { ChainIds, STATUS_CODES, TOAST_NAMES } from "@/utils/enums";
import { getExplorerLinkForHashAndChainId } from "@/utils/constants";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import { ChainStatus } from "@/store/types/transaction-type";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DiTokenLogo} from "@/components/Pools/PoolsWidget/PoolsTable/PoolRow/DiTokenLogo";
import { MultiTokenLogo } from "@/components/Pools/PoolsWidget/PoolsTable/PoolRow/MultiTokenLogo";


export const TransactionStatusModal = () => {
  const { closeSnackbar } = useSnackbar();
  const mobileDevice = useMediaQuery("(max-width: 600px)");
 
  const {
    activeTransaction,
    sourceChain,
    destinationChain,
    openTransactionStatusModal
  } = useDustAggregatorStore(
    useShallow((state) => ({
      activeTransaction:state.activeTransaction,
      sourceChain:state.sourceChain,
      destinationChain:state.destinationChain,
      openTransactionStatusModal:state.openTransactionStatusModalDust
    }))
  );
  const {
    sourceStatus,
    status,
    zetaChainStatus,
    destinationStatus,
    zetaChainHash,
    destinationChainHash,
  } = useTrackCrossChain({
    transactionHash: activeTransaction?.hash,
    payChain: useDustAggregatorStore.getState().sourceChain as number,
    getChain: useDustAggregatorStore.getState().destinationChain as number,
    allowFetch: openTransactionStatusModal,
    activeTransaction: activeTransaction,
  });

  const checkForTransactionFailure = () => {
    return (
      sourceStatus?.status === STATUS_CODES.FAILED ||
      zetaChainStatus?.status === STATUS_CODES.FAILED ||
      destinationStatus?.status === STATUS_CODES.FAILED ||
      status === STATUS_CODES.FAILED
    );
  };

  const returnHashFromType = (
    chainStatus: ChainStatus | null,
    type: string
  ) => {
    if (type === "sc") {
      return chainStatus?.sourceChainHash;
    } else if (type === "zc") {
      return chainStatus?.zetaChainHash;
    } else {
      return chainStatus?.destinationChainHash;
    }
  };

  /**
   * Use this function to fetch mobile status for any chain.
   * Return progress bar status and hash as per chain status.
   * @param chainStatus chain status object from socket connection.
   * @returns JSX as per chain status.
   */
  const returnChainProgressForMobile = (
    chainStatus: ChainStatus | null,
    type: string
  ) => {
    if (!chainStatus) {
      return;
    } else {
      if (checkForTransactionFailure()) {
        return (
          <>
            <Box className="MobileProgressContainer">
              <Box className="ProgressContainer">
                <Box
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(90deg, #FF4440 0%, #FF4440 87.2%, #FF7672 100%)",
                  }}
                  className="ProgressBar"
                ></Box>
              </Box>
              {returnHashFromType(chainStatus, type) && (
                <div
                  className="ViewTransactionBtn"
                  onClick={() => {
                    const url = getExplorerLinkForHashAndChainId(
                      type === "zc"
                        ? 7000
                        : (activeTransaction?.fromTokens[0].chain.chainId as number),
                      returnHashFromType(chainStatus, type) as string
                    );
                    window.open(url, "target:blank");
                  }}
                >
                  <Box className="OpenIcon">
                    <CustomIcon src={OPEN_ICON} />
                  </Box>
                </div>
              )}
            </Box>
          </>
        );
      }
      return (
        <>
          <Box className="MobileProgressContainer">
            <Box className="ProgressContainer">
              <Box
                style={{
                  width:
                    chainStatus.status === STATUS_CODES.SUCCESS
                      ? "100%"
                      : `${
                          (Number(chainStatus.blockConfirmations) /
                            Number(chainStatus.totalConfirmationBlocks)) *
                          100
                        }%`,
                }}
                className="ProgressBar"
              ></Box>
            </Box>
            {returnHashFromType(chainStatus, type) && (
              <div
                className="ViewTransactionBtn"
                onClick={() => {
                  const url = getExplorerLinkForHashAndChainId(
                    type === "zc"
                      ? 7000
                      : (activeTransaction?.fromTokens[0].chain.chainId as number),
                    returnHashFromType(chainStatus, type) as string,
                    type === "zc"
                  );
                  window.open(url, "target:blank");
                }}
              >
                <Box className="OpenIcon">
                  <CustomIcon src={OPEN_ICON} />
                </Box>
              </div>
            )}
          </Box>
        </>
      );
    }
  };

  /**
   * In case of destination chain logic is a bit different as we fetch status from {STATUS} object
   * instead of destinationChain object
   * TODO: Figure out a better way for this or start fetching block confirmations in destination chain as well.
   * Return progress bar status and hash as per chain status(case - destination chain).
   * @param chainStatus chain status object from socket connection.
   * @returns JSX as per chain status.
   */
  const returnDestinationChainProgressForMobile = () => {
    if (!destinationStatus) {
      return;
    } else {
      if (
        sourceStatus?.status === STATUS_CODES.FAILED ||
        zetaChainStatus?.status === STATUS_CODES.FAILED ||
        status === STATUS_CODES.FAILED
      ) {
        return (
          <>
            <Box className="MobileProgressContainer">
              <Box className="ProgressContainer">
                <Box
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(90deg, #FF4440 0%, #FF4440 87.2%, #FF7672 100%)",
                  }}
                  className="ProgressBar"
                ></Box>
              </Box>
              {destinationChainHash && (
                <div
                  className="ViewTransactionBtn"
                  onClick={() => {
                    const url = getExplorerLinkForHashAndChainId(
                      activeTransaction?.toToken.chain.chainId as number,
                      destinationChainHash as string
                    );
                    window.open(url, "target:blank");
                  }}
                >
                  <Box className="OpenIcon">
                    <CustomIcon src={OPEN_ICON} />
                  </Box>
                </div>
              )}
            </Box>
          </>
        );
      }
      return (
        <>
          <Box className="MobileProgressContainer">
            <Box className="ProgressContainer">
              <Box
                style={{
                  width: status === STATUS_CODES.SUCCESS ? "100%" : "50%",
                }}
                className="ProgressBar"
              ></Box>
            </Box>
            {destinationChainHash && (
              <div
                className="ViewTransactionBtn"
                onClick={() => {
                  const url = getExplorerLinkForHashAndChainId(
                    activeTransaction?.toToken.chain.chainId as number,
                    destinationChainHash as string
                  );
                  window.open(url, "target:blank");
                }}
              >
                <Box className="OpenIcon">
                  <CustomIcon src={OPEN_ICON} />
                </Box>
              </div>
            )}
          </Box>
        </>
      );
    }
  };

  /**
   * In case destination chain is zetachain again we fetch
   * status from STATUS object instead of zetachainStatus object.
   * TODO - Figure out a better way to do this.
   * Return progress bar status and hash as per chain status(case - destination chain).
   * @param chainStatus chain status object from socket connection.
   * @returns JSX as per chain status.
   */
  const returnDestinationZetaChainProgressForMobile = () => {
    if (!zetaChainStatus) {
      return;
    } else {
      if (
        sourceStatus?.status === STATUS_CODES.FAILED ||
        zetaChainStatus?.status === STATUS_CODES.FAILED ||
        destinationStatus?.status === STATUS_CODES.FAILED ||
        status === STATUS_CODES.FAILED
      ) {
        return (
          <>
            <Box className="MobileProgressContainer">
              <Box className="ProgressContainer">
                <Box
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(90deg, #FF4440 0%, #FF4440 87.2%, #FF7672 100%)",
                  }}
                  className="ProgressBar"
                ></Box>
              </Box>
              {zetaChainHash && (
                <div
                  className="ViewTransactionBtn"
                  onClick={() => {
                    const url = getExplorerLinkForHashAndChainId(
                      activeTransaction?.toToken.chain.chainId as number,
                      zetaChainHash as string
                    );
                    window.open(url, "target:blank");
                  }}
                >
                  <Box className="OpenIcon">
                    <CustomIcon src={OPEN_ICON} />
                  </Box>
                </div>
              )}
            </Box>
          </>
        );
      }
      return (
        <>
          <Box className="MobileProgressContainer">
            <Box className="ProgressContainer">
              <Box
                style={{
                  width: status === STATUS_CODES.SUCCESS ? "100%" : "50%",
                }}
                className="ProgressBar"
              ></Box>
            </Box>
            {zetaChainHash && (
              <div
                className="ViewTransactionBtn"
                onClick={() => {
                  const url = getExplorerLinkForHashAndChainId(
                    activeTransaction?.toToken.chain.chainId as number,
                    zetaChainHash as string
                  );
                  window.open(url, "target:blank");
                }}
              >
                <Box className="OpenIcon">
                  <CustomIcon src={OPEN_ICON} />
                </Box>
              </div>
            )}
          </Box>
        </>
      );
    }
  };

  /**
   * Use this function to fetch desktop status for any chain.
   * Return JSX status and hash as per chain status.
   * @param chainStatus chain status object from socket connection.
   * @returns JSX as per chain status.
   */
  const returnChainState = (chainStatus: ChainStatus | null, type: string) => {
    if (!chainStatus) {
      return (
        <span className="WaitingTextLabel">
          <CustomTextLoader text="Waiting for confirmation on Source Chain" />
        </span>
      );
    } else {
      if (checkForTransactionFailure()) {
        return (
          <>
            <Box className="BlockConfirmationsContainer">
              <Box className="BlockNumberContainer">
                <motion.div
                  transition={{ delay: 0.4 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ClockIcon"
                >
                  <CustomIcon src={CROSS_RED} />
                </motion.div>
                <span className="BlockNumber">
                  {chainStatus.blockConfirmations}/
                  {chainStatus.totalConfirmationBlocks}
                </span>
              </Box>
              <span className="BlockLabel">Block Confirmations</span>
              <Box className="ProgressContainer">
                <Box
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(90deg, #FF4440 0%, #FF4440 87.2%, #FF7672 100%)",
                  }}
                  className="ProgressBar"
                ></Box>
              </Box>
              {chainStatus.sourceChainHash && (
                <div
                  className="ViewTransactionBtn"
                  onClick={() => {
                    const url = getExplorerLinkForHashAndChainId(
                      type === "zc"
                        ? 7000
                        : (activeTransaction?.fromTokens[0].chain.chainId as number),
                      returnHashFromType(chainStatus, type) as string,
                      type === "zc"
                    );
                    window.open(url, "target:blank");
                  }}
                >
                  View transaction
                  <Box className="OpenIcon">
                    <CustomIcon src={OPEN_ICON} />
                  </Box>
                </div>
              )}
            </Box>
          </>
        );
      }
      return (
        <>
          <Box className="BlockConfirmationsContainer">
            <Box className="BlockNumberContainer">
              {chainStatus.status === STATUS_CODES.SUCCESS ? (
                <motion.div
                  transition={{ delay: 0.4 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ClockIcon"
                >
                  <CustomIcon src={TICK_ICON} />
                </motion.div>
              ) : (
                <motion.div
                  transition={{ delay: 0.4 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ClockIcon"
                >
                  <CustomIcon src={TIMER_LOGO} />
                </motion.div>
              )}
              <span className="BlockNumber">
                {chainStatus.blockConfirmations}/
                {chainStatus.totalConfirmationBlocks}
              </span>
            </Box>
            <span className="BlockLabel">Block Confirmations</span>
            <Box className="ProgressContainer">
              <Box
                style={{
                  width:
                    chainStatus.status === STATUS_CODES.SUCCESS
                      ? "100%"
                      : `${
                          (Number(chainStatus.blockConfirmations) /
                            Number(chainStatus.totalConfirmationBlocks)) *
                          100
                        }%`,
                }}
                className="ProgressBar"
              ></Box>
            </Box>
            {chainStatus.sourceChainHash && (
              <div
                className="ViewTransactionBtn"
                onClick={() => {
                  const url = getExplorerLinkForHashAndChainId(
                    type === "zc"
                      ? 7000
                      : (activeTransaction?.fromTokens[0].chain.chainId as number),
                    returnHashFromType(chainStatus, type) as string,
                    type === "zc"
                  );
                  window.open(url, "target:blank");
                }}
              >
                View transaction
                <Box className="OpenIcon">
                  <CustomIcon src={OPEN_ICON} />
                </Box>
              </div>
            )}
          </Box>
        </>
      );
    }
  };

  /**
   * Again in case of destination zetachain chain
   * fetch status from {status} object.
   * @returns
   */
  const returnDestinationZetachainStatus = () => {
    if (!zetaChainStatus) {
      return (
        <span className="WaitingTextLabel">
          <CustomTextLoader text="Waiting for confirmation on ZetaChain" />
        </span>
      );
    } else {
      if (
        sourceStatus?.status === STATUS_CODES.FAILED ||
        zetaChainStatus?.status === STATUS_CODES.FAILED ||
        destinationStatus?.status === STATUS_CODES.FAILED ||
        status === STATUS_CODES.FAILED
      ) {
        return (
          <>
            <Box className="BlockConfirmationsContainer">
              <Box className="BlockNumberContainer">
                <motion.div
                  transition={{ delay: 0.4 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ClockIcon"
                >
                  <CustomIcon src={CROSS_RED} />
                </motion.div>
                <span className="BlockNumber">Failed</span>
              </Box>
              <span className="BlockLabel">Block Confirmations</span>
              <Box className="ProgressContainer">
                <Box
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(90deg, #FF4440 0%, #FF4440 87.2%, #FF7672 100%)",
                  }}
                  className="ProgressBar"
                ></Box>
              </Box>
              {zetaChainHash && (
                <div
                  className="ViewTransactionBtn"
                  onClick={() => {
                    const url = getExplorerLinkForHashAndChainId(
                      ChainIds.ZETACHAIN,
                      zetaChainHash as string
                    );
                    window.open(url, "target:blank");
                  }}
                >
                  View transaction
                  <Box className="OpenIcon">
                    <CustomIcon src={OPEN_ICON} />
                  </Box>
                </div>
              )}
            </Box>
          </>
        );
      }
      return (
        <>
          <Box className="BlockConfirmationsContainer">
            <Box className="BlockNumberContainer">
              {status === STATUS_CODES.SUCCESS && (
                <>
                  <motion.div
                    transition={{ delay: 0.4 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ClockIcon"
                  >
                    <CustomIcon src={TICK_ICON} />
                  </motion.div>
                  <span className="BlockNumber">
                    {zetaChainStatus.totalConfirmationBlocks}/
                    {zetaChainStatus.totalConfirmationBlocks}
                  </span>
                </>
              )}
            </Box>
            {status === STATUS_CODES.SUCCESS ? (
              <>
                <span className="BlockLabel">Block Confirmations</span>
                <Box className="ProgressContainer">
                  <Box
                    style={{
                      width: "100%",
                    }}
                    className="ProgressBar"
                  ></Box>
                </Box>
              </>
            ) : (
              <>
                <CustomSpinner size="20" color="#909090" />
              </>
            )}

            {zetaChainHash && (
              <div
                className="ViewTransactionBtn"
                onClick={() => {
                  const url = getExplorerLinkForHashAndChainId(
                    ChainIds.ZETACHAIN,
                    zetaChainHash as string
                  );
                  window.open(url, "target:blank");
                }}
              >
                View transaction
                <Box className="OpenIcon">
                  <CustomIcon src={OPEN_ICON} />
                </Box>
              </div>
            )}
          </Box>
        </>
      );
    }
  };

  const returnDestinationChainStatus = () => {
    if (!destinationStatus) {
      return (
        <span className="WaitingTextLabel">
          <CustomTextLoader text="Waiting for confirmation on destination Chain" />
        </span>
      );
    } else {
      if (
        sourceStatus?.status === STATUS_CODES.FAILED ||
        zetaChainStatus?.status === STATUS_CODES.FAILED ||
        status === STATUS_CODES.FAILED
      ) {
        return (
          <>
            <Box className="BlockConfirmationsContainer">
              <Box className="BlockNumberContainer">
                <motion.div
                  transition={{ delay: 0.4 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ClockIcon"
                >
                  <CustomIcon src={CROSS_RED} />
                </motion.div>
                <span className="BlockNumber">Failed</span>
              </Box>
              <span className="BlockLabel">Block Confirmations</span>
              <Box className="ProgressContainer">
                <Box
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(90deg, #FF4440 0%, #FF4440 87.2%, #FF7672 100%)",
                  }}
                  className="ProgressBar"
                ></Box>
              </Box>
              {destinationChainHash && (
                <div
                  className="ViewTransactionBtn"
                  onClick={() => {
                    const url = getExplorerLinkForHashAndChainId(
                      activeTransaction?.toToken.chain.chainId as number,
                      destinationChainHash as string
                    );
                    window.open(url, "target:blank");
                  }}
                >
                  View transaction
                  <Box className="OpenIcon">
                    <CustomIcon src={OPEN_ICON} />
                  </Box>
                </div>
              )}
            </Box>
          </>
        );
      }
      return (
        <>
          <Box className="BlockConfirmationsContainer">
            {destinationStatus.status === STATUS_CODES.PENDING &&
            status !== STATUS_CODES.SUCCESS ? (
              <>
                <CustomSpinner size="20" color="#909090" />
              </>
            ) : (
              <>
                <Box className="BlockNumberContainer">
                  {status === STATUS_CODES.SUCCESS ? (
                    <motion.div
                      transition={{ delay: 0.4 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ClockIcon"
                    >
                      <CustomIcon src={TICK_ICON} />
                    </motion.div>
                  ) : (
                    <motion.div
                      transition={{ delay: 0.4 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ClockIcon"
                    >
                      <CustomIcon src={TIMER_LOGO} />
                    </motion.div>
                  )}
                  <span className="BlockNumber">
                    {destinationStatus.totalConfirmationBlocks}/
                    {destinationStatus.totalConfirmationBlocks}
                  </span>
                </Box>
                <span className="BlockLabel">Block Confirmations</span>
                <Box className="ProgressContainer">
                  <Box
                    style={{
                      width: status === STATUS_CODES.SUCCESS ? "100%" : "50%",
                    }}
                    className="ProgressBar"
                  ></Box>
                </Box>
                {destinationChainHash && (
                  <div
                    className="ViewTransactionBtn"
                    onClick={() => {
                      const url = getExplorerLinkForHashAndChainId(
                        activeTransaction?.toToken.chain.chainId as number,
                        destinationChainHash as string
                      );
                      window.open(url, "target:blank");
                    }}
                  >
                    View transaction
                    <Box className="OpenIcon">
                      <CustomIcon src={OPEN_ICON} />
                    </Box>
                  </div>
                )}
              </>
            )}
          </Box>
        </>
      );
    }
  };

  /**
   * Function to call once transaction is completed. Failed or Success.
   * If completed close the modal
   * else close modal and open notification.
   */
  const handleOpenTransactionNotification = () => {
    if (
      status === STATUS_CODES.SUCCESS ||
      sourceStatus?.status === STATUS_CODES.FAILED ||
      zetaChainStatus?.status === STATUS_CODES.FAILED ||
      destinationStatus?.status === STATUS_CODES.FAILED ||
      status === STATUS_CODES.FAILED
    ) {
      useDustAggregatorStore.getState().handleCloseTransactionStatusModalDust();
    } else {
      closeSnackbar();
      useDustAggregatorStore.getState().handleCloseTransactionStatusModalDust();
      enqueueSnackbar("", {
        //@ts-ignore
        variant: TOAST_NAMES.TXN_NOTIFICATION_DUST,
        persist: true,
        sourceTokens:activeTransaction?.fromTokens,
        toToken: activeTransaction?.toToken,
        hash: activeTransaction?.hash,
        createdAt:activeTransaction?.createdAt,
        sourceChain:activeTransaction?.fromTokens[0].chain.chainId,
        destinationChain:activeTransaction?.toToken.chain.chainId,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      
    }
  };

  return (
    <Modal
      open={openTransactionStatusModal}
      onClose={handleOpenTransactionNotification}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0,0,0,0.9)",
        },
      }}
    >
      <Box className="TransactionStatusModalWrapper">
        {activeTransaction && (
          <Grow in={openTransactionStatusModal}>
            <Box className="TransactionStatusModalContainer">
              <ModalHeading
                heading="Transaction Details"
                handleClick={handleOpenTransactionNotification}
              />
              <Box className="ChainStatusContainer">
                <Box className="ChainStatusDetails">
                  <Box className="ArrowIcon">
                    <CustomIcon src={CHEVRON_LEFT} />
                  </Box>
                  <Box className="ChainDetails">
                    <Box className="">
                      {(() => {
                      const tokenLogos =activeTransaction.fromTokens.map((item) => item.tokenLogo);
                        switch (activeTransaction.fromTokens.length) {
                          case 1:
                            return <div className="TokenLogo">
                              <CustomIcon src={tokenLogos[0] as string} />
                              </div>
                          case 2:
                            return <DiTokenLogo tokenLogos={tokenLogos} />
                          case 3:
                            return <div className="sourceTokenTrackingContainerTri">
                            <div className="topContainer">
                              {activeTransaction.fromTokens.slice(0,2).map((item)=>{
                                  return <div className="topContainerImage" key={item.address}>
                                  <CustomIcon src={item.tokenLogo} key={item.address}/>
                                  </div>
                        })}
                              </div>
                            
                            <div className="TokenLogoTri">
                              <CustomIcon src={tokenLogos[2] as string} />
                              </div>    
                            </div>
                          case 4:
                            return <div className="sourceTokenTrackingContainerQuad">
                              <div className="topContainer">
                              {activeTransaction.fromTokens.slice(0,2).map((item)=>{
                                  return <div className="topContainerImage" key={item.address}>
                                  <CustomIcon src={item.tokenLogo} key={item.address}/>
                                  </div>
                        })}
                              </div>
                            <div className="statusModalTokenText">
                            <div className="TokenLogoQuad">
                              <CustomIcon src={tokenLogos[2] as string} />
                              </div>
                          {activeTransaction.fromTokens.length>3 && <div className="TokenText" >
                          +{activeTransaction.fromTokens.length-3}
                          </div>}
                            </div>
                            
                            </div>
                          default:
                            return null;
                        }
                      })()}
                    </Box>
                    <Box className="ChainName">
                      <GradientText
                        text={
                          activeTransaction?.fromTokens[0]?.chain.name ??
                          "ZetaChain"
                        }
                      />
                    </Box>
                  </Box>
                  <hr />
                  <Box className="BlockConfirmationsWrapper">
                    {returnChainState(sourceStatus, "sc")}
                  </Box>
                  {returnChainProgressForMobile(sourceStatus, "sc")}
                </Box>
                {Number(activeTransaction?.fromTokens[0].chain.chainId) !==
                  ChainIds.ZETACHAIN && (
                  <Box className="ChainStatusDetails">
                    {Number(activeTransaction?.toToken.chain.chainId) !==
                      ChainIds.ZETACHAIN && (
                      <Box className="ArrowIcon">
                        <CustomIcon src={CHEVRON_LEFT} />
                      </Box>
                    )}
                    <Box className="ChainDetails">
                      <Box className="TokenLogo">
                        <CustomIcon src={ZETA_LOGO} />
                      </Box>
                      <Box className="ChainName">
                        <GradientText text="ZetaChain" />
                      </Box>
                    </Box>
                    <hr />
                    <Box className="BlockConfirmationsWrapper">
                      {Number(activeTransaction?.toToken.chain.chainId) ===
                      ChainIds.ZETACHAIN
                        ? returnDestinationZetachainStatus()
                        : returnChainState(zetaChainStatus, "zc")}
                    </Box>
                    {Number(activeTransaction?.toToken.chain.chainId) ===
                    ChainIds.ZETACHAIN
                      ? returnDestinationZetaChainProgressForMobile()
                      : returnChainProgressForMobile(zetaChainStatus, "zc")}
                  </Box>
                )}
                {Number(activeTransaction?.toToken.chain.chainId) !==
                  ChainIds.ZETACHAIN && (
                  <Box className="ChainStatusDetails">
                    <Box className="ChainDetails">
                      <Box className="TokenLogo">
                        <CustomIcon
                          src={
                            activeTransaction?.toToken?.tokenLogo ?? ETH_LOGO
                          }
                        />
                        <Box className="ChainLogo">
                          <CustomIcon
                            src={
                              activeTransaction?.toToken?.chain.chainLogo ??
                              ETH_LOGO
                            }
                          />
                        </Box>
                      </Box>
                      <Box className="ChainName">
                        <GradientText
                          text={
                            activeTransaction?.toToken?.chain.name ??
                            "ZetaChain"
                          }
                        />
                      </Box>
                    </Box>
                    <hr />
                    <Box className="BlockConfirmationsWrapper">
                      {returnDestinationChainStatus()}
                    </Box>
                    {returnDestinationChainProgressForMobile()}
                  </Box>
                )}{" "}
              </Box>
              <Box
                className="TransactionStatusActionBtn"
                onClick={handleOpenTransactionNotification}
              >
                Got it
              </Box>
            </Box>
          </Grow>
        )}

      </Box>
    </Modal>
  );
};
