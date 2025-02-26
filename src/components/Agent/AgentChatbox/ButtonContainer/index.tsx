
import { useAgentStore } from "@/store/agent-store";
import "./styles.scss"
import { FaBalanceScale } from "react-icons/fa";
import { GET_AGENT_RESPONSE } from "@/components/graphql/queries/getAgentResponse";
import { useLazyQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import useWalletConnectStore from "@/store/wallet-store";
interface Props{
    heading:string;
    content:string;
    query:string;
}
export const ReadyToClickActionButton=({
    heading,
   content,
   query
}:Props)=>{
    const {address}=useAccount();
    const [getAgentResponse]=useLazyQuery(GET_AGENT_RESPONSE);
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
        chatId
    }=useAgentStore(useShallow((state)=>({
        chatId:state.activeChatId
    })))
    const handleClick=async()=>{
        useAgentStore.getState().handleOpenArena()
        useAgentStore.getState().setActiveChat(query)
        try{
            const {data:agentResponse,error,refetch}=await getAgentResponse({
                variables:{
                  userInput:query as string,
                  walletAddress:address,
                  btcWalletAddress: btcWalletAddress || "",
                  solanaWalletAddress:solanaWalletAddress || "",
                  chatId:chatId
                }
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
    return (
        <div className="ButtonContainer" onClick={handleClick}>
            <div className="ButtonHeading">
                <FaBalanceScale />
                <span>{heading}</span>
            </div>
            <span className="ButtonInfo">{content}</span>
        </div>
    )
}