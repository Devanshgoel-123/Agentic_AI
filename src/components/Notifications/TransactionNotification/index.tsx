import { forwardRef, useCallback, useEffect, useState } from "react";
import "./styles.scss";

import Box from "@mui/material/Box";

import { SnackbarContent, CustomContentProps, useSnackbar } from "notistack";
import useTransferStore from "@/store/transfer-store";
import useTrackCrossChainNotification from "@/hooks/Transfer/useTrackCrossChainNotification";

import GradientText from "@/components/common/GradientText";
import CustomIcon from "@/components/common/CustomIcon";
import {
  CHEVRON_LEFT,
  CROSS_ICON,
  TICK_GREEN,
  TIMER_GREEN,
} from "@/utils/images";
import { formatSecondsToMinutesAndSeconds } from "@/utils/number";
import { STATUS_CODES } from "@/utils/enums";
import { Token } from "@/store/types/token-type";

interface CustomToastsProps extends CustomContentProps {
  fromToken: Token;
  toToken: Token;
  estimatedTime: string;
  hash: string;
  createdAt?: number;
}

const TransactionNotification = forwardRef<HTMLDivElement, CustomToastsProps>(
  ({ id, ...props }, ref) => {
    const { closeSnackbar } = useSnackbar();
    const [timer, setTimer] = useState(Number(props.estimatedTime));
    const [progress, setProgress] = useState(0);

    const { status } = useTrackCrossChainNotification({
      transactionHash: props.hash,
      payChain: Number(props.fromToken.chain.chainId),
      getChain: Number(props.toToken.chain.chainId),
      allowFetch: !(!props.hash || !props.fromToken || !props.toToken),
    });

    useEffect(() => {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      const timer = setInterval(() => {
        if (props.hash) {
          setProgress((oldProgress) => {
            if (oldProgress === 70) {
              return 70;
            }
            const diff = 1;
            return Math.min(oldProgress + diff, 100);
          });
        }
      }, 1000);

      if (status === STATUS_CODES.SUCCESS || status === STATUS_CODES.FAILED) {
        clearInterval(timer);
      }

      return () => {
        clearInterval(timer);
      };
    }, [status, props.hash]);

    useEffect(() => {
      if (status === STATUS_CODES.SUCCESS || status === STATUS_CODES.FAILED) {
        setProgress(100);
      }
    }, [status]);

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
     
    }, [id]);

    /**
     * Function to track status of the transactoion.
     * @returns status text as per transaction status.
     */
    const returnStatusText = () => {
      if (status === STATUS_CODES.FAILED) {
        return "Failed";
      } else if (status === STATUS_CODES.SUCCESS) {
        return "Success";
      } else {
        return timer <= 0 ? "Pending" : formatSecondsToMinutesAndSeconds(timer);
      }
    };

    /**
     * Function to close notification if status is SUCCESS or FAILED.
     */
    const handleCloseNotification = () => {
      if (status === STATUS_CODES.SUCCESS || status === STATUS_CODES.FAILED) {
        handleDismiss();
      } else {
        useTransferStore.getState().handleOpenTransactionStatusModal();
        handleDismiss();
      }
    };

    return (
      <SnackbarContent ref={ref} className="TransactionNotificationWrapper">
        <Box className="TransactionNotificationContainer">
          <Box className="NotificationHeading">
            <span className="HeadingText">
              <GradientText text="Transaction in progress" />
            </span>
            <Box className="CloseIcon" onClick={handleDismiss}>
              <CustomIcon src={CROSS_ICON} />
            </Box>
          </Box>
          <Box className="RouteDetailsContainer">
            <Box className="TokenDetails">
              <Box className="TokenLogo">
                <CustomIcon src={props.fromToken.tokenLogo as string} />
                <Box className="ChainLogo">
                  <CustomIcon src={props.fromToken.chain.chainLogo as string} />
                </Box>
              </Box>
              <Box className="ArrowIcon">
                <CustomIcon src={CHEVRON_LEFT} />
              </Box>
              <Box className="TokenLogo">
                <CustomIcon src={props.toToken.tokenLogo as string} />
                <Box className="ChainLogo">
                  <CustomIcon src={props.toToken.chain.chainLogo as string} />
                </Box>
              </Box>
            </Box>
            <Box className="TimerContainer">
              <Box className="ProgressContainer">
                <Box
                  style={{
                    width: `${progress}%`,
                    background:
                      status === STATUS_CODES.FAILED
                        ? "linear-gradient(90deg, #FF4440 0%, #FF4440 87.2%, #FF7672 100%)"
                        : "linear-gradient(90deg, var(--app-green) 0%, var(--app-green) 87.2%, var(--app-white-green) 100%)",
                  }}
                  className="ProgressBar"
                ></Box>
              </Box>
              <Box
                style={{
                  color: status === STATUS_CODES.FAILED ? "#FF4440" : "#7CF17A",
                }}
                className="TimeContainer"
              >
                <Box className="TimerIcon">
                  <CustomIcon
                    src={
                      status === STATUS_CODES.SUCCESS ? TICK_GREEN : TIMER_GREEN
                    }
                  />
                </Box>
                {returnStatusText()}
              </Box>
            </Box>
          </Box>
          <Box className="ViewDetailsButton" onClick={handleCloseNotification}>
            View Details
          </Box>
        </Box>
      </SnackbarContent>
    );
  }
);

TransactionNotification.displayName = "TransactionNotification";

export default TransactionNotification;
