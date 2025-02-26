import React from "react";
import "./styles.scss";

import Box from "@mui/material/Box";

interface Props {
  currentType: string;
  handleChangeType: (type: "all" | "btc" | "evm" | "svm") => void;
}

const WalletSelector = ({ currentType, handleChangeType }: Props) => {
  return (
    <Box className="WalletSelectorContainer">
      <Box
        className={
          currentType === "all" ? "WalletSelector-Selected" : "WalletSelector"
        }
        onClick={() => {
          handleChangeType("all");
        }}
      >
        All
        {currentType === "all" && <Box className="SelectedLine"></Box>}
      </Box>
      <Box
        className={
          currentType === "evm" ? "WalletSelector-Selected" : "WalletSelector"
        }
        onClick={() => {
          handleChangeType("evm");
        }}
      >
        EVM
        {currentType === "evm" && <Box className="SelectedLine"></Box>}
      </Box>
      <Box
        className={
          currentType === "btc" ? "WalletSelector-Selected" : "WalletSelector"
        }
        onClick={() => {
          handleChangeType("btc");
        }}
      >
        Bitcoin
        {currentType === "btc" && <Box className="SelectedLine"></Box>}
      </Box>
      <Box
        className={
          currentType === "svm" ? "WalletSelector-Selected" : "WalletSelector"
        }
        onClick={() => {
          handleChangeType("svm");
        }}
      >
        Solana
        {currentType === "svm" && <Box className="SelectedLine"></Box>}
      </Box>
    </Box>
  );
};

export default WalletSelector;
