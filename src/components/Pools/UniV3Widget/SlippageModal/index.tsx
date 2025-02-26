import React, { useState } from "react";
import "./styles.scss";

import { useShallow } from "zustand/react/shallow";
import useUniV3Store from "@/store/univ3-store";

import { Box, Grow, Modal, Slide, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";

import CustomIcon from "@/components/common/CustomIcon";
import { ARROW_LEFT } from "@/utils/images";
import GradientText from "@/components/common/GradientText";
import { MODAL_STYLE } from "@/utils/constants";

const supportedSlippageValues = ["0.5", "1", "5"];

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const SlippageModal = ({ open, handleClose }: Props) => {
  const [showCustomSlippage, setShowCustomSlippage] = useState<boolean>(true);
  const mobileDevice = useMediaQuery("(max-width: 600px)");

  const { slippageValue } = useUniV3Store(
    useShallow((state) => ({
      slippageValue: state.slippageValue,
    }))
  );

  /**
   * Function to prevent adding faulty values.
   * @param e Input event.
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (!/^[0-9.]$/.test(key) && key !== "Backspace") {
      e.preventDefault();
    }
    if (key === "." && (slippageValue as string).includes(".")) {
      e.preventDefault();
    }
  };

  /**
   * Function to handle manual input of slippage.
   * @param event
   */
  const handleChange = (event: any) => {
    const inputValue = event.target.value;
    const sanitizedValue = inputValue.replace(/[^0-9.]/g, "");
    const dotCount = (sanitizedValue.match(/\./g) || []).length;
    if (dotCount > 1) {
      return;
    }
    useUniV3Store.getState().setSlippageValue(sanitizedValue);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={MODAL_STYLE}
    >
      <div className="SlippageModalWrapper">
        {!mobileDevice && (
          <Grow in={open}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="SlippageCurveContainer"
            >
              <Box className="SlippageHeadingContainer">
                <Box className="BackBtn" onClick={handleClose}>
                  <CustomIcon src={ARROW_LEFT} />
                </Box>
                <Box className="HeadingText">
                  <GradientText text="Settings" />
                </Box>
              </Box>
              <Box className="SlippageAutomaticInputContainer">
                <Box className="SlippageValueContainer">
                  <span className="SlippageText">Slippage tolerance</span>
                </Box>
                <hr />
                <Box className="SlippageButtonContainer">
                  {supportedSlippageValues.map((item, index) => (
                    <Box
                      key={index}
                      style={{
                        background:
                          slippageValue === item && !showCustomSlippage
                            ? "var(--border-color)"
                            : "transparent",
                        border:
                          slippageValue === item && !showCustomSlippage
                            ? "1px solid var(--app-green)"
                            : "1px solid var(--border-color)",
                      }}
                      className="SlippageButton"
                      onClick={() => {
                        useUniV3Store.getState().setSlippageValue(item);
                        setShowCustomSlippage(false);
                      }}
                    >
                      {item}%
                    </Box>
                  ))}
                </Box>
                <Box
                  style={{
                    background: showCustomSlippage
                      ? "var(--border-color)"
                      : "transparent",
                    border: showCustomSlippage
                      ? "1px solid var(--app-green)"
                      : "1px solid var(--border-color)",
                  }}
                  className="CustomSlippageButton"
                  onClick={() => {
                    setShowCustomSlippage((prev) => !prev);
                  }}
                >
                  Custom
                </Box>
              </Box>
              {showCustomSlippage && (
                <Box className="SlippageManualInputContainer">
                  <span className="ContainerLabel">Slippage Tolerance</span>
                  <input
                    onKeyDown={handleKeyPress}
                    onChange={handleChange}
                    placeholder={`${slippageValue.toString()}%`}
                    className="Slippage-Input"
                    type="text"
                  />
                  %
                </Box>
              )}

              <Box onClick={handleClose} className="SlippageCloseBtn">
                Go Back
              </Box>
            </motion.div>
          </Grow>
        )}

        {mobileDevice && (
          <Slide in={open} direction="up">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="SlippageCurveContainer"
            >
              <Box className="SlippageHeadingContainer">
                <Box className="BackBtn" onClick={handleClose}>
                  <CustomIcon src={ARROW_LEFT} />
                </Box>
                <Box className="HeadingText">
                  <GradientText text="Settings" />
                </Box>
              </Box>
              <Box className="SlippageAutomaticInputContainer">
                <Box className="SlippageValueContainer">
                  <span className="SlippageText">Slippage tolerance</span>
                </Box>
                <hr />
                <Box className="SlippageButtonContainer">
                  {supportedSlippageValues.map((item, index) => (
                    <Box
                      key={index}
                      style={{
                        background:
                          slippageValue === item && !showCustomSlippage
                            ? "var(--border-color)"
                            : "transparent",
                        border:
                          slippageValue === item && !showCustomSlippage
                            ? "1px solid var(--app-green)"
                            : "1px solid var(--border-color)",
                      }}
                      className="SlippageButton"
                      onClick={() => {
                        useUniV3Store.getState().setSlippageValue(item);
                        setShowCustomSlippage(false);
                      }}
                    >
                      {item}%
                    </Box>
                  ))}
                </Box>
                <Box
                  style={{
                    background: showCustomSlippage
                      ? "var(--border-color)"
                      : "transparent",
                    border: showCustomSlippage
                      ? "1px solid var(--app-green)"
                      : "1px solid var(--border-color)",
                  }}
                  className="CustomSlippageButton"
                  onClick={() => {
                    setShowCustomSlippage((prev) => !prev);
                  }}
                >
                  Custom
                </Box>
              </Box>
              {showCustomSlippage && (
                <Box className="SlippageManualInputContainer">
                  <span className="ContainerLabel">Slippage Tolerance</span>
                  <input
                    onKeyDown={handleKeyPress}
                    onChange={handleChange}
                    placeholder={`${slippageValue.toString()}%`}
                    className="Slippage-Input"
                    type="text"
                  />
                  %
                </Box>
              )}

              <Box onClick={handleClose} className="SlippageCloseBtn">
                Go Back
              </Box>
            </motion.div>
          </Slide>
        )}
      </div>
    </Modal>
  );
};
