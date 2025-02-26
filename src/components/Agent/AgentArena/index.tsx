import { useCallback, useState, useEffect, act } from "react";
import "./styles.scss";
import { WALLET_TYPES } from "@/utils/enums";
import { useRef } from "react";
import { AiOutlineEnter } from "react-icons/ai";
import { GET_AGENT_RESPONSE } from "@/components/graphql/queries/getAgentResponse";
import { useLazyQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import useWalletConnectStore from "@/store/wallet-store";
import { convertBigIntToUIFormat } from "@/utils/number";
import { ContractConfig, Token } from "@/store/types/token-type";
import { useAgentStore } from "@/store/agent-store";
import { GET_TOKEN_DOLLAR_VALUE } from "@/components/graphql/queries/getDollarValueOfToken";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { Response } from "@/store/agent-store";
import Image from "next/image";
import { EDDY_LOGO, EDDY_LOGO_WHITE } from "@/utils/images";
import useTransferStore from "@/store/transfer-store";
import { GET_TOKEN_BALANCE } from "@/components/graphql/queries/getTokenBalance";
import useFetchUserChatsWithAgent from "@/hooks/Agent/useFetchUserChatsWithAgent";
import { ChainIds } from "@/utils/enums";
import useSendApprovalTransaction from "@/hooks/Transfer/useSendApprovalTransaction";
import { TransactionSummary } from "./TransactionWidget";
import useSendBTCTransaction from "@/hooks/Transfer/useSendBTCTransaction";
import useWriteContractInteraction from "@/hooks/Transfer/useWriteContractInteraction";
import useSendContractTransaction from "@/hooks/Transfer/useSendContractTransaction";
import useSendSwapTransaction from "@/hooks/Transfer/useSendSwapTransaction";
import useSendSolanaTransaction from "@/hooks/Transfer/useSendSolanaTransaction";
import { ButtonsContainer } from "@/components/CrossChainWidget/ButtonsContainer";
import { ButtonsContainerAgent } from "./ButtonContainer";
import useCustomModal from "@/hooks/common/useCustomModal";
import { ProgressContainerTracking } from "./ProgressContainer";
export const AgentArena = () => {
  const [getDollarValue] = useLazyQuery(GET_TOKEN_DOLLAR_VALUE);
  const chatBoxRef=useRef<HTMLDivElement>(null);
  const [getAgentResponse]=useLazyQuery(GET_AGENT_RESPONSE);
  const fetchTokenUsdValue = useCallback(async (tokenId: number) => {
    if(!tokenId ) return
    const { data, loading, error } = await getDollarValue({
      variables: { tokenId },
    });

    if (data && !loading && !error) {
      const tokenValueUsd = data.getDollarValueForToken
        ? Number(data.getDollarValueForToken.price) /
          10 ** Math.abs(data.getDollarValueForToken.expo)
        : 0;
      return tokenValueUsd;
    }
    return 0;
  }, [getDollarValue]);
  const [getTokenBalance]=useLazyQuery(GET_TOKEN_BALANCE);
  const {
    openTransactionStatusModal,
    payChain,
    getChain,
    payToken,
    activeTransactionHash
  }=useTransferStore(useShallow((state)=>({
    openTransactionStatusModal:state.openTransactionStatusModal,
    payChain:state.payChain,
    getChain:state.getChain,
    payToken:state.payToken,
    activeTransactionHash:state.activeTransactionHash
  })))
  const { 
    activeChat, 
    activeResponse,
    agentResponses,
    userChats,
    chatId,
    showTransactionHash,
    activeTransactionHashResponse,
    sendingTransaction,
    disabled
  } = useAgentStore(useShallow((state) => ({
    activeChat: state.activeChat,
    activeResponse: state.activeResponse,
    agentResponses:state.agentResponses,
    userChats:state.userChats,
    chatId:state.activeChatId,
    showTransactionHash:state.showTransactionHash,
    activeTransactionHashResponse:state.activeTransactionHashResponse,
    sendingTransaction:state.sendingTransaction,
    disabled:state.disable
  })));

  const {
    response,
    loading,
    refetch
  }=useFetchUserChatsWithAgent();

  const handleOpenWalletModal = () => {
    useWalletConnectStore.getState().handleOpen();
  };

  useEffect(()=>{
    if(chatBoxRef.current){
      chatBoxRef.current.scrollTop=chatBoxRef.current.scrollHeight
    }
  },[activeChat,activeResponse,response])

  const { address } = useAccount();

  const { 
    btcWalletAddress, 
    btcWalletId,
    solanaWalletAddress
  } = useWalletConnectStore(
    useShallow((state) => ({
      btcWalletAddress: state.btcWalletAddress,
      btcWalletId: state.btcWalletId,
      solanaWalletAddress:state.solanaWalletAddress
    }))
  );
  const userInputRef = useRef<HTMLInputElement>(null);

  const handleTransactionCallBackFunction = () => {
    if (
      useTransferStore.getState().payChain ===
      useTransferStore.getState().getChain
    )
      return;
  };

  const handleSolanaTransactionCallBack = () => {};

  const { sendCrossChainTransaction, isPending } = useSendContractTransaction({
    callBackFn: handleTransactionCallBackFunction,
  });

  const { sendBTCTransaction, loading: btcTransactionLoading } =
    useSendBTCTransaction();

  const { sendWriteTransaction, isPending: writeTransactionLoading } =
    useWriteContractInteraction({
      callBackFn: handleTransactionCallBackFunction,
    });
  const {
    depositSOL,
    depositSOLToAnyChain,
    depositSPL,
    depositSPLAnyChain,
    loading: solanaTransactionLoading,
  } = useSendSolanaTransaction({
    callBackFn: handleSolanaTransactionCallBack,
  });

  const handleSwapCallBack = () => {
    useTransferStore
      .getState()
      .setTokenInAmount(useTransferStore.getInitialState().tokenInAmount);
    useTransferStore
      .getState()
      .setTokenOutAmount(useTransferStore.getInitialState().tokenOutAmount);
  };

  const { sendSwapTransaction, loading: swapLoading } = useSendSwapTransaction({
    callBackFn: handleSwapCallBack,
  });

  /**
   * Callback function after approval.
   */
  const handleApprovalCallBack = () => {
    refetchApproval()
      .then(() => {
        if (
          useTransferStore.getState().payChain ===
          useTransferStore.getState().getChain
        ) {
          sendSwapTransaction();
        } else {
          sendWriteTransaction();
        }
      })
  };

  const {
    approval,
    sendApprovalTransaction,
    loading: approvalProcessLoading,
    refetch: refetchApproval,
  } = useSendApprovalTransaction({ callBackFunction: handleApprovalCallBack });

  /**
   * Send main transaction after approval
   * @returns void
   */
  const handleSendTransaction = async () => {
    if (
      isPending ||
      writeTransactionLoading ||
      approvalProcessLoading ||
      swapLoading ||
      btcTransactionLoading ||
      solanaTransactionLoading
    )
      return;
    if (payChain === getChain) {
      if (payToken?.isNative) {
        sendSwapTransaction();
      } else {
        if (!approval) {
          sendApprovalTransaction();
        } else {
          sendSwapTransaction();
        }
      }
    } else {
      if (payChain === ChainIds.BITCOIN) {
        sendBTCTransaction(btcWalletId as string);
      } else if (payChain === ChainIds.SOLANA) {
        if (getChain === ChainIds.ZETACHAIN) {
          if (payToken?.isNative) {
            depositSOL();
          } else {
            depositSPL();
          }
        } else {
          if (payToken?.isNative) {
            depositSOLToAnyChain();
          } else {
            depositSPLAnyChain();
          }
        }
      } else if (payChain === ChainIds.ZETACHAIN) {
        if (payToken?.isNative) {
          sendWriteTransaction();
        } else {
          if (!approval) {
            sendApprovalTransaction();
          } else {
            sendWriteTransaction();
          }
        }
      } else {
        if (payToken?.isNative) {
          sendWriteTransaction();
        } else {
          if (!approval) {
            sendApprovalTransaction();
          } else {
            sendWriteTransaction();
          }
        }
      }
    }
  };

  const handleSwapParams = useCallback(
    async (data: any, fromToken: Token, toToken: Token, amount:string, destChainGasToken:Token, sourceChainGasToken:Token) => {
      try {
        useTransferStore.getState().setPayToken(fromToken)
        useTransferStore.getState().setPayChain(fromToken.chain.chainId)
        useTransferStore.getState().setGetToken(toToken);
        useTransferStore.getState().setGetChain(toToken.chain.chainId)
        useTransferStore.getState().setTokenInAmount(amount);
        useTransferStore.getState().setPayChainGasToken(sourceChainGasToken);
        useTransferStore.getState().setGetChainGasToken(destChainGasToken);
        useTransferStore.getState().setPayChainGasTokenId(sourceChainGasToken.id);
        useTransferStore.getState().setGetChainGasTokenId(destChainGasToken.id);
        const {
          loading,
          error,
          data:tokenBalance
        }=await getTokenBalance({
            variables: {
              walletAddress:
                Number(fromToken?.chain.chainId) === ChainIds.BITCOIN
                  ? btcWalletAddress
                  : Number(fromToken?.chain.chainId) === ChainIds.SOLANA
                  ? solanaWalletAddress
                  : address,
              tokenId: Number(fromToken?.id),
              type: Number(fromToken?.chain.chainId) === ChainIds.BITCOIN
            ? WALLET_TYPES.BITCOIN
            : Number(fromToken?.chain.chainId) === ChainIds.SOLANA
            ? WALLET_TYPES.SOLANA
            : WALLET_TYPES.EVM,
        },
        fetchPolicy:"no-cache",
      })
     
      const formattedBalance = convertBigIntToUIFormat(
        tokenBalance.getBalanceOfTokenForUserWallet.balance,
        Number(fromToken?.decimal)
      ).toString();
      useTransferStore.getState().setPayTokenBalance(formattedBalance)
        useTransferStore.getState().setTokenOutAmount(
          isNaN(data.quoteAmount)
            ? "0"
            : convertBigIntToUIFormat(data.quoteAmount, toToken?.decimal ?? 18)
        );

        useTransferStore.getState().setEstimatedReceived(
          isNaN(data.estimatedRecievedAmount)
            ? "0"
            : convertBigIntToUIFormat(data.estimatedRecievedAmount, toToken?.decimal ?? 18)
        );

        const [fromTokenDollarValue, toTokenDollarValue] = await Promise.all([
          fetchTokenUsdValue(fromToken.id),
          fetchTokenUsdValue(toToken.id),
        ]);

        if (fromTokenDollarValue && toTokenDollarValue) {
          useTransferStore
            .getState()
            .setDestinationGas((Number(data.destChainGasFees) * Number(toTokenDollarValue)).toString());

          useTransferStore
            .getState()
            .setSourceChainGas((Number(data.srcChainGasFees) * Number(fromTokenDollarValue)).toString());
        }

        useTransferStore.getState().setMinimumReceived(
          isNaN(data.minimumReceived)
            ? "0"
            : convertBigIntToUIFormat(data.minimumReceived, toToken?.decimal ?? 18)
        );
        useTransferStore.getState().setZetaChainGas(data.zetaFees.toString());
        useTransferStore.getState().setProtocolFee(data.protocolFees);
        useTransferStore.getState().setRoute(data.route);
        if (data.contractConfig) {
          const configResponse: ContractConfig = data.contractConfig;
          const config = {
            address: configResponse?.address,
            abi: configResponse?.abi,
            args: configResponse?.args,
            functionName: configResponse?.functionName,
            to: configResponse?.to,
            value: configResponse?.value?.toString(),
            data: configResponse.data,
          };
          useTransferStore.getState().setContractConfig(config);
        }
        useTransferStore.getState().setEstimatedTime(Math.ceil(Number(data.estimatedTime)));
      } catch (error) {
        console.error("Error processing swap parameters:", error);
      }
    },
    [fetchTokenUsdValue]
  );

 

  useEffect(() => {
    if (activeResponse && activeResponse.quote!=="") {
      try{
        const parsedResponse = JSON.parse(activeResponse.quote);
        if (parsedResponse.functionName === "swap" && parsedResponse.output) {
          handleSwapParams(parsedResponse.output, parsedResponse.fromToken, parsedResponse.toToken,parsedResponse.amountIn,parsedResponse.destinationChainGasToken, parsedResponse.sourceChainGasToken);
        }
      }catch(error){
        return
      } 
    }
  }, [activeResponse,handleSwapParams]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userInputRef.current) {
      const userInput = userInputRef.current?.value;
      if (userInput.trim()) {
      handleEnterClick();
        userInputRef.current.value = "";
      }
    }
  };

  const handleEnterClick = async () => {
    if (userInputRef.current?.value) {
      useAgentStore.setState({
        sendingTransaction:false,
        disable:false
      })
      refetch();
      useTransferStore.getState().handleCloseTransactionStatusModal()
      useAgentStore.getState().setActiveChat(userInputRef.current.value);
      useAgentStore.getState().setActiveResponse({
        outputString:"",
        quote:"",
        toolCalled:false
        })
      try {
        const { data: agentResponse, error } = await getAgentResponse({
          variables: {
            userInput: userInputRef.current.value,
            walletAddress: address,
            chatId: chatId,
            btcWalletAddress: btcWalletAddress || "",
            solanaWalletAddress:solanaWalletAddress || "",
          },
          fetchPolicy:"no-cache",
        });
        useAgentStore.getState().setActiveResponse({
          outputString:agentResponse.getAgentResponse.outputString || "Sorry we Couldn't Process Your Request at the moment",
          quote:agentResponse.getAgentResponse.quote || "",
          toolCalled:agentResponse.getAgentResponse.toolCalled
        })
        refetch();
        if (error) {
          console.error("Error getting agent response:", error);
          return;
        }
      } catch (error) {
        console.error("Error processing agent response:", error);
      }
    }
  };
  
  const handleSwapRejection=async()=>{
    refetch();
    useAgentStore.getState().setActiveChat("User rejected the swap Request!");
    useAgentStore.getState().setActiveResponse({
      outputString:"",
      quote:"",
      toolCalled:false
      })
    try {
      const { data: agentResponse, error } = await getAgentResponse({
        variables: {
          userInput:"User rejected the swap Request!",
          walletAddress: address,
          chatId: chatId,
          btcWalletAddress: btcWalletAddress || "",
          solanaWalletAddress:solanaWalletAddress || ""
        },
        fetchPolicy:"no-cache",
      });
      useAgentStore.getState().setActiveResponse({
        outputString:agentResponse.getAgentResponse.outputString || "Sorry we Couldn't Process Your Request at the moment",
        quote:agentResponse.getAgentResponse.quote || "",
        toolCalled:agentResponse.getAgentResponse.toolCalled
      })
      refetch();
      if (error) {
        console.error("Error getting agent response:", error);
        return;
      }
    } catch (error) {
      console.error("Error processing agent response:", error);
    }
  }

  const renderText=(response:Response)=>{
   if (!response.outputString && !response.quote) return <CustomTextLoader text="Loading" />;
   let parsedResponse;
  try {
    parsedResponse = response.quote ? JSON.parse(response.quote) : null;
  } catch (error) {
    parsedResponse = null;
  }

  function findWalletName(text: string): string | null {
    const regex = /connect\s+your\s+(\w+)\s+wallet\s+to\s+continue/i;
    const match = text.match(regex);
    return match ? match[1] : null; 
  }


   const renderGeneralToolResponse=(answer:string)=>{
    const message=answer.replace(/\*\*(.*?)\*\*/g, '$1') 
    .replace(/\n\s*\*/g, '\n')            
    .replace(/\n{2,}/g, '\n\n')            
    .replace(/\n/g, '\n ')
    const isConnectWallet=findWalletName(message)
    
    return (
    <div className="SwapBox">
      <div className="Logo">
     <Image src={EDDY_LOGO} height={30} width={30} alt="chatlogo"/>
    </div>
    <div className="SwapSummary">
    <div className="nestedResponse">
    <span className="responseRow">{response.quote}</span>
    </div>
    {
      isConnectWallet!==null &&  <div className="ButtonContainerAgentWrapper" onClick={async ()=>{
        handleOpenWalletModal()
        await new Promise((resolve) => setTimeout(resolve, 5000));
        handleEnterClick()
      }}>
        <div className="YesButton">
        <span>{`Connect ${isConnectWallet} Wallet`}</span>
        </div>
    </div>
    }
    </div>
   </div>)
    }

    if(parsedResponse!==null){
      if (parsedResponse?.functionName === 'swap') {
        const isActive=response.outputString===activeResponse.outputString && response.quote===activeResponse.quote && !disabled;
        if(response.outputString.includes("failed") || response.outputString.includes("try again later") || response.outputString.includes("couldn't process")){
          return <div className="nestedResponse">
             <div className="Logo">
            <Image src={EDDY_LOGO} height={30} width={30} alt="chatlogo"/>
           </div>
           <span className="responseRow"> {response.outputString}</span>
          </div>
        }
        return (
          <div className="SwapBox">
            <div className="Logo">
          <Image src={EDDY_LOGO} height={30} width={30} alt="chatlogo"/>
            </div>
              {
                <div className="SwapSummary">
                  <TransactionSummary fromToken={parsedResponse.fromToken} toToken={parsedResponse.toToken} minReceivedAmount={parsedResponse.output.minimumReceived} slippageTolerance={parsedResponse.output.slippage} gasFees={parsedResponse.output.srcChainGasFees} estimatedReceivedAmount={parsedResponse.output.estimatedRecievedAmount}/> 
                  <div className="nestedResponse">
                  <span className="responseRow">{"Do you want to continue with the transaction?"}</span>
                  </div>
                  <div className="ButtonContainerAgentWrapper">
                    <ButtonsContainerAgent/>
                    <div className="YesNoButtonWrapper">
                    <div className={`${isActive  ? "YesButton":"YesButton InactiveButton"}`} onClick={()=>{
                    if(isActive){
                      useAgentStore.setState({
                        disable:true
                      })
                      handleSendTransaction()
                      useAgentStore.setState({
                        sendingTransaction:true
                      })
                      useAgentStore.getState().handleShowTransactionHash(true);
                    }
                   }}>Yes</div>
                   <div className={`${isActive ? "NoButton":"NoButton InactiveButton"}`} onClick={()=>{
                     useAgentStore.setState({
                      disable:true
                    })
                    isActive && handleSwapRejection()
                    useAgentStore.setState({
                      sendingTransaction:false
                    })
                   }}>No</div>
                  </div>
                    </div>
                 
                  {!sendingTransaction? activeTransactionHash && showTransactionHash && response.quote===activeTransactionHashResponse.quote && response.outputString===activeTransactionHashResponse.outputString && <div className="nestedResponse">
                  <span className="responseRow">
                    {`The active Transaction hash is : \n${activeTransactionHash}`}
                    </span>  
                  </div> 
                  :
                  <CustomTextLoader text="Sending Transaction"/>
                  }
                  {
                  !sendingTransaction && activeTransactionHash && showTransactionHash && response.quote===activeTransactionHashResponse.quote && response.outputString===activeTransactionHashResponse.outputString && <ProgressContainerTracking/>
                  }
                </div>
              }
          </div>
      );
      } else{
        return (
          <div className="nestedResponse">
             <div className="Logo">
            <Image src={EDDY_LOGO} height={30} width={30} alt="chatlogo"/>
           </div>
           <span className="responseRow"> {response.outputString}</span>
          </div>
        )
      }
    }else{
      return (
      !response.toolCalled || response.toolCalled===undefined ? <div className="nestedResponse">
         <div className="Logo">
            <Image src={EDDY_LOGO} height={30} width={30} alt="chatlogo"/>
           </div>
         <span className="responseRow"> {
         response.outputString
         .replace(/\*\*(.*?)\*\*/g, '$1') 
        .replace(/\n\s*\*/g, '\n')            
        .replace(/\n{2,}/g, '\n\n')            
        .replace(/\n/g, '\n ')
        }</span>
    </div>
    :
    renderGeneralToolResponse(response.quote)
    )
    }
  }
  const chatArray= (activeResponse.quote==="" && activeResponse.outputString==="") ? response : response.slice(0,-1) ;
  return (
    <div className="ArenaChatArea">
      <div className="ArenaChatBox" ref={chatBoxRef}>
     { 
      chatArray.map((item)=>{
      const agentResponse:Response={
        quote:item.quote,
        outputString:item.outputString,
        toolCalled:item.toolCalled
      }
      return (
        <>
        <div className="chatTextQuestion">
        <div className="chatText">
          <span>{item.query}</span>
        </div>
      </div>
      <div className="chatTextResponse">
        {
          renderText(agentResponse)
        }
      </div>
        </>
      )
     })
      }
      {activeChat!=="" && <div className="chatTextQuestion">
        <div className="chatText">
          <span>{activeChat}</span>
        </div>
      </div>}
     { (activeResponse.outputString==="" && activeResponse.quote ==="" && activeChat==="") ? 
     <div className="chatTextResponse">

     </div>
     :<div className="chatTextResponse">
        {
          renderText(activeResponse)
        }
      </div>
      }
    </div>
    <div className="AgentArenaInputContainer">
     <input
       ref={userInputRef}
       onKeyDown={handleKeyPress}
       placeholder="Ask Anything"
       className="AgentInput"
     />
     <div className="EnterButton" onClick={handleEnterClick}>
       <AiOutlineEnter />
     </div>
   </div>
    </div>
   
    
  );
};