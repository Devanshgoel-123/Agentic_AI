import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
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
import { DiTokenLogo } from "@/components/Pools/PoolsWidget/PoolsTable/PoolRow/DiTokenLogo";
import { MultiTokenLogo } from "@/components/Pools/PoolsWidget/PoolsTable/PoolRow/MultiTokenLogo";
import useDustAggregatorStore from "@/store/dust-aggregator-store";

interface CustomToastsProps extends CustomContentProps {
  sourceTokens: Token[];
  toToken: Token;
  hash: string;
  createdAt: number;
  sourceChain:number;
  destinationChain:number;
}

const TransactionNotificationForDust = forwardRef<HTMLDivElement, CustomToastsProps>(
  ({ id, ...props }, ref) => {
    const { closeSnackbar } = useSnackbar();
    const [progress, setProgress] = useState(0);
    
    const trackingParams=useMemo(()=>({
      transactionHash: props.hash,
      payChain: Number(props.sourceChain),
      getChain: Number(props.destinationChain),
      allowFetch: !(!props.hash || !props.toToken),
    }),[props.destinationChain,props.sourceChain,props.hash,props.toToken])
    const { status } = useTrackCrossChainNotification(trackingParams);

    const [timer, setTimer] = useState(() => {
      if(props.createdAt){
        const elapsedTime = Math.floor((Date.now() - props.createdAt) / 1000);
        const remainingTime = 15*60 - elapsedTime;
        return Math.max(remainingTime, 0); 
      }
      return 0;
    });
    const elapsedTime=Math.floor((Date.now() - props.createdAt) / 1000);

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
      } else if (status === STATUS_CODES.SUCCESS || status === "SUCCESS") {
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
        
        useDustAggregatorStore.getState().handleOpenTransactionStatusModalDust();
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
              {(() => {
  const tokenLogos = props.sourceTokens.map((item) => item.tokenLogo);
  switch (props.sourceTokens.length) {
    case 1:
    return <div className="TokenLogo">
        <CustomIcon src={tokenLogos[0] as string} />
        </div>;
    case 2:
    return <DiTokenLogo tokenLogos={tokenLogos.slice(0,2)} />
    case 3:
    return <div className="sourceTokenTrackingContainer">
        <div className="NotificationTokenLogoContainerSource">
          {
            props.sourceTokens.slice(0,3).map((item)=>{
              return (
              <div key={item.address} className="tokenImageTri">
              <CustomIcon src={item.tokenLogo}/>
              </div>
              )
    })
          }
        </div>
      </div>
    case 4:
        return <div className="sourceTokenTrackingContainer">
        <div className="NotificationTokenLogoContainerSource">
          {
            props.sourceTokens.slice(0,3).map((item)=>{
              return (
                <div key={item.address} className="tokenImageTri">
                <CustomIcon src={item.tokenLogo}/>
                </div>
                )
    })
          }
        </div>
         <div className="TokenText" >
         +{props.sourceTokens.length-3}
          </div>
      </div>
      default:
        return null;
    }
})()}
                {/* <Box className="ChainLogo">
                  <CustomIcon src={props.sourceTokens[0].chain.chainLogo as string} />
                </Box> */}
             
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

TransactionNotificationForDust.displayName = "TransactionNotificationForDust";

export default TransactionNotificationForDust;
