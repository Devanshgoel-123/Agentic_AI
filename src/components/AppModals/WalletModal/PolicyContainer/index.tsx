"use client";
import React, { useEffect } from "react";
import "./styles.scss";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { PRIVACY_LINK, T_C_LINK } from "@/utils/constants";
import useWalletConnectStore from "@/store/wallet-store";
import { useShallow } from "zustand/react/shallow";

const PolicyContainer = () => {
  const { acceptedTandC, isBouncing } = useWalletConnectStore(
    useShallow((state) => ({
      acceptedTandC: state.acceptedTandC,
      isBouncing: state.isBouncing,
    }))
  );

  /**
   * Function to track checkbox actions.
   */
  const handleCheck = () => {
    useWalletConnectStore.getState().handleSetAccepted(!acceptedTandC);
  };

  /**
   * Function to open external links.
   * @param link Link to be opened.
   */
  const handleOpenLink = (link: string) => {
    window.open(link, "_blank");
  };

  /**
   * Store the checkbox action of user in local storage.
   */
  useEffect(() => {
    if (!acceptedTandC) {
      const privacy = localStorage.getItem("privacy-accepted-eddy");
      if (privacy) {
        useWalletConnectStore.getState().handleSetAccepted(true);
      }
    }
    if (acceptedTandC) {
      if (localStorage.getItem("privacy-accepted-eddy") === null) {
        localStorage.setItem("privacy-accepted-eddy", "true");
      }
    }
  }, [acceptedTandC]);

  return (
    <Box className="PolicyContainer">
      <Box className={isBouncing ? "CheckboxContainer" : ""}>
        <Checkbox
          checked={acceptedTandC}
          onChange={handleCheck}
          size="small"
          sx={{
            color: "#7bf179",
            padding: 0,
            "&.Mui-checked": {
              color: "#7bf179",
            },
          }}
        />
      </Box>
      <p className="PolicyText">
        By connecting your wallet to Eddy Finance dApp, you explicitly agree to
        our{" "}
        <span
          className="Green"
          onClick={() => {
            handleOpenLink(PRIVACY_LINK);
          }}
        >
          Privacy Policy
        </span>{" "}
        & 
        <span
          className="Green"
          onClick={() => {
            handleOpenLink(T_C_LINK);
          }}
        >
          Terms of Use
        </span>
      </p>
    </Box>
  );
};

export default PolicyContainer;
