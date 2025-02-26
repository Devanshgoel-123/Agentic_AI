import React, { useEffect } from "react";
import "./styles.scss";
import Box  from "@mui/material/Box";
import { SEARCH_ICON } from "@/utils/images";
import { useAccount } from "wagmi";
import useFetchTokenForDust from "@/hooks/DustAggregator/useFetchTokenForDust";
import { useLazyQuery } from "@apollo/client";
import { GET_TOKEN_DOLLAR_VALUE } from "@/components/graphql/queries/getDollarValueOfToken";
import Modal from "@mui/material/Modal";
import Grow from "@mui/material/Grow";
import GradientText from "@/components/common/GradientText";
import { useState } from "react";
import { supportedBridgeChains } from "@/utils/constants";
import { ChainInfo } from "./ChainInfo";
import { TokenInfo } from "./TokenInfo";
import { BigNumber } from "v5n";
import { IoCloseSharp } from "react-icons/io5";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import { Token, TokenSwap } from "@/store/types/token-type";
import useDustAggregatorStore from "@/store/dust-aggregator-store";
import { formattedValueToDecimals } from "@/utils/number";
import CustomIcon from "@/components/common/CustomIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import Slide from "@mui/material/Slide";
import { IoArrowBackOutline } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";
import { TiInfoLarge } from "react-icons/ti";

interface Props {
  open: boolean;
  label: string;
  currentChain: number;
  isMulti: boolean;
  handleClose: () => void;
  fetchChainDetails: (chain: number) => void;
  setterFunction: (chain: number) => void;
  handleOpen?:()=>void;
}

export const TokenModal = ({
  open,
  handleClose,
  label,
  currentChain,
  fetchChainDetails,
  isMulti,
  setterFunction,
}: Props) => {
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  const [query, setQuery] = useState<string>("");
  const { address } = useAccount();
  const [clear,setClear]=useState<boolean>(false);
  /**
   * Store results of token list after balance fetch
   * in this array to display it in sorted manner.
   * make sure to clear this array if chain changes or modal closes.
   */
const [sortedTokens, setSortedTokens] = useState<{ token: Token; balance: string; usdValue:string}[]>([]);
const [getDollarValue,{loading:dollarLoading,error:dollarError,data:dollarData,refetch}]=useLazyQuery(GET_TOKEN_DOLLAR_VALUE);
  const {
    loading: tokenLoading,
    error: tokenFetchError,
    data,
  } = useFetchTokenForDust({
    chainId: currentChain,
    allowFetch: false,
    chainType:label
  });
  
  const {
    showMobileTokens,
    sourceTokens,
    threshold
  }=useDustAggregatorStore(useShallow((state)=>({
    showMobileTokens:state.displayMobileTokens,
    sourceTokens:state.sourceTokens,
    threshold:state.threshold
  })))

  const handleSetSortedTokenData = async (token: Token, balance: string) => {    
    /**
     * Populate sortedTokens Array with the above data
     * @param usdValue Value of user holded tokens in USD
     */
    const addTokenData = (usdValue: string) => {
      setSortedTokens((prev) =>{ 
        const currentChainTokens = prev.filter(t => t.token.chain.chainId === currentChain && t.token.address!==token.address);
        return [
        ...currentChainTokens,
        ...[{
          token,
          balance,
          usdValue,
        },
      ]
      ]
    });
    };
    if(Number(balance)>0 ){
      const {data:dollarUsdData,loading,error}=await getDollarValue({variables:{
        tokenId:token.id,
       }})
       if(dollarUsdData && !loading && !error){
        const tokenValueUsd=dollarUsdData.getDollarValueForToken ? Number(dollarUsdData.getDollarValueForToken.price) /10 ** Math.abs(dollarUsdData.getDollarValueForToken.expo): 0;
        const userTokenHoldingsInUsd=formattedValueToDecimals(
          (
            Number(tokenValueUsd) *
            (Number(balance !== undefined ? balance : data.balance) /
              10 ** Number(token.decimal))
          ).toString(),
          4
        )
        addTokenData(userTokenHoldingsInUsd);
       }
    }else{
      addTokenData("0.00");
    }
  }


 /**
  * Function to select all tokens for dust aggregator
  */
  const handleSelectAllToken=()=>{
    setClear(false);
    sortedTokens.filter((item)=>Number(item.usdValue) < Number(threshold) && Number(item.balance)!==0).map((item)=>{
      const tokenSwap:TokenSwap={
        token:item.token.address,
        amount:BigNumber.from(item.balance),
        poolFeeTier:item.token.feeTier as number,
        usdValue:item.usdValue as string,
      }
      const isTokenInSourceTokens = sourceTokens.some(
        (token) => token.address === item.token.address && token.name === item.token.name
      );

      if(!isTokenInSourceTokens){
        useDustAggregatorStore.getState().setTotalDustValue(Number(item.usdValue));
        useDustAggregatorStore.getState().setSourceChainTokens(item.token);
        useDustAggregatorStore.getState().setTokenSwapForPermit(tokenSwap);
      }
    })
  }

  /**
   * Function to handle loading state of tokens.
   * @returns JSX
   */
  const renderTokensList = () => {
      return data.map((item: Token) => (
        <TokenInfo
         key={item.address}
         isMulti={isMulti}
         token={item} 
         setterFunction={handleSetSortedTokenData}
         allowSelection={false}
         clear={clear}
         clearCallBack={clearCallBackFn}
        />
      ));
    
  };


  const clearCallBackFn=()=>{
    setClear(false)
  }

  
  /**
   * Render token list once data is fetched from backend.
   * @returns void
   */
  const renderSortedTokensList = () => {
    return (
      <>
        {sortedTokens.length > 0 &&
          sortedTokens
          .filter((item)=>item.token.name.toLowerCase().includes(query))
            .sort((a, b) => Number(b.usdValue) - Number(a.usdValue))
            .map((item: { token: Token; balance: string; usdValue: string}) => (
              <TokenInfo
              key={item.token.address}
              isMulti={isMulti}
              token={item.token} 
              balance={item.balance}
              usdValue={item.usdValue}
              allowSelection={true}
              clear={clear}
              clearCallBack={clearCallBackFn}
              />
            ))}
      </>
    );
  };
  const handleQuery=()=>{
    setSortedTokens([]);
    useDustAggregatorStore.getState().setDisplayMobileTokens(true);
    setQuery("");
  }

const text=!showMobileTokens?"Select Chain":"Select Asset";
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        backdropFilter: "blur(5px)",
      }}  
    >
      <div className="TokenModalWrapperDust">
        {!mobileDevice && <Grow in={open}>
          <div className="TokenModalComponentDust">
          <div className="TokenModalContainerDust">
            <div className="TokenModalHeadingContainerDust">
              <span className="Heading">
                <GradientText text={label} />
              </span>
              <div className="CrossBtn" onClick={ ()=>{
                handleQuery();
                handleClose();
               
              }}>
                <IoCloseSharp />
              </div>
            </div>
            <hr />
            <div className="TokenModalSectionDust">
              <div className="ChainsContainerDust">
                <div className="Label">Chains</div>
                <div className="ChainsListDust">
                  {supportedBridgeChains.map((el, index) => (
                    <ChainInfo
                      key={index}
                      logo={el.logo}
                      name={el.name}
                      chainId={el.chainId}
                      currentChain={currentChain}
                      actionType={label.toLowerCase()}
                      callBackFn={handleQuery}
                      setterFunction={setterFunction}
                    />
                  ))}
                </div>
              </div>
              <div className="Line"></div>
              <div className="TokensContainerDust">
                <div className="TokensContainerHeader">
                <div className="Label">Assets</div>
                {isMulti && <span className="TokenModalHeaderText">(Only supports token below $50 Balance)</span>}
                
                </div>
                <Box className="SearchContainerDust">
                    <Box className="SearchLogo">
                      <CustomIcon src={SEARCH_ICON} />
                    </Box>
                    <input
                      disabled={sortedTokens.length !== data.length}
                      placeholder={"Search by symbol, name or address"}
                      className="SearchInput"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      type="text"
                    />
                  </Box>
               {isMulti && sortedTokens.length === data.length && !tokenLoading && <div className="TokensContainerDustButton">
                <button onClick={()=>{
                  handleSelectAllToken()
                }}>Select all</button>
                <button onClick={()=>{
                  useDustAggregatorStore.getState().clearSourceChainToken();
                  useDustAggregatorStore.getState().clearTokenSwapForPermit();
                  useDustAggregatorStore.getState().setClearTotalDustValue()
                  setClear(true)
                }}>Clear all</button>
                 
                </div>}
              <div className="TokensListDust">
                  {tokenLoading ? (
                    <div className="TokenLoaderPlaceholder">
                      <CustomSpinner size="20" color="#909090" />
                    </div>
                  ) : sortedTokens.length === data.length ? (
                    renderSortedTokensList()
                  ) : (
                    <>
                      {renderTokensList()}
                    </>
                  )}
                </div>
              </div>
            </div>
            {
              <div className="ActionBtnActive" onClick={()=>{
                   handleQuery();
                   handleClose();
                }}>
                  <span>Proceed</span>
              </div>}
          </div>
          <div className="InfoPillComponentTokenModal">
        <div className="InfoIconTokenModal">
          <TiInfoLarge />
        </div>
        <div className="PillTextTokenModal">
          {/* //Only supports tokens below <span className="Green">$10</span> valuation */}
         {isMulti ? "You can select multiple tokens to be converted" : "Select your destination Token"}
        </div>
      </div>
          </div>
        </Grow>}
        {mobileDevice && (
          <Slide in={open} direction="up">
            <div className="TokenModalContainerDust">
            <div className="TokenModalHeadingContainerDust">
              {!showMobileTokens ? <>
                <span className="Heading">
                <GradientText text={text}/>
              </span>
              <div className="CrossBtn" onClick={ ()=>{
                handleQuery();
                handleClose();
              }}>
                <IoCloseSharp />
              </div>
              </>
              :
              <>
              <div className="HeaderFortokensMobileDust">
            <div className="CrossBtn" onClick={ ()=>{
              handleQuery();
              useDustAggregatorStore.getState().setDisplayMobileTokens(false);
            }}>
             <IoArrowBackOutline />
            </div>
            <span className="Heading"> <GradientText text={text}/></span>
              </div>
              
            <div className="CrossBtn" onClick={ ()=>{
              handleQuery();
              handleClose();
            }}>
              <IoCloseSharp />
            </div>
              </>
              }
            </div>
            <div className="TokenModalSectionDust">
              {!showMobileTokens && <div className="ChainsContainerDust">
                <div className="ChainsListDust">
                  { supportedBridgeChains.map((el, index) => (
                    <ChainInfo
                      key={index}
                      logo={el.logo}
                      name={el.name}
                      chainId={el.chainId}
                      currentChain={currentChain}
                      actionType={label.toLowerCase()}
                      callBackFn={handleQuery}
                      setterFunction={setterFunction}
                    />
                  ))}
                </div>
              </div>}
              {showMobileTokens && 
              <div className="TokensContainerDust">
                <Box className="SearchContainerHeaderDust">
                  <div className="SearchContainerDust" style={{
                    width:"80%"
                  }}>
                  <Box className="SearchLogo">
                      <CustomIcon src={SEARCH_ICON} />
                    </Box>
                    <input
                      disabled={sortedTokens.length !== data.length}
                      placeholder={"Search by symbol, name or address"}
                      className="SearchInput"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      type="text"
                    />
                  </div>
                  </Box>
                  {isMulti && sortedTokens.length === data.length  && !tokenLoading &&  <div className="TokensContainerDustButton">
                <button onClick={()=>{
                  handleSelectAllToken()
                }}>Select all</button>
                <button onClick={()=>{
                  useDustAggregatorStore.getState().clearSourceChainToken();
                  useDustAggregatorStore.getState().clearTokenSwapForPermit();
                  useDustAggregatorStore.getState().setClearTotalDustValue()
                  setClear(true)
                }}>Clear all</button>
                 
                </div>}
                <div className="TokensListDust">
                  {tokenLoading ? (
                    <div className="TokenLoaderPlaceholder">
                      <CustomSpinner size="20" color="#909090" />
                    </div>
                  ) : sortedTokens.length === data.length ? (
                    renderSortedTokensList()
                  ) : (
                    <>
                      {renderTokensList()}
                    </>
                  )}
                </div>
                <div className="TokenModalBottomContainer">
                <div className="InfoPillComponentTokenModal">
        <div className="InfoIconTokenModal">
          <TiInfoLarge />
        </div>
        <div className="PillTextTokenModal">
         {isMulti ? "You can select multiple tokens to be converted" : "Select your destination Token"}
        </div>
      </div>
                <div className="ActionBtnActiveMobile" onClick={()=>{
                   handleQuery();
                   handleClose();
                }}>
                  <span>Proceed</span>
                </div>
                </div>
              
              </div>
              }
            </div>
          </div>
          </Slide>
        )}
      </div>
    </Modal>
  );
};
