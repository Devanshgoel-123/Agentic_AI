"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./styles.scss";
import dynamic from "next/dynamic";
import { TOAST_NAMES } from "@/utils/enums";
import Box from "@mui/material/Box";
import  useMediaQuery  from "@mui/material/useMediaQuery";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import useCustomModal from "@/hooks/common/useCustomModal";
import useTransferStore from "@/store/transfer-store";
import useFetchQuoteForTransaction from "@/hooks/Transfer/useFetchQuoteForTransaction";
import useSlippageStore from "@/store/slippage-store";
import useBTCWalletValidation from "@/hooks/Transfer/useBTCWalletValidation";
import { ChainIds } from "@/utils/enums";
import { DestinationAddressWidget } from "./DestinationAddressWidget";
import { IoSwapVertical } from "react-icons/io5";
import useFetchDeepLinkData from "@/hooks/Transfer/useFetchDeepLinkData";
import useWalletConnectStore from "@/store/wallet-store";
import { closeSnackbar,enqueueSnackbar } from "notistack";
import { CHAIN_IDS } from "@/utils/constants";

const DynamicGradientText = dynamic(
  () => import("../common/GradientText").then((mod) => mod.default),
  {
    ssr: false,
  }
);

const DynamicSlippageComponent = dynamic(
  () =>
    import("../common/SlippageComponent").then((mod) => mod.SlippageComponent),
  {
    ssr: false,
  }
);

const DynamicTokenInfoContainer = dynamic(
  () => import("./TokenInfoContainer").then((mod) => mod.TokenInfoContainer),
  {
    ssr: false,
    loading: () => <div className="DynamicPlaceholder"></div>,
  }
);

const DynamicButtonsContainer = dynamic(
  () => import("./ButtonsContainer").then((mod) => mod.ButtonsContainer),
  {
    ssr: false,
  }
);

const DynamicTransactionStatusModal = dynamic(
  () =>
    import("../AppModals/TransactionStatusModal").then(
      (mod) => mod.TransactionStatusModal
    ),
  {
    ssr: false,
  }
);

const DynamicBalanceLabel = dynamic(
  () => import("./BalanceLabel").then((mod) => mod.BalanceLabel),
  {
    ssr: false
  }
);

const DynamicRouteWidget = dynamic(
  () => import("./RouteWidget").then((mod) => mod.RouteWidget),
  {
    ssr: false,
  }
);

const DynamicReviewTransactionModal = dynamic(
  () =>
    import("../AppModals/ReviewTransactionModal").then(
      (mod) => mod.ReviewTransactionModal
    ),
  {
    ssr: false,
  }
);

const DynamicCampaignContainer = dynamic(
  () => import("./CampaginContainer").then((mod) => mod.CampaginContainer),
  {
    ssr: false,
  }
);

const NotificationPill = dynamic(() =>
  import("./NotificationPill").then((mod) => mod.NotificationPill)
);

export const CrossChainWidget = () => {
  const { address } = useAccount();
  const isXXLDevice=useMediaQuery("(min-width:1400px");
  const inputRef = useRef<HTMLInputElement>(null);
  const [stopPropagation, setStopPropagation] = useState<boolean>(false);
  const { loading: deepLinkLoading, error: deepLinkError } =
    useFetchDeepLinkData();
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  const showRewardsModal = useMediaQuery("(max-width: 800px)");
  const {
    loading: btcValidationLoading,
    error: btcValidationError,
    isValid,
  } = useBTCWalletValidation();

  const { btcWalletAddress, btcWalletId } = useWalletConnectStore(
    useShallow((state) => ({
      btcWalletAddress: state.btcWalletAddress,
      btcWalletId: state.btcWalletId,
    }))
  );
  
  const {
    open: openReviewTransactionModal,
    handleOpen: handleOpenReviewTransactionModal,
    handleClose: handleCloseReviewTransactionModal,
  } = useCustomModal();

  // useEffect(()=>{
  //   useTransferStore.getState().handleOldTransactions();
  // },[]);

  const {
    tokenInAmount,
    tokenOutAmount,
    payToken,
    getToken,
    payChain,
    getChain,
    payTokenBalance,
    openTransactionStatusModal,
  } = useTransferStore(
    useShallow((state) => ({
      tokenInAmount: state.tokenInAmount,
      tokenOutAmount: state.tokenOutAmount,
      payToken: state.payToken,
      getToken: state.getToken,
      payChain: state.payChain,
      getChain: state.getChain,
      payTokenBalance: state.payTokenBalance,
      openTransactionStatusModal: state.openTransactionStatusModal,
      activeTransactionArray: state.activeTransactionArray,
      openSideBar : state.activeSidebar
    }))
  );
  const { slippageValue } = useSlippageStore(
    useShallow((state) => ({
      slippageValue: state.slippageValue,
    }))
  );

  const { loading, error } = useFetchQuoteForTransaction({
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
      !payChain ||
      !payToken ||
      !getChain ||
      !getToken ||
      !Number(payToken?.id ?? 0) ||
      !Number(getToken?.id ?? 0) ||
      !slippageValue ||
      payChain===getChain && payChain===CHAIN_IDS.SOLANA
  });

  /**
   * Function to handle max balance input.
   * @returns void
   */
  const handleMaxBalance = () => {
    if (!address) return;
    if (!payToken) return;
    const event = new Event("change", { bubbles: true });
    const input = inputRef.current;
    if (input) {
      input.value = payTokenBalance;
      input.dispatchEvent(event);
      useTransferStore.getState().setTokenInAmount(payTokenBalance);
    }
  };

  const handleMainButtonClick = () => {
   
    handleOpenReviewTransactionModal();
  };

  /**
   * Swap button logic
   */
  const handleSwapButton = () => {
    setStopPropagation(() => true);
    if (payToken?.unsupported) return;
    const event = new Event("change", { bubbles: true });
    const input = inputRef.current;
    if (input) {
      input.value = tokenOutAmount;
      input.dispatchEvent(event);
    }
    useTransferStore.getState().handleSwapToken();
    setStopPropagation(() => false);
  }

  /**
   * Function to refresh widget state after success.
   */
  const handleRefreshTransferState = () => {
    const event = new Event("change", { bubbles: true });
    const input = inputRef.current;
    if (input) {
      input.value = "0.00";
      input.dispatchEvent(event);
    }
  };


  useEffect(()=>{
    if(Number(tokenOutAmount)>0 && !loading && !error && !isXXLDevice){
      closeSnackbar();
    }
  },[tokenOutAmount,loading,error,isXXLDevice])

  
  useEffect(()=>{
    if(address && !showRewardsModal){
      closeSnackbar();
      // enqueueSnackbar("", {
      //   //@ts-ignore
      //   variant: TOAST_NAMES.REWARDS_MODAL,
      //   persist: true,
      //   anchorOrigin: {
      //     vertical: "top",
      //     horizontal: "left",
      //   },
      // });
    }else{
      closeSnackbar();
    }
  },[address,showRewardsModal])

  return (
    <Box className="WidgetWrapper">
      <DynamicCampaignContainer />
      <Box className="CrossChainWidgetWrapper">
        <div className="WidgetSection">
          <Box className="CrossChainWidgetContainer">
            <div className="HeadingContainer">
              <div className="HeadingText">
              <DynamicGradientText text="Universal Swap" />
              </div>
              <DynamicSlippageComponent ctaText="Transfer" />
            </div>
            <Box className="TransferActionContainer">
              <Box className="TokenBalanceContainer">
                <DynamicTokenInfoContainer
                  label="From"
                  isInput={true}
                  chainId={payChain}
                  tokenDetails={payToken}
                  amount={tokenInAmount}
                  inputRef={inputRef}
                  isSkip={stopPropagation}
                  taskLoading={deepLinkLoading}
                />
                <DynamicBalanceLabel handleClick={handleMaxBalance} />
              </Box>
              <Box className="SwapLogo" onClick={handleSwapButton}>
                <IoSwapVertical />
              </Box>
              <Box className="TokenBalanceContainer">
                <DynamicTokenInfoContainer
                  label="To"
                  isInput={false}
                  chainId={getChain}
                  tokenDetails={getToken}
                  amount={tokenOutAmount}
                  loading={loading}
                  isSkip={stopPropagation}
                  taskLoading={deepLinkLoading}
                />
              </Box>
            </Box>
            {getChain === ChainIds.BITCOIN && !btcWalletAddress && (
              <DestinationAddressWidget isValid={isValid} />
            )}
            <DynamicButtonsContainer
              loadingState={loading || btcValidationLoading}
              errorState={error}
              handleMainButtonClick={handleMainButtonClick}
            />
          </Box>
          <NotificationPill loading={loading} error={error} />
        </div>
        {
        Number(tokenOutAmount) > 0 && !loading && !error && (
          <DynamicRouteWidget />
        )}
      </Box>

      <DynamicReviewTransactionModal
        open={openReviewTransactionModal}
        handleClose={handleCloseReviewTransactionModal}
        handleSetTransactionState={handleRefreshTransferState}
      />
      {payChain !== getChain && openTransactionStatusModal && (
        <DynamicTransactionStatusModal />
      )}
     {/* {!mobileDevice && <DynamicTransactionSideBar/>} */}

    </Box>
  );
};
