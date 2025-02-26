import React from "react";
import "./styles.scss";
import Box from "@mui/material/Box";

import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";

import CustomIcon from "@/components/common/CustomIcon";
import { CustomCircleLoader } from "@/components/common/CustomCircleLoader";
import { formattedValueToDecimals } from "@/utils/number";
import { Token } from "@/store/types/token-type";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { MdError } from "react-icons/md";

interface Props {
  logo: string;
  chainLogo: string;
  tokenName: string;
  chainName: string;
  actionType: string;
  amount: string;
  tokenDetails: Token | undefined;
  loading: boolean;
  error: any;
}

export const QuoteTokensContainer = ({
  logo,
  chainLogo,
  tokenName,
  chainName,
  amount,
  loading,
  actionType,
  tokenDetails,
  error,
}: Props) => {
  const {
    loading: dollarValueLoading,
    error: dollarValueError,
    data: dollarValue,
  } = useFetchTokenDollarValue({
    tokenId: Number(tokenDetails?.id),
    tokenAmount: amount,
  });

  /**
   * Render dollar value as per loading state.
   * @returns Dollar value component
   */
  const returnDollarValueOfAmount = () => {
    if (dollarValueLoading) {
      return (
        <span className="TokenDollarValue">
          <CustomTextLoader text="$0.00" />
        </span>
      );
    } else if (dollarValueError) {
      return (
        <span className="TokenDollarValue">
          <MdError />
        </span>
      );
    } else {
      return (
        <span className="TokenDollarValue">
          ${(Number(amount) * Number(dollarValue)).toFixed(2)}
        </span>
      );
    }
  };

  return (
    <Box className="QuoteTokenDetails">
      <Box className="QuoteLabel">{actionType}</Box>
      <Box className="QuoteDetails">
        <span className="TokenQuote">
          {formattedValueToDecimals(amount, 81)}
        </span>
        {returnDollarValueOfAmount()}
      </Box>
      <Box className="TokenDetails">
        <Box className="TokenLogo">
          {loading || error ? (
            <>
              <CustomCircleLoader />
            </>
          ) : (
            <>
              <CustomIcon src={logo} />
              <Box className="ChainLogo">
                <CustomIcon src={chainLogo} />
              </Box>
            </>
          )}
        </Box>
        {!error && (
          <Box className="TokenTextDetails">
            <Box className="TokenName">{tokenName}</Box>
            <Box className="ChainName">{chainName}</Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
