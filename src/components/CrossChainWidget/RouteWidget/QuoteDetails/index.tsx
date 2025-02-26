import React from "react";
import "./styles.scss";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";

import useTransferStore from "@/store/transfer-store";
import useSlippageStore from "@/store/slippage-store";
import { useShallow } from "zustand/react/shallow";

import CustomIcon from "@/components/common/CustomIcon";
import { ARROW_DOWN, ETH_LOGO, INFO_ICON } from "@/utils/images";
import { formatNumberWithDecimals } from "@/utils/number";
import { ChainIds } from "@/utils/enums";
import { IoInformationCircleOutline } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";

interface Props {
  open: boolean;
  estimatedReceived: string;
  minReceived: string;
  protocolFees: number;
  handleOpen: () => void;
  handleClose: () => void;
}

export const QuoteDetails = ({
  open,
  estimatedReceived,
  minReceived,
  protocolFees,
  handleOpen,
  handleClose,
}: Props) => {
  const {
    payToken,
    getToken,
    srcChainGasFees,
    destChainGasFees,
    zetaChainGas,
    getChain,
    payChain,
  } = useTransferStore(
    useShallow((state) => ({
      payToken: state.payToken,
      getToken: state.getToken,
      srcChainGasFees: state.srcChainGasFees,
      destChainGasFees: state.destChainGasFees,
      zetaChainGas: state.zetaChainGas,
      getChain: state.getChain,
      payChain: state.payChain,
    }))
  );

  const { slippageValue } = useSlippageStore(
    useShallow((state) => ({
      slippageValue: state.slippageValue,
    }))
  );
  return (
    <Box className="QuoteDetailsContainer">
      <Box className="QuoteDetail">
        <span className="QuoteType">Est. Received Amount</span>
        <Box className="QuoteValue">
          <span className="QuoteValueText">
            {formatNumberWithDecimals(Number(estimatedReceived))}
          </span>
          <Box className="DestinationToken">
            <CustomIcon src={getToken?.tokenLogo ?? ETH_LOGO} />
          </Box>
        </Box>
      </Box>
      <Box className="QuoteDetail">
        <span className="QuoteType">Min. Received Amount</span>
        <Box className="QuoteValue">
          <span className="QuoteValueText">
            {formatNumberWithDecimals(Number(minReceived))}
          </span>
          <Box className="DestinationToken">
            <CustomIcon src={getToken?.tokenLogo ?? ETH_LOGO} />
          </Box>
        </Box>
      </Box>
      <Box className="QuoteDetail">
        <span className="QuoteType">Slippage</span>
        <Box className="QuoteValue">
          <span className="QuoteValueText">{slippageValue}%</span>
        </Box>
      </Box>
      <Box className="QuoteDetail">
        <span className="QuoteType">Fee Breakdown:</span>
        <Box className="QuoteValue">
          <Box
            className="DropdownIcon"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
            onClick={open ? handleClose : handleOpen}
          >
            <CustomIcon src={ARROW_DOWN} />
          </Box>
        </Box>
      </Box>
      {open && (
        <motion.div
          className="EddyFeeDetails"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Box className="FeeBreakDown">
            <Box className="FeeBreakDownContainer">
              <span className="FeeLabel">ZetaChain fees</span>
              <span className="FeeValue">
                ${formatNumberWithDecimals(Number(zetaChainGas))}
              </span>
            </Box>
            <Box className="FeeBreakDownContainer">
              <span className="FeeLabel">Source Chain Fees</span>
              <span className="FeeValue">
                ${formatNumberWithDecimals(Number(srcChainGasFees))}
              </span>
            </Box>
            <Box className="FeeBreakDownContainer">
              <span className="FeeLabel">Destination Chain Fees</span>
              <span className="FeeValue">
                ${formatNumberWithDecimals(Number(destChainGasFees))}
              </span>
            </Box>
            <Box className="FeeBreakDownContainer">
              <span className="FeeLabel">Protocol Fees</span>
              {protocolFees === 0 ? (
                <>
                  <Box className="ZeroFeeLabel">
                    <span className="FreeLabel">FREE</span>
                  </Box>
                </>
              ) : (
                <Box className="ZeroFeeLabel">
                  <span className="FeeValue">
                    {formatNumberWithDecimals(
                      Number(useTransferStore.getState().tokenInAmount) *
                        (Number(protocolFees) / 100)
                    )}{" "}
                    <Box className="SourceToken">
                      <CustomIcon src={payToken?.tokenLogo ?? ETH_LOGO} />
                    </Box>
                  </span>
                </Box>
              )}
            </Box>
            {payChain === ChainIds.SOLANA && (
              <Box className="FeeBreakDownContainer">
                <span className="FeeLabel">
                  Fees(Solana){" "}
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
                    title={
                      "Fixed additional protocol fee that is charged to compensate the Gateway PDA for the creation of a associated token account (ATA) on users' behalf."
                    }
                  >
                    <span className="InfoIcon">
                      <IoInformationCircleOutline />
                    </span>
                  </Tooltip>
                </span>
                <span className="FeeValue">
                  0.002
                  <Box className="SourceToken">
                    <CustomIcon
                      src={"http://asset.eddy.finance/tokens/sol.svg"}
                    />
                  </Box>
                </span>
              </Box>
            )}
          </Box>
        </motion.div>
      )}
      {/* {payChain !== getChain && (
        <Box className="GasDestinationContainer">
          <Checkbox
            checked={true}
            size="small"
            sx={{
              color: "#7bf179",
              padding: 0,
              "&.Mui-checked": {
                color: "#7bf179",
              },
            }}
          />
          <span>Gas on Destination</span>
          <Tooltip
            title="@Mrigank to give copy for this"
            placement="right-start"
          >
            <Box className="InfoIcon">
              <CustomIcon src={INFO_ICON} />
            </Box>
          </Tooltip>
        </Box>
      )} */}
    </Box>
  );
};
