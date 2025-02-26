import React from "react";
import "./styles.scss";
import { motion } from "framer-motion";

import Box from "@mui/material/Box";

import useWalletConnectStore from "@/store/wallet-store";

import { FaExclamationCircle } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";

interface Props {
  isValid: boolean | undefined;
}

export const DestinationAddressWidget = ({ isValid }: Props) => {
  const { handleSetDestinationAddress, destinationAddress } = useWalletConnectStore();

  /**
   * Function to paste destination address.
   * @param e Capture clipboard event.
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("text");
    handleSetDestinationAddress(pastedData);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // e.preventDefault();
  };
  return (
    <Box className="DestinationAddressContainer">
      <Box className="ContainerLabel">Destination Address</Box>
      <input
        value={destinationAddress ?? ""}
        placeholder="Enter your address here"
        className="DestinationAddress-Input"
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onChange={(e) => e.preventDefault()}
      />
      {typeof isValid !== "undefined" && (
        <div className="StatusContainer">
          {isValid ? (
            <motion.span
              transition={{ delay: 0.1 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="Status"
            >
              <SiTicktick />
            </motion.span>
          ) : (
            <motion.span
              transition={{ delay: 0.1 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ color: "#1e1e1e" }}
              className="Status"
            >
              <FaExclamationCircle />
            </motion.span>
          )}
        </div>
      )}
    </Box>
  );
};
