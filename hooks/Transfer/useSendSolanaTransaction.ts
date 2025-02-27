import { useEffect, useState } from "react";
import useTransferStore from "@/store/transfer-store";
import { useShallow } from "zustand/react/shallow";
import { useAccount } from "wagmi";

import {
  useWallet,
  useConnection,
  useAnchorWallet,
  AnchorWallet,
} from "@solana/wallet-adapter-react";
import useHandleToast from "../common/useHandleToast";
import useWalletConnectStore from "@/store/wallet-store";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { ethers } from "v5n";
import { ethers as Ethers } from "ethers";
import * as anchor from "@coral-xyz/anchor";
import { GatewayIDL } from "./target/gatewayidl";
import { BN } from "@coral-xyz/anchor";
import { convertUIFormatToBigInt } from "@/utils/number";
import { Token } from "@/store/types/token-type";
import { ChainIds, TOAST_TYPE } from "@/utils/enums";
import { CONNECT_WALLET_TOAST, TRANSACTION_FAILED } from "@/utils/toasts";
import {
  OMNI_CHAIN_CONTRACT_ANY_CHAIN,
  OMNI_CHAIN_CONTRACT_ZETACHAIN,
  getEncodedBitcoinWalletAddress,
} from "@/utils/constants";
import * as spl from "@solana/spl-token";
import { useAgentStore } from "@/store/agent-store";

interface Props {
  callBackFn: () => void;
}
const SEED = "meta";

const useSendSolanaTransaction = ({ callBackFn }: Props) => {
  const { address } = useAccount();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [program, setProgram] = useState<anchor.Program>();
  const { connection } = useConnection();
  const { btcWalletAddress } = useWalletConnectStore();
  const wallet = useAnchorWallet();
  const { handleToast } = useHandleToast();

  useEffect(() => {
    let provider: anchor.Provider;

    try {
      provider = anchor.getProvider();
    } catch {
      provider = new anchor.AnchorProvider(
        connection,
        wallet as AnchorWallet,
        {}
      );
      anchor.setProvider(provider);
    }
    //@ts-ignore
    const program = new anchor.Program(GatewayIDL) as anchor.Program;
    setProgram(program);
  }, []);

  const {
    activeChat,
    activeResponse
  }=useAgentStore(useShallow((state)=>({
    activeChat:state.activeChat,
    activeResponse:state.activeResponse
  })))
  const { payToken, getToken, tokenInAmount, estimatedTime } = useTransferStore(
    useShallow((state) => ({
      payToken: state.payToken,
      getToken: state.getToken,
      tokenInAmount: state.tokenInAmount,
      estimatedTime: state.estimatedTime,
    }))
  );

  const depositSPL = async () => {
    if (!publicKey) {
      handleToast(
        CONNECT_WALLET_TOAST.heading,
        CONNECT_WALLET_TOAST.subHeading,
        TOAST_TYPE.INFO
      );
      return;
    }
    try {
      setLoading(true);
      const connection = new Connection(
        "https://solana-mainnet.g.alchemy.com/v2/swQALCkRQkrbnQV48o9SrPOdLp9H3Ijs",
        "confirmed"
      );
      const fromWallet = Keypair.generate();

      const seeds = [Buffer.from(SEED, "utf-8")];
      const [pdaAccount] = await PublicKey.findProgramAddressSync(
        seeds,
        program?.programId as PublicKey
      );
      const USDC_MINT_ADDRESS = new PublicKey(payToken?.address as string);

      const pdaAta = await spl.getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        USDC_MINT_ADDRESS,
        pdaAccount,
        true
      );
      let walletAta = await spl.getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        USDC_MINT_ADDRESS,
        publicKey
      );
      const depositAmount = convertUIFormatToBigInt(
        tokenInAmount,
        payToken?.decimal as number
      );
      const senderEvmAddr = address;
      const targetZrc = getToken?.zrc20Address;
      const omniChainContractAddress = OMNI_CHAIN_CONTRACT_ZETACHAIN;

      const receiver = Buffer.from(
        ethers.utils.arrayify(omniChainContractAddress)
      );
      const isUniv3Swap =
        payToken?.isUniV3Supported && getToken?.isUniV3Supported;
      const boolV3 = isUniv3Swap ? "01" : "00";
      const memo = Buffer.from(
        ethers.utils.arrayify(
          (senderEvmAddr as string) + targetZrc?.replace(/^0x/, "") + boolV3
        )
      );
      console.log("Deposit Amount:", depositAmount);
      console.log("Receiver:", receiver.toString("hex"));
      console.log("Memo:", memo.toString("hex"));
      const tx = await program?.methods
        .depositSplTokenAndCall(new BN(depositAmount), receiver, memo)
        .accounts({
          mintAccount: USDC_MINT_ADDRESS, // ✅ USDC Mint
          from: walletAta.address, // ✅ Source wallet token account
          to: pdaAta.address, // ✅ Destination PDA token account
        })
        .transaction();
      if (tx instanceof Transaction) {
        const transactionSignature = await sendTransaction(tx, connection);
        const timeStamp = new Date().getTime();
        setLoading(false);
        useTransferStore
          .getState()
          .setActiveTransactionHash(transactionSignature);
        useTransferStore.getState().setActiveTransaction(
          {
            fromToken: payToken as Token,
            toToken: getToken as Token,
            estimatedTime: estimatedTime,
            hash: transactionSignature,
            createdAt: timeStamp,
            status: "PENDING",
          },
          false
        );
        useAgentStore.getState().setActiveTransactionHashResponse({
          activeTransactionHash:transactionSignature ,
          query:activeChat,
          quote:activeResponse.quote,
          outputString:activeResponse.outputString
        })
        useAgentStore.setState({
          sendingTransaction:false
        })
        setTimeout(() => {
          useTransferStore.getState().handleOpenTransactionStatusModal();
        }, 200);
        // console.log("Transaction successful:", transactionSignature);
      } else {
        // console.error("Invalid transaction object:", tx);
      }
    } catch (error) {
      console.error("Deposit failed:", error);
      handleToast(
        TRANSACTION_FAILED.heading,
        TRANSACTION_FAILED.subHeading,
        TOAST_TYPE.ERROR
      );
      useAgentStore.getState().setActiveTransactionHashResponse({
        activeTransactionHash:"User Rejected the Request, Can I help You with Anything else?" ,
        query:activeChat,
        quote:activeResponse.quote,
        outputString:activeResponse.outputString
      })
      useAgentStore.setState({
        sendingTransaction:false
      })
    } finally {
      setLoading(false);
      callBackFn();
    }
  };

  const depositSPLAnyChain = async () => {
    if (!publicKey) {
      handleToast(
        CONNECT_WALLET_TOAST.heading,
        CONNECT_WALLET_TOAST.subHeading,
        TOAST_TYPE.INFO
      );
      return;
    }
    try {
      setLoading(true);
      const connection = new Connection(
        "https://solana-mainnet.g.alchemy.com/v2/swQALCkRQkrbnQV48o9SrPOdLp9H3Ijs",
        "confirmed"
      );
      const fromWallet = Keypair.generate();

      const seeds = [Buffer.from(SEED, "utf-8")];
      const [pdaAccount] = await PublicKey.findProgramAddressSync(
        seeds,
        program?.programId as PublicKey
      );
      const USDC_MINT_ADDRESS = new PublicKey(payToken?.address as string);

      const pdaAta = await spl.getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        USDC_MINT_ADDRESS,
        pdaAccount,
        true
      );
      let walletAta = await spl.getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        USDC_MINT_ADDRESS,
        publicKey
      );
      const depositAmount = convertUIFormatToBigInt(
        tokenInAmount,
        payToken?.decimal as number
      );
      const senderEvmAddr = address;
      const targetZrc = getToken?.zrc20Address;
      const omniChainContractAddress = OMNI_CHAIN_CONTRACT_ANY_CHAIN;

      const receiver = Buffer.from(
        ethers.utils.arrayify(omniChainContractAddress)
      );
      const isUniv3Swap =
        payToken?.isUniV3Supported && getToken?.isUniV3Supported;
      const boolV3 = isUniv3Swap ? "01" : "00";
      const byte = Ethers.AbiCoder.defaultAbiCoder().encode(["bool"], [true]);

      const memoString =
        getToken?.chain.chainId === ChainIds.BITCOIN
          ? "0x" +
            Number(getToken.chain.chainId).toString(16).padStart(8, "0") +
            targetZrc?.replace(/^0x/, "") +
            getEncodedBitcoinWalletAddress(btcWalletAddress as string).replace(
              /^0x/,
              ""
            ) +
            byte.substring(2) +
            boolV3
          : "0x" +
            Number(getToken?.chain.chainId).toString(16).padStart(8, "0") +
            targetZrc?.replace(/^0x/, "") +
            senderEvmAddr?.replace(/^0x/, "") +
            byte.substring(2) +
            boolV3;
      // Fix memo conversion
      const memo = Buffer.from(ethers.utils.arrayify(memoString));
      console.log("Deposit Amount:", depositAmount);
      console.log("Receiver:", receiver.toString("hex"));
      console.log("Memo:", memo.toString("hex"));
      const tx = await program?.methods
        .depositSplTokenAndCall(new BN(depositAmount), receiver, memo)
        .accounts({
          mintAccount: USDC_MINT_ADDRESS, // ✅ USDC Mint
          from: walletAta.address, // ✅ Source wallet token account
          to: pdaAta.address, // ✅ Destination PDA token account
        })
        .transaction();
      if (tx instanceof Transaction) {
        const transactionSignature = await sendTransaction(tx, connection);
        const timeStamp = new Date().getTime();
        setLoading(false);
        useTransferStore
          .getState()
          .setActiveTransactionHash(transactionSignature);
        useTransferStore.getState().setActiveTransaction(
          {
            fromToken: payToken as Token,
            toToken: getToken as Token,
            estimatedTime: estimatedTime,
            hash: transactionSignature,
            createdAt: timeStamp,
            status: "PENDING",
          },
          false
        );
        useAgentStore.getState().setActiveTransactionHashResponse({
          activeTransactionHash:transactionSignature ,
          query:activeChat,
          quote:activeResponse.quote,
          outputString:activeResponse.outputString
        })
        useAgentStore.setState({
          sendingTransaction:false
        })
        setTimeout(() => {
          useTransferStore.getState().handleOpenTransactionStatusModal();
        }, 200);
        // console.log("Transaction successful:", transactionSignature);
      } else {
        // console.error("Invalid transaction object:", tx);
      }
    } catch (error) {
      console.error("Deposit failed:", error);
      handleToast(
        TRANSACTION_FAILED.heading,
        TRANSACTION_FAILED.subHeading,
        TOAST_TYPE.ERROR
      );
      useAgentStore.getState().setActiveTransactionHashResponse({
        activeTransactionHash:"Some Error has occured, Can I help You with Anything else?" ,
        query:activeChat,
        quote:activeResponse.quote,
        outputString:activeResponse.outputString
      })
      useAgentStore.setState({
        sendingTransaction:false
      })
    } finally {
      setLoading(false);
      callBackFn();
    }
  };

  const depositSOL = async () => {
    if (!publicKey) {
      handleToast(
        CONNECT_WALLET_TOAST.heading,
        CONNECT_WALLET_TOAST.subHeading,
        TOAST_TYPE.INFO
      );
      return;
    }

    try {
      setLoading(true);

      const omniChainContractAddress = OMNI_CHAIN_CONTRACT_ZETACHAIN;
      const senderEvmAddr = address as string;
      const targetZrc = getToken?.zrc20Address;

      if (!targetZrc) {
        throw new Error("targetZrc is undefined!");
      }

      const isUniv3Swap =
        payToken?.isUniV3Supported && getToken?.isUniV3Supported;
      const boolV3 = isUniv3Swap ? "01" : "00";

      // Fix receiver conversion
      const receiver = Buffer.from(
        ethers.utils.arrayify(omniChainContractAddress)
      );

      // Fix memo conversion
      const memo = Buffer.from(
        ethers.utils.arrayify(
          senderEvmAddr + targetZrc.replace(/^0x/, "") + boolV3
        )
      );

      // Fix BN conversion
      const depositAmount = convertUIFormatToBigInt(
        tokenInAmount,
        payToken?.decimal as number
      );

      // console.log("Deposit Amount:", depositAmount);
      // console.log("Receiver:", receiver.toString("hex"));
      // console.log("Memo:", memo.toString("hex"));

      // Execute transaction
      const tx = await program?.methods
        .depositAndCall(new BN(depositAmount), receiver, memo)
        .accounts({
          signer: publicKey,
        })
        .transaction();

      if (tx instanceof Transaction) {
        const transactionSignature = await sendTransaction(tx, connection);
        const timeStamp = new Date().getTime();
        setLoading(false);
        useTransferStore
          .getState()
          .setActiveTransactionHash(transactionSignature);
        useTransferStore.getState().setActiveTransaction(
          {
            fromToken: payToken as Token,
            toToken: getToken as Token,
            estimatedTime: estimatedTime,
            hash: transactionSignature,
            createdAt: timeStamp,
            status: "PENDING",
          },
          false
        );
        useAgentStore.getState().setActiveTransactionHashResponse({
          activeTransactionHash:transactionSignature,
          query:activeChat,
          quote:activeResponse.quote,
          outputString:activeResponse.outputString
        })
        useAgentStore.setState({
          sendingTransaction:false
        })
        setTimeout(() => {
          useTransferStore.getState().handleOpenTransactionStatusModal();
        }, 200);
        // console.log("Transaction successful:", transactionSignature);
      } else {
        // console.error("Invalid transaction object:", tx);
      }
    } catch (error) {
      console.error("Deposit failed:", error);
      handleToast(
        TRANSACTION_FAILED.heading,
        TRANSACTION_FAILED.subHeading,
        TOAST_TYPE.ERROR
      );
      useAgentStore.getState().setActiveTransactionHashResponse({
        activeTransactionHash:"Some Error has occured, Can I help You with Anything else?" ,
        query:activeChat,
        quote:activeResponse.quote,
        outputString:activeResponse.outputString
      })
      useAgentStore.setState({
        sendingTransaction:false
      })
    } finally {
      setLoading(false);
      callBackFn();
    }
  };

  const depositSOLToAnyChain = async () => {
    if (!publicKey) {
      handleToast(
        CONNECT_WALLET_TOAST.heading,
        CONNECT_WALLET_TOAST.subHeading,
        TOAST_TYPE.INFO
      );
      return;
      return;
    }

    try {
      setLoading(true);

      const omniChainContractAddress = OMNI_CHAIN_CONTRACT_ANY_CHAIN;
      const senderEvmAddr = address as string;
      const targetZrc = getToken?.zrc20Address;

      if (!targetZrc) {
        throw new Error("targetZrc is undefined!");
      }

      // Fix receiver conversion
      const receiver = Buffer.from(
        ethers.utils.arrayify(omniChainContractAddress)
      );

      const isUniv3Swap =
        payToken?.isUniV3Supported && getToken?.isUniV3Supported;
      const boolV3 = isUniv3Swap ? "01" : "00";
      const byte = Ethers.AbiCoder.defaultAbiCoder().encode(["bool"], [true]);

      const memoString =
        getToken.chain.chainId === ChainIds.BITCOIN
          ? "0x" +
            Number(getToken.chain.chainId).toString(16).padStart(8, "0") +
            targetZrc.replace(/^0x/, "") +
            getEncodedBitcoinWalletAddress(btcWalletAddress as string).replace(
              /^0x/,
              ""
            ) +
            byte.substring(2) +
            boolV3
          : "0x" +
            Number(getToken.chain.chainId).toString(16).padStart(8, "0") +
            targetZrc.replace(/^0x/, "") +
            senderEvmAddr.replace(/^0x/, "") +
            byte.substring(2) +
            boolV3;

      // Fix memo conversion
      const memo = Buffer.from(ethers.utils.arrayify(memoString));

      // Fix BN conversion
      const depositAmount = convertUIFormatToBigInt(
        tokenInAmount,
        payToken?.decimal as number
      );

      // console.log("Deposit Amount:", depositAmount);
      // console.log("Receiver:", receiver.toString("hex"));
      // console.log("Memo:", memo.toString("hex"));

      // Execute transaction
      const tx = await program?.methods
        .depositAndCall(new BN(depositAmount), receiver, memo)
        .accounts({
          signer: publicKey,
        })
        .transaction();

      if (tx instanceof Transaction) {
        const transactionSignature = await sendTransaction(tx, connection);
        const timeStamp = new Date().getTime();
        setLoading(false);
        useTransferStore
          .getState()
          .setActiveTransactionHash(transactionSignature);
        useTransferStore.getState().setActiveTransaction(
          {
            fromToken: payToken as Token,
            toToken: getToken as Token,
            estimatedTime: estimatedTime,
            hash: transactionSignature,
            createdAt: timeStamp,
            status: "PENDING",
          },
          false
        );
        useAgentStore.getState().setActiveTransactionHashResponse({
          activeTransactionHash:transactionSignature,
          query:activeChat,
          quote:activeResponse.quote,
          outputString:activeResponse.outputString
        })
        useAgentStore.setState({
          sendingTransaction:false
        })
        setTimeout(() => {
          useTransferStore.getState().handleOpenTransactionStatusModal();
        }, 200);
        // console.log("Transaction successful:", transactionSignature);
      } else {
        // console.error("Invalid transaction object:", tx);
      }
    } catch (error) {
      console.error("Deposit failed:", error);
      handleToast(
        TRANSACTION_FAILED.heading,
        TRANSACTION_FAILED.subHeading,
        TOAST_TYPE.ERROR
      );
      useAgentStore.getState().setActiveTransactionHashResponse({
        activeTransactionHash:"User Rejected the Request, Can I help You with Anything else?" ,
        query:activeChat,
        quote:activeResponse.quote,
        outputString:activeResponse.outputString
      })
      useAgentStore.setState({
        sendingTransaction:false
      })
    } finally {
      setLoading(false);
      callBackFn();
    }
  };

  return {
    depositSOL,
    depositSPL,
    depositSOLToAnyChain,
    depositSPLAnyChain,
    loading,
  };
};

export default useSendSolanaTransaction;
