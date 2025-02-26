import "./styles.scss";
import useWalletConnectStore from "@/store/wallet-store";

export const ConnectWalletContainer=()=>{
    return <div className="ConnectWalletWrapper">
      <span>Connect your wallet to Interact with the Agent</span>
      <div className="ConnectWalletBtn" onClick={() => {
            useWalletConnectStore.getState().handleOpen();
          }}>
        Connect Wallet
      </div>
    </div>
}