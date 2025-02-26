import { ButtonsContainer } from "@/components/CrossChainWidget/ButtonsContainer"
import "./styles.scss"
import { ReadyToClickActionButton } from "./ButtonContainer"
import { act, useRef } from "react"
import { AiOutlineEnter } from "react-icons/ai";
import { useAgentStore } from "@/store/agent-store";
import { useLazyQuery } from "@apollo/client";
import { GET_AGENT_RESPONSE } from "@/components/graphql/queries/getAgentResponse";
import { useAccount } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";
import { useShallow } from "zustand/react/shallow";
import { useMediaQuery } from "usehooks-ts";

interface Props{
  heading:string;
  content:string;
  query:string;
}

export const ChatBox=()=>{
  const {address}=useAccount();
  const isMdDevice= useMediaQuery("(max-width:768px)");
    const {
        btcWalletAddress,
        destinationAddress,
        solanaWalletAddress
    }=useWalletConnectStore(useShallow((state)=>({
        btcWalletAddress:state.btcWalletAddress,
        destinationAddress:state.destinationAddress,
        solanaWalletAddress:state.solanaWalletAddress
    })))
    const {
      activeChat,
      chatId
    }=useAgentStore(useShallow((state)=>({
      activeChat:state.activeChat,
      chatId:state.activeChatId
    })))
    const userInputRef = useRef<HTMLInputElement>(null);
    const [getAgentResponse]=useLazyQuery(GET_AGENT_RESPONSE);

    const handleKeyPress =  (e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && userInputRef.current) {
          const userInput = userInputRef.current?.value;
          if (userInput.trim()) {
             handleEnterClick()
            userInputRef.current.value = ""; 
          }
        }
      };
    
    const handleEnterClick=async ()=>{
        userInputRef.current?.value!==null && useAgentStore.getState().setActiveChat( userInputRef.current?.value as string)
        useAgentStore.getState().setActiveResponse({
          outputString:"",
          quote:"",
          toolCalled:false
        })
        useAgentStore.getState().handleOpenArena()
        try{
          const {data:agentResponse,error,refetch}=await getAgentResponse({
            variables:{
              userInput:userInputRef.current?.value as string,
              walletAddress:address,
              btcWalletAddress: btcWalletAddress || "",
              solanaWalletAddress:solanaWalletAddress || "",
              chatId:chatId
            },
            fetchPolicy:"no-cache",
          })
          useAgentStore.getState().setActiveResponse({
            outputString:agentResponse.getAgentResponse.outputString || "Sorry we Couldn't Process Your Request at the moment",
            quote:agentResponse.getAgentResponse.quote || "",
            toolCalled:agentResponse.getAgentResponse.toolCalled
          })
          refetch()
          if (error) {
            console.error("Error getting agent response:", error);
            return;
          }
        } catch (error) {
          console.error("Error processing agent response:", error);
        }
        
    }  

    const ButtonContent:Props[]=[
      {
        heading:"Swap",
        content:"Swap one token for another",
        query:"Swap token"
      },
      {
        heading:"Fetch Token Price",
        content:"Fetch Token Price of a token in USD",
        query:"Fetch the token price"
      },
    ]
    return (
        <div className="ChatBox">
            <div className="ChatHeader">
            <span>How can we help you today ?</span>
            <span>We are here to help you out in every step of the way</span>
        </div> 
        <div className="ButtonsWrapper">
          {
            ButtonContent.map((item:Props,index:number)=>{
              return <ReadyToClickActionButton content={item.content} heading={item.heading} key={index} query={item.query}/>
            })
          }
        </div>
        <div className="AgentInputContainer">
        <input
             ref={userInputRef}
             onKeyDown={handleKeyPress}
            placeholder="Ask Anything"
            className="AgentInput"
          />
          <div 
        className="EnterButton"
        onClick={handleEnterClick}
        >
        <AiOutlineEnter />
        </div>
        </div>
        </div>
           
    )
}