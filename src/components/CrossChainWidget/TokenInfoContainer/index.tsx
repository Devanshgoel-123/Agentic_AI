"use client";
import React, { LegacyRef, useEffect, useState } from "react";
import "./styles.scss";
import dynamic from "next/dynamic";

import Box from "@mui/material/Box";
import { motion } from "framer-motion";

import { useSearchParams } from "next/navigation";
import useCustomModal from "@/hooks/common/useCustomModal";
import useFetchDefaultTokens from "@/hooks/Transfer/useFetchDefaultTokens";
import useTransferStore from "@/store/transfer-store";
import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";

import CustomIcon from "@/components/common/CustomIcon";
import { ARROW_DOWN } from "@/utils/images";
import { CustomCircleLoader } from "@/components/common/CustomCircleLoader";
import { Token } from "@/store/types/token-type";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import mixpanel from "mixpanel-browser";
import { closeSnackbar } from "notistack";

const DynamicTokenModal = dynamic(
  () =>
    import("@/components/AppModals/TokenModal").then((mod) => mod.TokenModal),
  {
    ssr: false,
  }
);

interface Props {
  isSkip: boolean;
  label: string;
  isInput: boolean;
  chainId: number;
  tokenDetails: Token | undefined;
  amount: string;
  inputRef?: LegacyRef<HTMLInputElement> | undefined;
  loading?: boolean;
  taskLoading?: boolean;
}

export const TokenInfoContainer = ({
  isSkip,
  label,
  isInput,
  tokenDetails,
  chainId,
  amount,
  inputRef,
  taskLoading,
}: Props) => {
  const searchParams = useSearchParams();
  const [value, setValue] = useState<string>("");

  const { loading, error, getDefaultTokens } = useFetchDefaultTokens({
    chainId: chainId,
    actionType: label,
    isSkip: isSkip,
  });

  useEffect(() => {
    /**
     * Skip default token fetch is search params are valid.
     */
    if (
      !(
        Number(searchParams.get("sourcechain")) &&
        searchParams.get("sourcetoken") &&
        Number(searchParams.get("destinationchain")) &&
        searchParams.get("destinationtoken")
      )
    ) {
      getDefaultTokens(chainId);
    }
    
  }, []);

  const {
    loading: dollarValueLoading,
    error: dollarValueError,
    data: dollarValue,
  } = useFetchTokenDollarValue({
    tokenId: Number(tokenDetails?.id),
    tokenAmount: amount,
  });

  const {
    open: openTokenModal,
    handleOpen: handleOpenTokenModal,
    handleClose: handleCloseTokenModal,
  } = useCustomModal();

  // Debounce logic
  useEffect(() => {
    const handleUpdateTokenInput = () => {
      useTransferStore.getState().setTokenInAmount(value);
    };
    const handler = setTimeout(() => {
      handleUpdateTokenInput();
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  /**
   * Function to open token modal and also check for loading states.
   * @returns void
   */
  const handleOpenTokenDetailsModal = () => {
    if (loading || !tokenDetails) return;
    
    handleOpenTokenModal();
    closeSnackbar();
  };


  useEffect(()=>{
    if(tokenDetails!==undefined){
      label==='From' ?
      mixpanel.track("widget_from_select",{
        chain:`${tokenDetails?.chain.name}`
      }) :
      mixpanel.track("widget_to_select",{
        chain:`${tokenDetails?.chain.name}`
      })
    }
  },[])


  /**
   * Function to prevent adding faulty values.
   * @param e Input event.
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (
      !/^[0-9.]$/.test(key) &&
      key !== "Backspace" &&
      !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)
    ) {
      e.preventDefault();
    }
    if (key === "." && value.includes(".")) {
      e.preventDefault();
    }
  };

  /**
   * Function to store user input.
   * @param e Input event.
   * @returns
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const sanitizedValue = inputValue.replace(/[^0-9.]/g, "");
    const dotCount = (sanitizedValue.match(/\./g) || []).length;
    if (dotCount > 1) {
      return;
    }
    setValue(sanitizedValue);
  };

  /**
   * Render dollar value as per loading state.
   * @returns Dollar value component
   */
  const returnDollarValueOfAmount = () => {
    if (dollarValueLoading) {
      return (
        <span className="DollarValue">
          <CustomTextLoader text="$0.00" />
        </span>
      );
    } else {
      return (
        <span className="DollarValue">
          $
          {Number(amount) === 0
            ? 0
            : (Number(amount) * Number(dollarValue)).toFixed(7)}
        </span>
      );
    }
  };

  return (
    <Box className="TokenInfoWrapper">
      <Box className="TokenInputContainer">
        {isInput ? (
          <input
            ref={inputRef}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="0.00"
            className="Token-Input"
          />
        ) : (
          <Box className="Token-Output">
            {loading ? <CustomTextLoader text={amount} /> : amount}
          </Box>
        )}
        {returnDollarValueOfAmount()}
      </Box>
      <Box className="TokenInfoContainer" onClick={handleOpenTokenDetailsModal}>
        {loading || !tokenDetails || taskLoading ? (
          <Box className="LogoContainer">
            <CustomCircleLoader />
          </Box>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="TokenLogo"
            >
              <CustomIcon src={tokenDetails.tokenLogo} />
              <motion.div
                transition={{ delay: 0.2 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ChainLogo"
              >
                <CustomIcon src={tokenDetails.chain.chainLogo} />
              </motion.div>
            </motion.div>
            <Box className="TokenDetailsContainer">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="TokenName"
              >
                {tokenDetails.name}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ChainName"
              >
                {tokenDetails.chain.name}
              </motion.div>
            </Box>
            <Box className="DropdownIcon">
              <CustomIcon src={ARROW_DOWN} />
            </Box>
          </>
        )}
      </Box>
      <Box className="ContainerLabel">{label}</Box>
      <DynamicTokenModal
        open={openTokenModal}
        actionType={label}
        handleClose={handleCloseTokenModal}
        getDefaultTokens={getDefaultTokens}
      />
    </Box>
  );
};
