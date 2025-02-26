import { forwardRef, useCallback } from "react";
import "./styles.scss";

import Box from "@mui/material/Box";
import { SnackbarContent, CustomContentProps, useSnackbar } from "notistack";

import CustomIcon from "../CustomIcon";
import { CROSS_ICON, OPEN_ICON } from "@/utils/images";
import { TOAST_TYPE } from "@/utils/enums";
import { getExplorerLinkForHashAndChainId } from "@/utils/constants";

interface CustomToastsProps extends CustomContentProps {
  type: string;
  subHeading: string;
  hash?: string;
  chain?: number;
}

const CustomToast = forwardRef<HTMLDivElement, CustomToastsProps>(
  ({ id, ...props }, ref) => {
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id]);

    /**
     * Function to return shadow color as per toast type.
     * @returns Drop shadow color as per toast type.
     */
    const returnToastShadow = () => {
      if (props.type === TOAST_TYPE.ERROR) {
        return "drop-shadow(0px 0px 12px rgba(255, 70, 70, 0.1))";
      } else if (props.type === TOAST_TYPE.SUCCESS) {
        return "drop-shadow(0px 0px 12px rgba(66, 255, 63, 0.1))";
      } else {
        return "drop-shadow(0px 0px 12px rgba(255, 172, 72, 0.1))";
      }
    };

    /**
     * Function to return band color as per toast type.
     * @returns Band color as per toast type.
     */
    const returnBandColor = () => {
      if (props.type === TOAST_TYPE.ERROR) {
        return "#FF4646";
      } else if (props.type === TOAST_TYPE.SUCCESS) {
        return "#42FF3F";
      } else {
        return "#FFAC48";
      }
    };

    /**
     * Function to return box shadow of the band.
     * @returns Box shadow color as per toast type.
     */
    const returnBoxShadow = () => {
      if (props.type === TOAST_TYPE.ERROR) {
        return "0px 0px 11px #FF4646";
      } else if (props.type === TOAST_TYPE.SUCCESS) {
        return "0px 0px 11px#42FF3F";
      } else {
        return "0px 0px 11px #FFAC48";
      }
    };

    const openTransactionHash = (hash: string, chainID: number) => {
      const url = getExplorerLinkForHashAndChainId(chainID, hash);
      window.open(url, "target:blank");
    };

    return (
      <SnackbarContent ref={ref} className={`CustomToastWrapper`}>
        <Box
          style={{
            filter: returnToastShadow(),
          }}
          className="CustomToastContainer"
        >
          <Box
            style={{
              background: returnBandColor(),
              boxShadow: returnBoxShadow(),
            }}
            className="ToastBand"
          ></Box>
          <Box className="ToastBody">
            <Box className="ToastContent">
              <span className="ToastHeading">{props.message}</span>
              <span className="ToastSubHeading">{props.subHeading}</span>
              {props.hash && props.chain && (
                <Box
                  className="TransactionHashBtn"
                  onClick={() => {
                    openTransactionHash(
                      props.hash as string,
                      Number(props.chain)
                    );
                  }}
                >
                  View transaction hash
                  <Box className="OpenIcon">
                    <CustomIcon src={OPEN_ICON} />
                  </Box>
                </Box>
              )}
            </Box>
            <Box className="CloseBtn" onClick={handleDismiss}>
              <CustomIcon src={CROSS_ICON} />
            </Box>
          </Box>
        </Box>
      </SnackbarContent>
    );
  }
);

CustomToast.displayName = "CustomToast";

export default CustomToast;
