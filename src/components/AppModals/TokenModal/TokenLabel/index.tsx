import React, { useState } from "react";
import "./styles.scss";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";

import { useAccount } from "wagmi";
import useFetchTokenBalance from "@/hooks/Transfer/useFetchTokenBalance";

import CustomIcon from "@/components/common/CustomIcon";
import { Token } from "@/store/types/token-type";
import {
  convertBigIntToUIFormat,
  formattedValueToDecimals,
} from "@/utils/number";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { MdError } from "react-icons/md";
import useWalletConnectStore from "@/store/wallet-store";
import { ChainIds } from "@/utils/enums";
import { useShallow } from "zustand/react/shallow";
import mixpanel from "mixpanel-browser";
import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";
import { useWallet } from "@solana/wallet-adapter-react";
import useTransferStore from "@/store/transfer-store";

interface Props {
  id: number;
  isBridge: boolean;
  isNative: boolean;
  isDefault: boolean;
  isStable: boolean;
  address: string;
  zrc20Address: string;
  name: string;
  chain: {
    chainId: number;
    chainLogo: string;
    name: string;
  };
  decimal: number;
  tokenLogo: string;
  pythId: string;
  curveIndex: number;
  unsupported: boolean;
  isUniV3Supported: boolean;
  setToken: (token: Token) => void;
  handleClose: () => void;
  balance?: string | undefined;
  setterFunction?: (token: Token, balance: string) => void;
  usdValue?: string | undefined;
  shimmer: boolean;
  actionType: string;
}

export const TokenLabel = ({
  id,
  isBridge,
  isNative,
  isDefault,
  isStable,
  address,
  zrc20Address,
  name,
  chain,
  decimal,
  tokenLogo,
  pythId,
  curveIndex,
  unsupported,
  isUniV3Supported,
  setToken,
  handleClose,
  balance,
  setterFunction,
  shimmer,
  usdValue,
  actionType,
}: Props) => {
  const { address: walletAddress } = useAccount();
  const [removeFromDisplay, setRemoveFromDisplay] = useState<boolean>(false);
  const { btcWalletAddress } = useWalletConnectStore(
    useShallow((state) => ({
      btcWalletAddress: state.btcWalletAddress,
    }))
  );
  const { publicKey } = useWallet();
  const {
    payChain,
    getChain
  }=useTransferStore(useShallow((state)=>({
    payChain:state.payChain,
    getChain:state.getChain
  })))
  /**
   * !Important
   * Remove the current token item from DOM
   * Once balance fetch is successful.
   */
  const handleSetterCallback = () => {
    setRemoveFromDisplay(true);
  };
  
  const { loading, error, data } = useFetchTokenBalance({
    walletAddress,
    tokenDetails: {
      id,
      isBridge,
      isDefault,
      isNative,
      isStable,
      address,
      zrc20Address,
      name,
      chain,
      decimal,
      tokenLogo,
      pythId,
      curveIndex,
      unsupported,
      isUniV3Supported,
    },
    balance,
    setterFunction: setterFunction,
  });

  /**
   * Setter function to store tokens in state.
   */
  const handleSetToken = () => {
    setToken({
      id,
      isBridge,
      isNative,
      isDefault,
      isStable,
      address,
      zrc20Address,
      name,
      chain,
      decimal,
      tokenLogo,
      pythId,
      curveIndex,
      unsupported,
      isUniV3Supported,
    });
    handleClose();
    actionType == "From"
      ? mixpanel.track("from_token_click", {
          chain_name: `${name}`,
        })
      : mixpanel.track("to_token_click", {
          chain_name: `${name}`,
        });
  };

  const returnTokenDetails = () => {
    if (
      (!walletAddress &&
        Number(chain.chainId) !== ChainIds.BITCOIN &&
        Number(chain.chainId) !== ChainIds.SOLANA) ||
      (Number(chain.chainId) === ChainIds.BITCOIN && !btcWalletAddress) ||
      (Number(chain.chainId) === ChainIds.SOLANA && !publicKey)
    ) {
      return <></>;
    } else if (loading || !data || shimmer) {
      return (
        <>
          <span className="BalanceText">
            <CustomTextLoader text="0.00" />
          </span>
          <span className="DollarValue">$0.0000</span>
        </>
      );
    } else if (error) {
      return (
        <>
          <span className="BalanceText">
            <MdError />
          </span>
          <span className="DollarValue">$0.0000</span>
        </>
      );
    } else {
      return (
        <>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="BalanceText"
          >
            {formattedValueToDecimals(
              convertBigIntToUIFormat(
                balance !== undefined ? balance : data.balance,
                Number(decimal)
              ).toString(),
              8
            )}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="DollarValue"
          >
            ${usdValue}
          </motion.span>
        </>
      );
    }
  };

  return (
    <>
      {!removeFromDisplay && (
        <Box className="TokenLabel" onClick={handleSetToken}>
          <Box className="TokenDetails">
            <Box className="TokenLogo">
              <CustomIcon src={tokenLogo} />
            </Box>
            <Box className="TokenNameContainer">
              <span className="TokenName">{name}</span>
              <span className="ChainName">{chain.name}</span>
            </Box>
          </Box>
          <Box className="TokenBalanceContainer">{returnTokenDetails()}</Box>
        </Box>
      )}
    </>
  );
};
