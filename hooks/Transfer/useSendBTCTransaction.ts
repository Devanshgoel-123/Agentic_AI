import { useState } from "react";
import useHandleToast from "../common/useHandleToast";
import {
  TRANSACTION_FAILED,
  TRANSACTION_REJECTED,
  TRANSACTION_REJECTED_BTC,
} from "@/utils/toasts";
import { BTC_WALLET_IDS, ChainIds, TOAST_TYPE } from "@/utils/enums";
import {
  BTC_TSS_ZETA,
  POOL_DEPOSIT_WITHDRAW,
  ZETA_CONTRACT_ADDRESS,
  getEncodedBitcoinWalletAddress,
} from "@/utils/constants";
import { Token } from "@/store/types/token-type";
import { useAccount } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";
import useTransferStore from "@/store/transfer-store";
import { useShallow } from "zustand/react/shallow";
import useFetchUTXOForWallet from "../common/useFetchUTXOForWallet";
import mixpanel from "mixpanel-browser";
import { useAgentStore } from "@/store/agent-store";
import { useWallet } from "@solana/wallet-adapter-react";

/**
 * Get Transfer data for BTC transaction - case not ZetaChain.
 * @param recipient Target wallet address on destination chain.
 * @param targetZRC20Token Target ZRC20 token.
 * @returns Transfer data for BTC Transaction.
 */
const getTransferDataForBtcToSolanaSwap = (
  recipient: `0x${string}` | undefined,
  targetZRC20Token: Token,
  isTargetZRC20: boolean,
  destinationChain: number,
  isUniV3: boolean
) => {
  return `${ZETA_CONTRACT_ADDRESS}${destinationChain
    .toString(16)
    .padStart(8, "0")}${targetZRC20Token.id
    .toString(16)
    .padStart(8, "0")}${recipient?.slice(2)}${isTargetZRC20 ? "01" : "00"}${
    isUniV3 ? "01" : "00"
  }`;
};

/**
 * Get Transfer data for BTC transaction - case not ZetaChain.
 * @param recipient Target wallet address on destination chain.
 * @param targetZRC20Token Target ZRC20 token.
 * @returns Transfer data for BTC Transaction.
 */
const getTransferDataForBtcSwap = (
  recipient: `0x${string}` | undefined,
  targetZRC20Token: string,
  isTargetZRC20: boolean,
  destinationChain: number,
  isUniV3: boolean
) => {
  return `${ZETA_CONTRACT_ADDRESS}${destinationChain
    .toString(16)
    .padStart(8, "0")}${targetZRC20Token}${recipient?.slice(2)}${
    isTargetZRC20 ? "01" : "00"
  }${isUniV3 ? "01" : "00"}`;
};

/**
 * Get Transfer data for BTC transaction - case ZetaChain.
 * @param walletAddress Target wallet address on destination chain.
 * @param targetZrc20 Target ZRC20 token.
 * @returns Transfer data for BTC Transaction.
 */
const getTransferDataForBtcToZetaSwap = (
  walletAddress: `0x${string}` | undefined,
  targetZrc20: string,
  isTargetZRC20: boolean,
  destinationChain: number,
  isUniV3: boolean
) => {
  targetZrc20 = targetZrc20.slice(2);
  return `${POOL_DEPOSIT_WITHDRAW}${walletAddress?.slice(2)}${targetZrc20}${
    isUniV3 ? "01" : "00"
  }`;
};

/**
 * Get params for BTC transaction.
 * @param address Target chain address.
 * @param btcPaymentAddress BTC address of user.
 * @param toChainId Destination chain id.
 * @param fromAmount Input amount.
 * @param fromToken Origin token.
 * @returns
 */
const getParamsXDefiTransfer = (
  address: `0x${string}` | undefined,
  btcPaymentAddress: string,
  toChainId: number,
  fromAmount: string,
  fromToken: Token,
  toToken: Token,
  isTargetZRC20: boolean
) => {
  const targetZRC20Token = toToken.zrc20Address.slice(2);
  const memoString = getTransferDataForBtcSwap(
    address,
    targetZRC20Token,
    isTargetZRC20,
    toChainId,
    fromToken.isUniV3Supported && toToken.isUniV3Supported
  );

  const amountInSatoshi = parseFloat(fromAmount) * 1e8;

  const fromAddress = btcPaymentAddress;

  return {
    memoString,
    amountInSatoshi,
    fromAddress,
  };
};

/**
 *
 * @param tokenAddress Target token address.
 * @param address User address on zetachain.
 * @param btcPaymentAddress User BTC address.
 * @param fromAmount User input amount.
 * @returns
 */
const getParamsForZetachainDestination = (
  tokenAddress: any,
  address: `0x${string}` | undefined,
  btcPaymentAddress: any,
  fromAmount: any,
  isTargetZRC20: boolean,
  destinationChain: number,
  isUniV3: boolean
) => {
  const targetZrc20 = tokenAddress;
  const memoString = getTransferDataForBtcToZetaSwap(
    address,
    targetZrc20,
    isTargetZRC20,
    destinationChain,
    isUniV3
  );
  const amountInSatoshi = parseFloat(fromAmount) * 1e8;
  const fromAddress = btcPaymentAddress;

  return {
    memoString,
    amountInSatoshi,
    fromAddress,
  };
};

/**
 *
 * @param tokenAddress Target token address.
 * @param address User address on zetachain.
 * @param btcPaymentAddress User BTC address.
 * @param fromAmount User input amount.
 * @returns
 */
const getParamsForSolanaDestination = (
  fromToken: Token,
  targetToken: Token,
  address: `0x${string}` | undefined | string,
  btcPaymentAddress: any,
  fromAmount: any,
  isTargetZRC20: boolean,
  destinationChain: number
) => {
  const recipient = getEncodedBitcoinWalletAddress(
    address?.toString() as string
  );
  const memoString = getTransferDataForBtcToSolanaSwap(
    recipient as `0x${string}`,
    targetToken as Token,
    isTargetZRC20,
    destinationChain,
    fromToken.isUniV3Supported && targetToken.isUniV3Supported
  );

  const amountInSatoshi = parseFloat(fromAmount) * 1e8;
  const fromAddress = btcPaymentAddress;

  return {
    memoString,
    amountInSatoshi,
    fromAddress,
  };
};

const useSendBTCTransaction = () => {
  const { address } = useAccount();
  const { btcWalletAddress } = useWalletConnectStore();
  const { payToken, getToken, tokenInAmount, estimatedTime } = useTransferStore(
    useShallow((state) => ({
      payToken: state.payToken,
      getToken: state.getToken,
      tokenInAmount: state.tokenInAmount,
      estimatedTime: state.estimatedTime,
    }))
  );
  const {
    activeChat,
    activeResponse
  }=useAgentStore(useShallow((state)=>({
    activeChat:state.activeChat,
    activeResponse:state.activeResponse
  })))
  const [loading, setLoading] = useState(false);
  const { handleToast } = useHandleToast();
  const { publicKey } = useWallet();
  const { getBTCUtxo } = useFetchUTXOForWallet();

  const responseBtcTransactionsXDefi = async (error: any, result: any) => {
    if (error) {
      setLoading(false);
      if (error === "XDEFI: user rejected the message signing") {
        handleToast(
          TRANSACTION_REJECTED.heading,
          TRANSACTION_REJECTED.subHeading,
          TOAST_TYPE.ERROR
        );
        useAgentStore.getState().setActiveTransactionHashResponse({
          activeTransactionHash:"User rejected the request, Can I help You with Anything else?" ,
          query:activeChat,
          quote:activeResponse.quote,
          outputString:activeResponse.outputString
        })
        useAgentStore.setState({
          sendingTransaction:false
        })
      } else {
        useAgentStore.getState().setActiveTransactionHashResponse({
          activeTransactionHash:"An Error occured, Can I help You with Anything else?" ,
          query:activeChat,
          quote:activeResponse.quote,
          outputString:activeResponse.outputString
        })
        useAgentStore.setState({
          sendingTransaction:false
        })
        console.log(error);
        handleToast(
          TRANSACTION_FAILED.heading,
          TRANSACTION_FAILED.subHeading,
          TOAST_TYPE.ERROR
        );
      }

      return;
    }

    try {
      const hash = result;
      setLoading(false);
      if (hash) {
        const timeStamp = new Date().getTime();
        useTransferStore.getState().setActiveTransactionHash(hash);
        useAgentStore.getState().setActiveTransactionHashResponse({
          activeTransactionHash: hash || "" ,
          query:activeChat,
          quote:activeResponse.quote,
          outputString:activeResponse.outputString
      })
        useTransferStore.getState().setActiveTransaction(
          {
            fromToken: payToken as Token,
            toToken: getToken as Token,
            estimatedTime: estimatedTime,
            hash: hash,
            createdAt: timeStamp,
            status: "PENDING",
          },
          false
        );
        useAgentStore.setState({
          sendingTransaction:false
        })
        setTimeout(() => {
          useTransferStore.getState().handleOpenTransactionStatusModal();
        }, 200);
        mixpanel.track("widget_swap_button_click", {
          traxnType: "CrossChain BTC",
          from: `${payToken?.name}`,
          to: `${getToken?.name}`,
        });
      }
    } catch (error) {
      console.log(error);
      handleToast(
        TRANSACTION_FAILED.heading,
        TRANSACTION_FAILED.subHeading,
        TOAST_TYPE.ERROR
      );
      useAgentStore.getState().setActiveTransactionHashResponse({
        activeTransactionHash:"An Error occured, Can I help You with Anything else?" ,
        query:activeChat,
        quote:activeResponse.quote,
        outputString:activeResponse.outputString
      })
      useAgentStore.setState({
        sendingTransaction:false
      })
      throw new Error(
        `Error in sending BTC Transactions using XDefi: ${error}`
      );
    }
  };

  /**
   * Function to call when okx is connected.
   */
  const sendOKXBTCTransaction = async () => {
    try {
      setLoading(true);
      let memoString, amountInSatoshi, fromAddress;

      const resp = getParamsXDefiTransfer(
        address,
        btcWalletAddress as string,
        Number(getToken?.chain.chainId),
        tokenInAmount,
        payToken as Token,
        getToken as Token,
        !getToken?.unsupported
      );

      memoString = resp.memoString;
      amountInSatoshi = resp.amountInSatoshi;
      fromAddress = resp.fromAddress;

      if (Number(getToken?.chain.chainId) === ChainIds.ZETACHAIN) {
        const resp = getParamsForZetachainDestination(
          getToken?.zrc20Address,
          address,
          btcWalletAddress,
          tokenInAmount,
          !getToken?.unsupported,
          Number(getToken?.chain.chainId),
          (payToken?.isUniV3Supported && getToken?.isUniV3Supported) as boolean
        );

        memoString = resp.memoString;
        amountInSatoshi = resp.amountInSatoshi;
        fromAddress = resp.fromAddress;
      } else if (Number(getToken?.chain.chainId) === ChainIds.SOLANA) {
        const resp = getParamsForSolanaDestination(
          payToken as Token,
          getToken as Token,
          publicKey?.toString() as string,
          btcWalletAddress,
          tokenInAmount,
          !getToken?.unsupported,
          Number(getToken?.chain.chainId)
        );

        memoString = resp.memoString;
        amountInSatoshi = resp.amountInSatoshi;
        fromAddress = resp.fromAddress;
      }

      const BTC_TSS_ADDRESS = BTC_TSS_ZETA;
      const result = await (window as any).okxwallet.bitcoin.send({
        from: fromAddress,
        to: BTC_TSS_ADDRESS,
        value: Number(amountInSatoshi) / 10 ** 8,
        memo: `0x${memoString}`,
        memoPos: 1,
      });
      if (result && result.txhash) {
        const timeStamp = new Date().getTime();
        setLoading(false);
        useTransferStore.getState().setActiveTransactionHash(result.txhash);
        useAgentStore.getState().setActiveTransactionHashResponse({
          activeTransactionHash: result.txhash || "" ,
          query:activeChat,
          quote:activeResponse.quote,
          outputString:activeResponse.outputString
      })
        useTransferStore.getState().setActiveTransaction(
          {
            fromToken: payToken as Token,
            toToken: getToken as Token,
            estimatedTime: estimatedTime,
            hash: result.txhash,
            createdAt: timeStamp,
            status: "PENDING",
          },
          false
        );
        useAgentStore.setState({
          sendingTransaction:false
        })
        setTimeout(() => {
          useTransferStore.getState().handleOpenTransactionStatusModal();
        }, 200);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      handleToast(
        TRANSACTION_FAILED.heading,
        TRANSACTION_FAILED.subHeading,
        TOAST_TYPE.ERROR
      );
      useAgentStore.getState().setActiveTransactionHashResponse({
        activeTransactionHash:"An Error occured, Can I help You with Anything else?" ,
        query:activeChat,
        quote:activeResponse.quote,
        outputString:activeResponse.outputString
      })
      useAgentStore.setState({
        sendingTransaction:false
      })
      throw new Error(
        `Error in sending BTC Transactions using OKXBTC: ${error}`
      );
    }
  };

  /**
   * Function to call when xdefi is connected.
   */
  const sendBtcTransactionXDefi = () => {
    setLoading(true);
    let memoString, amountInSatoshi, fromAddress;

    const resp = getParamsXDefiTransfer(
      address,
      btcWalletAddress as string,
      Number(getToken?.chain.chainId),
      tokenInAmount,
      payToken as Token,
      getToken as Token,
      !getToken?.unsupported
    );

    memoString = resp.memoString;
    amountInSatoshi = resp.amountInSatoshi;
    fromAddress = resp.fromAddress;

    if (Number(getToken?.chain.chainId) === ChainIds.ZETACHAIN) {
      const resp = getParamsForZetachainDestination(
        getToken?.zrc20Address,
        address,
        btcWalletAddress,
        tokenInAmount,
        !getToken?.unsupported,
        Number(getToken?.chain.chainId),
        (payToken?.isUniV3Supported && getToken?.isUniV3Supported) as boolean
      );

      memoString = resp.memoString;
      amountInSatoshi = resp.amountInSatoshi;
      fromAddress = resp.fromAddress;
    } else if (Number(getToken?.chain.chainId) === ChainIds.SOLANA) {
      const resp = getParamsForSolanaDestination(
        payToken as Token,
        getToken as Token,
        publicKey?.toString() as string,
        btcWalletAddress,
        tokenInAmount,
        !getToken?.unsupported,
        Number(getToken?.chain.chainId)
      );

      memoString = resp.memoString;
      amountInSatoshi = resp.amountInSatoshi;
      fromAddress = resp.fromAddress;
    }

    const BTC_TSS_ADDRESS = BTC_TSS_ZETA;

    (window as any).xfi.bitcoin.request(
      {
        method: "transfer",
        params: [
          {
            feeRate: 10,
            from: fromAddress,
            recipient: BTC_TSS_ADDRESS,
            amount: {
              amount: parseInt(amountInSatoshi.toString()),
              decimals: 8,
            },
            memo: `hex::${memoString}`,
          },
        ],
      },
      responseBtcTransactionsXDefi
    );
  };

  /**
   * Function to call when unisat wallet is connected.
   */
  const handleSendUnisatTransaction = async () => {
    try {
      setLoading(true);
      /**
       * Generate memo string and txn data.
       */
      let memoString, amountInSatoshi, fromAddress;
      const resp = getParamsXDefiTransfer(
        address,
        btcWalletAddress as string,
        Number(getToken?.chain.chainId),
        tokenInAmount,
        payToken as Token,
        getToken as Token,
        !getToken?.unsupported
      );
      memoString = resp.memoString;
      amountInSatoshi = resp.amountInSatoshi;
      fromAddress = resp.fromAddress;
      if (Number(getToken?.chain.chainId) === ChainIds.ZETACHAIN) {
        const resp = getParamsForZetachainDestination(
          getToken?.zrc20Address,
          address,
          btcWalletAddress,
          tokenInAmount,
          !getToken?.unsupported,
          Number(getToken?.chain.chainId),
          (payToken?.isUniV3Supported && getToken?.isUniV3Supported) as boolean
        );

        memoString = resp.memoString;
        amountInSatoshi = resp.amountInSatoshi;
        fromAddress = resp.fromAddress;
      } else if (Number(getToken?.chain.chainId) === ChainIds.SOLANA) {
        const resp = getParamsForSolanaDestination(
          payToken as Token,
          getToken as Token,
          publicKey?.toString() as string,
          btcWalletAddress,
          tokenInAmount,
          !getToken?.unsupported,
          Number(getToken?.chain.chainId)
        );

        memoString = resp.memoString;
        amountInSatoshi = resp.amountInSatoshi;
        fromAddress = resp.fromAddress;
      }

      const BTC_TSS_ADDRESS = BTC_TSS_ZETA;
      await (window as any).unisat.requestAccounts();
      const memos = memoString && [memoString.toLowerCase()];
      const tx = await (window as any).unisat.sendBitcoin(
        BTC_TSS_ADDRESS,
        parseInt(amountInSatoshi.toString()),
        { memos }
      );
      if (tx) {
        setLoading(false);
        const timeStamp = new Date().getTime();
        useTransferStore.getState().setActiveTransactionHash(tx);
        useAgentStore.getState().setActiveTransactionHashResponse({
          activeTransactionHash: tx || "" ,
          query:activeChat,
          quote:activeResponse.quote,
          outputString:activeResponse.outputString
      })
        useTransferStore.getState().setActiveTransaction(
          {
            fromToken: payToken as Token,
            toToken: getToken as Token,
            estimatedTime: estimatedTime,
            hash: tx,
            createdAt: timeStamp,
            status: "PENDING",
          },
          false
        );
        useAgentStore.setState({
          sendingTransaction:false
        })
        setTimeout(() => {
          useTransferStore.getState().handleOpenTransactionStatusModal();
        }, 200);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      handleToast(
        TRANSACTION_REJECTED_BTC.heading,
        TRANSACTION_REJECTED_BTC.subHeading,
        TOAST_TYPE.ERROR
      );
      useAgentStore.getState().setActiveTransactionHashResponse({
        activeTransactionHash:"An Error occured, Can I help You with Anything else?" ,
        query:activeChat,
        quote:activeResponse.quote,
        outputString:activeResponse.outputString
      })
      useAgentStore.setState({
        sendingTransaction:false
      })
      throw new Error(
        `Error in sending BTC Transactions using Unisat Wallet: ${error}`
      );
    }
  };

  const sendBTCTransaction = (id: string) => {
    if (id === BTC_WALLET_IDS.XDEFI) {
      sendBtcTransactionXDefi();
    } else if (id === BTC_WALLET_IDS.OKX) {
      sendOKXBTCTransaction();
    } else if (id === BTC_WALLET_IDS.UNISAT) {
      handleSendUnisatTransaction();
    } else {
      throw new Error("Bitcoin wallet not supported");
    }
  };

  return { sendBTCTransaction, loading, setLoading };
};

export default useSendBTCTransaction;
