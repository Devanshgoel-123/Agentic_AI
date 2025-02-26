import React, { useEffect } from "react";
import "./styles.scss";
import useCustomModal from "@/hooks/common/useCustomModal";
import { Token } from "@/store/types/token-type";
import { motion } from "framer-motion";
import { SlippageInfo } from "../common/SlippageInfo";
import CustomIcon from "@/components/common/CustomIcon";
import { ActionBtnContainer } from "./ActionBtnContainer";
import { ReviewDepositModal } from "./ReviewDepositModal";
import { PoolTokenContainer } from "./PoolTokenContainer";
import { EDDY_LOGO } from "@/utils/images";
import useCurveStore from "@/store/curve-store";
import { useShallow } from "zustand/react/shallow";
import useFetchDepositCurveQuote from "@/hooks/Pools/useFetchDepositCurveQuote";
import { ApolloQueryResult, OperationVariables } from "@apollo/client";

interface Props {
  poolName: string;
  tokens: Token[];
  lpTokenAddress: string;
  lpSymbol: string;
  lpTokenImage: string;
  lpTokenDecimal: number;
  contract: string;
  slug: string;
  refetchLpTokenBalance: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<any>>;
}

export const CurveDepositWidget = ({
  poolName,
  tokens,
  lpTokenAddress,
  lpSymbol,
  lpTokenImage,
  lpTokenDecimal,
  contract,
  slug,
  refetchLpTokenBalance,
}: Props) => {
  const { open, handleClose, handleOpen } = useCustomModal();

  const { tokenInputs, minLpAmount, slippage } = useCurveStore(
    useShallow((state) => ({
      tokenInputs: state.tokenInputs,
      minLpAmount: state.minLpAmount,
      slippage: state.slippageValue,
    }))
  );

  useEffect(() => {
    useCurveStore.setState({
      tokenBalances: useCurveStore.getInitialState().tokenBalances,
    });
    useCurveStore.setState({
      tokenInputs: useCurveStore.getInitialState().tokenInputs,
    });
  }, []);

  const { loading, error } = useFetchDepositCurveQuote({
    poolId: slug,
    slippage: Number(slippage),
    tokenAmounts: tokenInputs,
  });

  /**
   *
   * @returns Token containers as per native toke check.
   */
  const returnTokenContainers = () => {
    if (tokens.some((item) => item.isNative)) {
      return (
        <>
          {tokens
            .filter((item) => !item.isNative)
            .map((el, index) => (
              <PoolTokenContainer key={index} token={el} slug={slug} />
            ))}
          <PoolTokenContainer
            token={tokens.filter((item) => item.isNative)[0]}
            slug={slug}
          />
        </>
      );
    } else {
      return tokens.map((el, index) => (
        <PoolTokenContainer key={index} token={el} slug={slug} />
      ));
    }
  };

  return (
    <motion.div
      className="CurveDepositWidget"
      transition={{ delay: 0.2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {" "}
      {tokens.length > 0 && returnTokenContainers()}
      <div className="LpTokenContainer">
        <SlippageInfo />
        <div className="LpTokenInfo">
          <span className="Label">You’ll Receive</span>
          <div className="LpToken">
            <span>
              {(Number(minLpAmount) / 10 ** Number(lpTokenDecimal)).toFixed(4)}
            </span>
            <div className="LpTokenLogoContainer">
              <div className="LpTokenLogo">
                <CustomIcon src={lpTokenImage ?? EDDY_LOGO} />
              </div>
              <span>{lpSymbol.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="ButtonsContainer">
        <ActionBtnContainer loadingState={loading} handleOpen={handleOpen} />
      </div>
      <ReviewDepositModal
        poolName={poolName}
        lpTokenName={lpSymbol}
        lpTokenImage={lpTokenImage}
        lpTokenDecimal={lpTokenDecimal}
        contract={contract}
        open={open}
        handleClose={handleClose}
      />
    </motion.div>
  );
};
