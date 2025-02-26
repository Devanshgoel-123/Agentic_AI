import React, { useEffect } from "react";
import "./styles.scss";

import { IoIosArrowDown } from "react-icons/io";
import { TokenModal } from "../TokenModal";

import useCustomModal from "@/hooks/common/useCustomModal";
import useFetchDefaultChainDetails from "@/hooks/DustAggregator/useFetchDefaultChainDetails";

import { CustomCircleLoader } from "@/components/common/CustomCircleLoader";
import CustomIcon from "@/components/common/CustomIcon";
import { Token } from "@/store/types/token-type";
import useDustAggregatorStore from "@/store/dust-aggregator-store";
import { useAccount } from "wagmi";

interface Props {
  chainId: number;
  currentChain: number;
  actionType: string;
  isMulti: boolean;
  chainDetails: Token | undefined;
  setterFunction: (chain: number) => void;
  destinationToken?: Token;
  sourceTokens?: Token[];
}

export const TokenInfoWidget = ({
  actionType,
  isMulti,
  chainId,
  chainDetails,
  currentChain,
  setterFunction,
  destinationToken,
  sourceTokens,
}: Props) => {
  const {address}=useAccount();
  const { open, handleClose, handleOpen } = useCustomModal();
  const { loading, error, getDefaultTokens } = useFetchDefaultChainDetails({
    chainId,
    actionType,
  });

  useEffect(() => {
    getDefaultTokens(chainId);
  }, [chainId]);

  const returnLoadingState = () => {
    if (loading || chainDetails === undefined) {
      return (
        <div className="ChainLogo">
          <CustomCircleLoader />
        </div>
      );
    } else {
      
      return (
        <>
          <div className="ChainLogo">
            <CustomIcon src={chainDetails?.chain.chainLogo as string} />
          </div>
          <span className="ChainName">{chainDetails.chain.name==="Binance Smart Chain" ? "BNB" : chainDetails.chain.name}</span>
          <div className="DropdownIcon">
            <IoIosArrowDown />
          </div>
        </>
      );
    }
  };

  const renderDestinationTokenDetails = () => {
    if (loading || destinationToken === undefined) {
      return (
        <div className="TokenLogo">
          <CustomCircleLoader />
        </div>
      );
    } else {
      return (
        <>
          <div className="TokenLogo">
            <CustomIcon src={destinationToken.tokenLogo} />
          </div>
          <div className="TokenName">{destinationToken.name}</div>
        </>
      );
    }
  };

  const renderSourceTokenDetails = () => {
    if (loading) {
      return (
        <div className="TokenLogo">
          <CustomCircleLoader />
        </div>
      );
    } else {
      if (sourceTokens?.length === 0 || address===undefined) {
        return (
          <>
            <div className="InitialTokens">
            {
              useDustAggregatorStore.getState().initialDisplayTokens.slice(0,3).map((item)=>{
                return <div className="TokenLogo" key={item}>
                    <CustomIcon src={item} />
                </div>
              })
            }
            {
              useDustAggregatorStore.getState().initialDisplayTokens && useDustAggregatorStore.getState().initialDisplayTokens.length>3 && <div className="TokenLogo TokenText" >
              +{useDustAggregatorStore.getState().initialDisplayTokens.length-3}
              </div>
            }
            </div>
            {
             
            }
          </>
        );
      } else {
        return (
          <>
            {sourceTokens?.map((item: Token) => (
              <div key={item.address} className="TokenLogo">
                <CustomIcon src={item.tokenLogo} />
              </div>
            )).slice(0,3)
            }
            {
              sourceTokens && sourceTokens?.length>3 && <div className="TokenLogo TokenText" >
                +{sourceTokens.length-3}
              </div>
            }
          </>
        );
        
      }
    }
  };

  return (
    <div className="TokenInfoContainerDust" onClick={()=>{
      !open && handleOpen()
    }}>
      <div className="Label">
        {actionType === "source" ? "Source" : "Destination"}
      </div>
      <div className="LogoContainer">
        {isMulti ? (
          <>{renderSourceTokenDetails()}</>
        ) : (
          <>{renderDestinationTokenDetails()}</>
        )}
      </div>
      <div className="ChainDetailsDust" onClick={()=>{
        handleOpen()
        useDustAggregatorStore.getState().setDisplayMobileTokens(false)
        }}>
        {returnLoadingState()}
      </div>
      <TokenModal
        open={open}
        handleClose={handleClose}
        label={actionType === "source" ? "Source" : "Destination"}
        currentChain={currentChain}
        fetchChainDetails={getDefaultTokens}
        setterFunction={setterFunction} //function to set chain
        isMulti={isMulti}
      />
    </div>
  );
};
