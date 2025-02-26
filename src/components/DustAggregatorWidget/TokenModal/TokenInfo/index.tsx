import React, { useEffect, useState } from "react";
import "./styles.scss";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import CustomIcon from "@/components/common/CustomIcon";
import useDustAggregatorStore from "@/store/dust-aggregator-store";
import { Token, TokenSwap } from "@/store/types/token-type";
import { useShallow } from "zustand/react/shallow";
import useFetchTokenBalance from "@/hooks/Transfer/useFetchTokenBalance";
import { useAccount } from "wagmi";
import { convertBigIntToUIFormat } from "@/utils/number";
import { formattedValueToDecimals } from "@/utils/number";
import { BigNumber } from "v5n";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { CHAIN_IDS } from "@/utils/constants";
import useWalletConnectStore from "@/store/wallet-store";


interface Props {
  token: Token;
  isMulti: boolean;
  setterFunction?: (token: Token, balance: string) => void;
  balance?: string | undefined;
  usdValue?: string;
  allowSelection: boolean;
  clear: boolean;
  clearCallBack: () => void;
}

export const TokenInfo = ({ 
  isMulti, 
  token,
  setterFunction,
  balance,
  usdValue,
  allowSelection,
  clear,
  clearCallBack
}: Props) => {
  const { address: walletAddress } = useAccount();
  const [selected, setSelected] = useState<boolean>(false);
  const [radioSelected, setRadioSelected] = useState<boolean>(false);
  
  const {
    destinationToken,
    sourceTokens,
    destinationChain,
    threshold
  } = useDustAggregatorStore(useShallow((state) => ({
    destinationToken: state.destinationToken,
    sourceTokens: state.sourceTokens,
    destinationChain:state.destinationChain,
    threshold:state.threshold
  })));

  const {
    btcWalletAddress,
    destinationAddress
  }=useWalletConnectStore(useShallow((state)=>({
    btcWalletAddress:state.btcWalletAddress,
    destinationAddress:state.destinationAddress
  })))

  const isTokenInSourceTokens = sourceTokens.some(
    (item) => token.address === item.address && token.name === item.name
  );

  useEffect(() => {
    if (isTokenInSourceTokens) {
      setSelected(!clear);
    } else {
      setSelected(false);
    }
    if(isMulti && (token.intermediateToken || (useDustAggregatorStore.getState().sourceChain===CHAIN_IDS.ZETACHAIN && token.isNative) ) ){
      useDustAggregatorStore.getState().setSourceChainIntermediateToken(token)
    }
    if(isMulti && token.isNative){
      useDustAggregatorStore.getState().setSourceChainGasToken(token)
    }
    if(!isMulti && token.isNative){
      useDustAggregatorStore.getState().setDestinationChainGasToken(token)
    }
  }, [isTokenInSourceTokens, clear]);

  const { loading, data, error } = useFetchTokenBalance({
    walletAddress: walletAddress,
    tokenDetails: token,
    setterFunction: setterFunction
  });

  const renderBalance = () => {
    if (!allowSelection) {
      return (
        <div className="LoaderTextDust">
          <span className="TokenBalanceDust">
            {walletAddress === undefined || (destinationChain===CHAIN_IDS.BITCOIN_MAINNET && btcWalletAddress===undefined && destinationAddress===undefined) ? "0.00" : 
              <CustomTextLoader text="0.00" />}
          </span>
          <span className="TokenDollarValueDust">
            {walletAddress === undefined || (destinationChain===CHAIN_IDS.BITCOIN_MAINNET && btcWalletAddress===undefined && destinationAddress===undefined) ? "0.00" : 
              <CustomTextLoader text="$0.00" />}
          </span>
        </div>
      );
    }
    
    return (
      <div className="TokenBalanceContainerDust">
        <span className="TokenBalanceDust">
          {formattedValueToDecimals(
            convertBigIntToUIFormat(
              balance !== undefined ? balance : data.balance,
              Number(token.decimal)
            ).toString(),
            8
          )}
        </span>
        <span className="TokenDollarValueDust">${usdValue || 0.00}</span>
      </div>
    );
  };
  /**
   * function to handle selection of tokens
   */
  const handleTokenSelection=()=>{
    if (clear) {
      clearCallBack();
    }
    
    if (Number(usdValue) !== 0 && isMulti) {
      const newSelected = !selected;
      setSelected(newSelected);
      
      if (newSelected && balance) {
        const tokenSwap: TokenSwap = {
          amount: BigNumber.from(balance),
          token: token.address,
          poolFeeTier: token.feeTier as number,
          usdValue:usdValue as string
        };
        useDustAggregatorStore.getState().setTotalDustValue(Number(usdValue));
        useDustAggregatorStore.getState().setSourceChainTokens(token);
        useDustAggregatorStore.getState().setTokenSwapForPermit(tokenSwap);
      } else {
        useDustAggregatorStore.getState().setSubTotalDustValue(Number(usdValue))
        useDustAggregatorStore.getState().handleSourceChainTokens(token);
        useDustAggregatorStore.getState().handleTokenSwapForPermit(token.address);
      }
    }

    if (!isMulti) {
      setRadioSelected(!radioSelected);
      useDustAggregatorStore.getState().setDestinationToken(token);
      useDustAggregatorStore.getState().setDestinationChain(token.chain.chainId);
    }
  }
  return (
    <div className="TokenInfoDust" 
      onClick={
        handleTokenSelection
      }
    >
      <div 
        className="TokenInfoContainerBoxDust" 
        style={{
          opacity: (Number(usdValue) === 0 || Number(usdValue) > Number(threshold)) && isMulti ? "0.5" : "1"
        }}
      >   
        {allowSelection && (
          isMulti ? (
            Number(usdValue) < Number(threshold) && usdValue !== "0.00" ? (
              <Checkbox
                checked={selected}
                size="medium"
                sx={{
                  "&.Mui-checked": {
                    color: "#7bf179",
                    position: "relative",
                    overflow:"hidden",
                    border: "2px solid #2e2e2e",
                    background: "linear-gradient(45deg, #0a0a0a, #2e2e2e)",
                    borderRadius: "8px",
                  },
                  "&.MuiCheckbox-root":{
                    border:"0px",
                    height:"20px",
                    width:"20px"
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: 20,
                    border: "2px solid #2e2e2e",
                    background: "linear-gradient(45deg, #0a0a0a, #2e2e2e)",
                    borderRadius: "8px",
                  },
                 border:"0",
                 color:'transparent'
                }}
              />
            ) : null
          ) : (
            <Radio
              checked={destinationToken?.address === token.address && 
                      destinationToken?.name === token.name}
              value=""
              name="radio-buttons"
              size="small"
              sx={{
                "&.Mui-checked": {
                  color: "#7bf179",
                  position: "relative",
                  overflow:"hidden",
                  border: "2px solid #2e2e2e",
                  background: "linear-gradient(45deg, #0a0a0a, #2e2e2e)",
                  borderRadius: "50%",
                  padding:"0"
                },
                "&.MuiRadio-root":{
                  border:"0px",
                  height:"20px",
                  width:"20px",
                   padding:"0"
                },
                "& .MuiSvgIcon-root": {
                  fontSize: 20,
                  border: "2px solid #2e2e2e",
                  background: "linear-gradient(45deg, #0a0a0a, #2e2e2e)",
                  borderRadius: "50%",
                   padding:"0"
                },
               
                color: "transparent"
              }}
            />
          )
        )}
        <div className="TokenLogo">
          <CustomIcon src={token.tokenLogo} />
        </div>
        <div className="TokenDetailsBoxDust">
          <span className="TokenNameDust">{token.name}</span>
          <span className="ChainNameDust">{token.chain.name}</span>
        </div>
      </div>
      {renderBalance()}
    </div>
  );
};