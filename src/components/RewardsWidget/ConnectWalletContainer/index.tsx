
import "./styles.scss";
import useWalletConnectStore from "@/store/wallet-store";




export const ConnectWalletContainer=()=>{
    return <div className="ConnectWalletWrapper">
      <span>Connect your wallet to participate in the Eddy Rewards program</span>
      <div className="ConnectWalletBtn" onClick={() => {
            useWalletConnectStore.getState().handleOpen();
          }}>
        Connect Wallet
      </div>
    </div>
}