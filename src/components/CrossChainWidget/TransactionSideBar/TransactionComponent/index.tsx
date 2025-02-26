import { useEffect, useState, useMemo } from "react";
import "./styles.scss";
import Box from "@mui/material/Box";
import useTransferStore from "@/store/transfer-store";
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
import useTrackCrossChain from "@/hooks/Transfer/useTrackCrossChain";

interface CustomToastsProps {
  fromToken: Token;
  toToken: Token;
  estimatedTime: string;
  hash: string;
  createdAt: number;
  status?: "SUCCESS" | "PENDING" | "FAILED";
}

export const TransactionNotification = (props: CustomToastsProps) => {
  const [timer, setTimer] = useState(() => {
    if(props.createdAt){
      const elapsedTime = Math.floor((Date.now() - props.createdAt) / 1000);
      const remainingTime = Number(props.estimatedTime) - elapsedTime;
      return Math.max(remainingTime, 0); 
    }
    return 0;
  });
  const elapsedTime=Math.floor((Date.now() - props.createdAt) / 1000);
  const [progress, setProgress] = useState(elapsedTime);
  const trackCrossChainParams = useMemo(
    () => ({
      activeTransaction: {
        fromToken: props.fromToken,
        toToken: props.toToken,
        hash: props.hash,
        estimatedTime: Number(props.estimatedTime),
        createdAt: props.createdAt,
      },
      transactionHash: props.hash,
      payChain: Number(props.fromToken.chain.chainId),
      getChain: Number(props.toToken.chain.chainId),
      allowFetch: !(!props.hash || !props.fromToken || !props.toToken),
    }),
    [props.fromToken, props.toToken, props.hash, props.estimatedTime,props.createdAt]
  );

  const { status } = useTrackCrossChain(trackCrossChainParams);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0)); 
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (props.hash && status !== STATUS_CODES.SUCCESS) {
        setProgress((oldProgress) => {
          if (oldProgress >= 70) {
            return 70; 
          }
          return oldProgress + 1; 
        });
      }
    }, 1000);
  
    if (status === STATUS_CODES.SUCCESS) {
      clearInterval(progressInterval);
      setProgress(100);
    }
  
    return () => clearInterval(progressInterval);
  }, [props.hash, status]);
  

  useEffect(() => {
    if (status!==null && (status=== STATUS_CODES.SUCCESS || props.status==="SUCCESS")) {
      setProgress(100);
      useTransferStore.getState().handleUpdateActiveTransactionStatus(props.hash,"SUCCESS");
      const removalTimeout = setTimeout(() => {
        useTransferStore.getState().handleCompletedTransaction(props.hash);
      }, 5000);
      return () => clearTimeout(removalTimeout);
    }
  }, [status, props.hash,props.status]);

  const returnStatusText = () => {
    if (status === STATUS_CODES.FAILED) {
      return "Failed";
    } else if (status === STATUS_CODES.SUCCESS || props.status === "SUCCESS") {
      return "Success";
    } else {
      return timer <= 0 ? "Pending" : formatSecondsToMinutesAndSeconds(timer);
    }
  };

  const handleCloseNotification = () => {
    useTransferStore.getState().setActiveTransaction(
      {
        fromToken: props.fromToken,
        toToken: props.toToken,
        hash: props.hash,
        estimatedTime: Number(props.estimatedTime),
        createdAt: props.createdAt,
        status:"PENDING"
      },
      true
    );
    
    useTransferStore.getState().handleOpenTransactionStatusModal();
    useTransferStore.getState().setActiveSideBar(false);
  };

  return (
    <Box className="TransactionNotificationContainer">
      <Box className="NotificationHeading">
        <span className="HeadingText">
          <GradientText text="Transaction in progress" />
        </span>
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
                width: `${props.status === "SUCCESS" ? 100 : Math.min(progress, 70)}%`,
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
       {props.status!=="SUCCESS" &&  <Box className="ViewDetailsButton" onClick={handleCloseNotification}>
        View Details
      </Box>}
    </Box>
  );
};

TransactionNotification.displayName = "TransactionNotification";
export default TransactionNotification;
