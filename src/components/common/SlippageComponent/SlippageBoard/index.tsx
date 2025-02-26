import React, { useState } from "react";
import "./styles.scss";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";

import useSlippageStore from "@/store/slippage-store";

import GradientText from "../../GradientText";
import Grow from "@mui/material/Grow"
import useMediaQuery from "@mui/material/useMediaQuery"
import  Modal  from "@mui/material/Modal";
import Slide from "@mui/material/Slide"
import { FaArrowLeft } from "react-icons/fa6";

interface Props {
  open: boolean;
  ctaText: string;
  handleCloseModal: () => void;
  disableAutomatic?: boolean;
}

const supportedSlippageValues = ["0.5", "1", "5"];

export const SlippageBoard = ({
  ctaText,
  disableAutomatic,
  open,
  handleCloseModal,
}: Props) => {
  const mobileDevice = useMediaQuery("(max-width: 600px)");

  const {
    slippageValue,
    handleClose,
    autoMaticSlippage,
    toggleAutoMaticSlippage,
    setSlippageValue,
  } = useSlippageStore();

  const [showCustomSlippage, setShowCustomSlippage] = useState<boolean>(true);

  /**
   * Function to toggle automatic slippage value.
   */
  const handleToggleAutomaticSlippage = () => {
    setSlippageValue("0.5");
    toggleAutoMaticSlippage();
  };

  /**
   * Function to handle manual input of slippage.
   * @param event
   */
  const handleChange = (event: any) => {
    setSlippageValue(event.target.value);
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        backdropFilter: "blur(5px)",
      }}
    >
      <div className="SlippageWrapper">
        {!mobileDevice && (
          <Grow in={open}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="SlippageContainer"
            >
              <Box className="SlippageHeadingContainer">
                <Box className="BackBtn" onClick={handleClose}>
                  <FaArrowLeft />
                </Box>
                <Box className="HeadingText">
                  <GradientText text="Settings" />
                </Box>
              </Box>
              {!disableAutomatic && (
                <Box className="SlippageDetails">
                  <Box className="DetailsContainer">
                    <span className="DetailText">
                      Automatic Slippage tolerance
                    </span>
                    <span className="DetailSubText">
                      Turn off automatic slippage tolerance to adjust the value
                    </span>
                  </Box>
                  <Box
                    className="ToggleSwitch"
                    onClick={handleToggleAutomaticSlippage}
                  >
                    <Box
                      style={{
                        transform: `translateX(${
                          autoMaticSlippage ? "100%" : "0"
                        })`,
                        background: autoMaticSlippage ? "white" : "#3d3d3d",
                      }}
                      className="SwitchCircle"
                    ></Box>
                  </Box>
                </Box>
              )}
              {!autoMaticSlippage && (
                <>
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
                            setSlippageValue(item);
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
                        onChange={handleChange}
                        placeholder={`${slippageValue.toString()}%`}
                        className="Slippage-Input"
                        type="text"
                      />
                      %
                    </Box>
                  )}
                </>
              )}

              <Box onClick={handleClose} className="SlippageCloseBtn">
                Back to {ctaText}
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
              className="SlippageContainer"
            >
              <Box className="SlippageHeadingContainer">
                <Box className="BackBtn" onClick={handleClose}>
                  <FaArrowLeft />
                </Box>
                <Box className="HeadingText">
                  <GradientText text="Settings" />
                </Box>
              </Box>
              {!disableAutomatic && (
                <Box className="SlippageDetails">
                  <Box className="DetailsContainer">
                    <span className="DetailText">
                      Automatic Slippage tolerance
                    </span>
                    <span className="DetailSubText">
                      Turn off automatic slippage tolerance to adjust the value
                    </span>
                  </Box>
                  <Box
                    className="ToggleSwitch"
                    onClick={handleToggleAutomaticSlippage}
                  >
                    <Box
                      style={{
                        transform: `translateX(${
                          autoMaticSlippage ? "100%" : "0"
                        })`,
                        background: autoMaticSlippage ? "white" : "#3d3d3d",
                      }}
                      className="SwitchCircle"
                    ></Box>
                  </Box>
                </Box>
              )}
              {!autoMaticSlippage && (
                <>
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
                            setSlippageValue(item);
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
                        onChange={handleChange}
                        placeholder={`${slippageValue.toString()}%`}
                        className="Slippage-Input"
                        type="text"
                      />
                      %
                    </Box>
                  )}
                </>
              )}

              <Box onClick={handleClose} className="SlippageCloseBtn">
                Back to {ctaText}
              </Box>
            </motion.div>
          </Slide>
        )}
      </div>
    </Modal>
  );
};
