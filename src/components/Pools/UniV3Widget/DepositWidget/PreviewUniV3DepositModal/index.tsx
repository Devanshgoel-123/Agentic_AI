import React, { useState } from "react";
import "./styles.scss";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAccount } from "wagmi";
import useUniV3Store from "@/store/univ3-store";
import { useShallow } from "zustand/react/shallow";
import useFetchUniV3DepositContractConfig from "@/hooks/Pools/useFetchUniV3DepositContractConfig";
import useSendPoolApproval from "@/hooks/Pools/useSendPoolApproval";
import useSendUniV3AddLiquidityTransaction from "@/hooks/Pools/useSendUniV3AddLiquidityTransaction";
import useFetchIncreaseLiquidityContractConfig from "@/hooks/Pools/useFetchIncreaseLiquidityContractConfig";
import useSendIncreaseLiquidityTransaction from "@/hooks/Pools/useSendIncreaseLiquidityTransaction";

import Modal from "@mui/material/Modal";
import { MODAL_STYLE } from "@/utils/constants";
import Grow from "@mui/material/Grow";
import CustomIcon from "@/components/common/CustomIcon";
import { CROSS_ICON } from "@/utils/images";
import GradientText from "@/components/common/GradientText";
import { UniV3PoolLabel } from "@/components/Pools/PoolsWidget/PoolsTable/PoolRow/UniV3Label";
import { Token } from "@/store/types/token-type";
import { PoolContractType } from "@/store/types/pool-type";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import {
  convertTickToPrice,
  convertTickToPriceRange,
  formatNumberWithDecimals,
} from "@/utils/number";
import Slide from "@mui/material/Slide";

interface Props {
  open: boolean;
  contract: string;
  poolName: string;
  poolChainId: number;
  fee: string;
  tokens: Token[];
  nftId: string | undefined;
  isCurrent: boolean | undefined;
  handleResetTransaction: () => void;
  handleClose: () => void;
}

export const PreviewUniV3Deposit = ({
  open,
  tokens,
  fee,
  poolName,
  poolChainId,
  contract,
  nftId,
  isCurrent,
  handleResetTransaction,
  handleClose,
}: Props) => {
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  const { address } = useAccount();

  /**
   * !Important
   * This loader tracks transition from
   * Approval txn -> Withdrawal txn
   * set it false if Approval is not required.
   * Handle with care.
   */
  const [transitionLoader, setTransitionLoader] = useState<boolean>(false);

  const {
    token0Amount,
    token1Amount,
    minTick,
    maxTick,
    depositContractConfig: contractConfig,
    isDepositQuoteLoading,
  } = useUniV3Store(
    useShallow((state) => ({
      token0Amount: state.token0Amount,
      token1Amount: state.token1Amount,
      minTick: state.minTick,
      maxTick: state.maxTick,
      currentTick: state.currentTick,
      depositContractConfig: state.depositContractConfig,
      isDepositQuoteLoading: state.isDepositQuoteLoading,
    }))
  );

  const handleAddLiquidityCallBack = () => {
    handleResetTransaction();
    handleClose();
  };

  const { loading: sendAddLiquidityLoading, sendAddLiquidityTransaction } =
    useSendUniV3AddLiquidityTransaction({
      token0: tokens[0],
      token1: tokens[1],
      contractConfig: contractConfig as PoolContractType,
      poolName: poolName,
      poolChainId: poolChainId,
      callBackFn: handleAddLiquidityCallBack,
    });

  const {
    loading: sendIncreaseLiquidityLoading,
    sendIncreaseLiquidityTransaction,
  } = useSendIncreaseLiquidityTransaction({
    token0: tokens[0],
    token1: tokens[1],
    contractConfig: contractConfig as PoolContractType,
    poolName: poolName,
    poolChainId: poolChainId,
    callBackFn: handleAddLiquidityCallBack,
  });

  /**
   * Callback function after tokenB approval
   * Step - 1: Refetch approval status to update it
   * Step - 2: call next step as call back function in refetch promise.
   * !Important set transition loader to false.
   */
  const handleTokenBApprovalCallBack = () => {
    setTransitionLoader(true);
    refetchToken1Approval()
      .then(() => {
        if (isCurrent && nftId) {
          sendIncreaseLiquidityTransaction();
        } else {
          sendAddLiquidityTransaction();
        }
      })
      .finally(() => {
        setTransitionLoader(false);
      });
  };
  const {
    approval: token1Approval,
    sendApprovalTransaction: sendToken1Approval,
    loading: token1ApprovalLoading,
    refetch: refetchToken1Approval,
  } = useSendPoolApproval({
    contractConfig: contractConfig as PoolContractType,
    amount: token1Amount,
    tokenId: tokens[1]?.id as number,
    tokenDecimal: tokens[1]?.decimal as number,
    chainId: tokens[1]?.chain.chainId as number,
    address: address,
    callBackFunction: handleTokenBApprovalCallBack,
  });

  /**
   * Call back function after token A approval
   * Call token B approval if approval token B is false
   * else call add liquidity function.
   * Step - 1: Refetch approval status to update it
   * Step - 2: call next step as call back function in refetch promise.
   * !Important set transition loader to false.
   */
  const handleTokenAApprovalCallBack = () => {
    setTransitionLoader(true);
    refetchToken0Approval()
      .then(() => {
        if (!token1Approval) {
          sendToken1Approval();
        } else {
          sendAddLiquidityTransaction();
        }
      })
      .finally(() => {
        setTransitionLoader(false);
      });
  };

  const {
    approval: token0Approval,
    sendApprovalTransaction: sendToken0Approval,
    loading: token0ApprovalLoading,
    refetch: refetchToken0Approval,
  } = useSendPoolApproval({
    contractConfig: contractConfig as PoolContractType,
    amount: token0Amount,
    tokenId: tokens[0].id as number,
    tokenDecimal: tokens[0].decimal as number,
    chainId: tokens[0].chain.chainId as number,
    address: address,
    callBackFunction: handleTokenAApprovalCallBack,
  });

  const { loading, error } = useFetchUniV3DepositContractConfig({
    token0: tokens[0],
    token1: tokens[1],
    contract: contract,
    fee: fee,
  });

  const { loading: increaseLiquidityLoading, error: increaseLiquidityError } =
    useFetchIncreaseLiquidityContractConfig({
      token0: tokens[0],
      token1: tokens[1],
      contract: contract,
      nftId: nftId as string,
      isSkip: !Boolean(nftId) || !Boolean(isCurrent),
    });

  /**
   * Main button function
   * Checks for token approvals first
   * if done then directly sends add liquidity transaction.
   */
  const sendMainTransaction = () => {
    if (!token0Approval) {
      sendToken0Approval();
    } else if (!token1Approval) {
      sendToken1Approval();
    } else {
      if (isCurrent && nftId) {
        sendIncreaseLiquidityTransaction();
      } else {
        sendAddLiquidityTransaction();
      }
    }
  };

  const returnBtnState = () => {
    if (
      isDepositQuoteLoading ||
      loading ||
      sendAddLiquidityLoading ||
      token0ApprovalLoading ||
      token1ApprovalLoading ||
      transitionLoader ||
      increaseLiquidityLoading ||
      sendIncreaseLiquidityLoading
    ) {
      return (
        <div className="ActionBtnGreen">
          <CustomSpinner size={"20"} color="#323227" />
        </div>
      );
    } else {
      return (
        <div className="ActionBtnGreen" onClick={sendMainTransaction}>
          {!token0Approval || !token1Approval ? "Approve" : "Confirm Deposit"}
        </div>
      );
    }
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
      <div className="PreviewUniV3DepositModalWrapper">
        {!mobileDevice && (
          <Grow in={open}>
            <div className="PreviewUniV3DepositModal">
              {" "}
              <div className="HeadingContainer">
                <div className="HeadingText">
                  <GradientText text="Create Position" />
                </div>
                <div
                  className="BackBtn"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <CustomIcon src={CROSS_ICON} />
                </div>
              </div>
              <hr />
              <div className="PoolInfoContainer">
                <div className="TokenInfoContainer">
                  <div className="TokenLogo">
                    <CustomIcon src={tokens[0].tokenLogo} />
                  </div>
                  <div className="TokenLogo">
                    <CustomIcon src={tokens[1].tokenLogo} />
                  </div>
                </div>
                <div className="PoolFeeContainer">
                  <span className="PoolName">{poolName}</span>
                  <div className="FeeContainer">
                    <UniV3PoolLabel />
                    <div className="FeeLabel">Fee: {fee}%</div>
                  </div>
                </div>
              </div>
              <div className="LiquidityContainer">
                <span className="Label">Liquidity</span>
                <div className="TokenInfoContainer">
                  <div className="TokenInfo">
                    <div className="TokenLogo">
                      <CustomIcon src={tokens[0].tokenLogo} />
                    </div>
                    <span className="TokenName">{tokens[0].name}</span>
                  </div>
                  <span className="TokenValue">
                    {formatNumberWithDecimals(Number(token0Amount))}
                  </span>
                </div>
                <div className="TokenInfoContainer">
                  <div className="TokenInfo">
                    <div className="TokenLogo">
                      <CustomIcon src={tokens[1].tokenLogo} />
                    </div>
                    <span className="TokenName">{tokens[1].name}</span>
                  </div>
                  <span className="TokenValue">
                    {formatNumberWithDecimals(Number(token1Amount))}
                  </span>
                </div>
              </div>
              <div className="RangeContainer">
                <span>Range</span>
                <span>
                  {convertTickToPriceRange(
                    minTick,
                    maxTick,
                    tokens[0].decimal,
                    tokens[1].decimal
                  ).priceRangeToken1.lower.toFixed(4)}{" "}
                  -{" "}
                  {convertTickToPriceRange(
                    minTick,
                    maxTick,
                    tokens[0].decimal,
                    tokens[1].decimal
                  ).priceRangeToken1.upper.toFixed(4)}
                </span>
              </div>
              <div className="ActionBtnContainer">{returnBtnState()}</div>
            </div>
          </Grow>
        )}

        {mobileDevice && (
          <Slide in={open} direction="up">
            <div className="PreviewUniV3DepositModal">
              {" "}
              <div className="HeadingContainer">
                <div className="HeadingText">
                  <GradientText text="Create Position" />
                </div>
                <div
                  className="BackBtn"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <CustomIcon src={CROSS_ICON} />
                </div>
              </div>
              <hr />
              <div className="PoolInfoContainer">
                <div className="TokenInfoContainer">
                  <div className="TokenLogo">
                    <CustomIcon src={tokens[0].tokenLogo} />
                  </div>
                  <div className="TokenLogo">
                    <CustomIcon src={tokens[1].tokenLogo} />
                  </div>
                </div>
                <div className="PoolFeeContainer">
                  <span className="PoolName">{poolName}</span>
                  <div className="FeeContainer">
                    <UniV3PoolLabel />
                    <div className="FeeLabel">Fee: {fee}%</div>
                  </div>
                </div>
              </div>
              <div className="LiquidityContainer">
                <span className="Label">Liquidity</span>
                <div className="TokenInfoContainer">
                  <div className="TokenInfo">
                    <div className="TokenLogo">
                      <CustomIcon src={tokens[0].tokenLogo} />
                    </div>
                    <span className="TokenName">{tokens[0].name}</span>
                  </div>
                  <span className="TokenValue">
                    {formatNumberWithDecimals(Number(token0Amount))}
                  </span>
                </div>
                <div className="TokenInfoContainer">
                  <div className="TokenInfo">
                    <div className="TokenLogo">
                      <CustomIcon src={tokens[1].tokenLogo} />
                    </div>
                    <span className="TokenName">{tokens[1].name}</span>
                  </div>
                  <span className="TokenValue">
                    {formatNumberWithDecimals(Number(token1Amount))}
                  </span>
                </div>
              </div>
              <div className="RangeContainer">
                <span>Range</span>
                <span>
                  {convertTickToPriceRange(
                    minTick,
                    maxTick,
                    tokens[0].decimal,
                    tokens[1].decimal
                  ).priceRangeToken1.lower.toFixed(4)}{" "}
                  -{" "}
                  {convertTickToPriceRange(
                    minTick,
                    maxTick,
                    tokens[0].decimal,
                    tokens[1].decimal
                  ).priceRangeToken1.upper.toFixed(4)}
                </span>
              </div>
              <div className="ActionBtnContainer">{returnBtnState()}</div>
            </div>
          </Slide>
        )}
      </div>
    </Modal>
  );
};
