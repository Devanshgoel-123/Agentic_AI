import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import {
  ActiveTransaction,
  ActiveTransactionDust,
  ChainStatus,
} from "@/store/types/transaction-type";
import { STATUS_CODES } from "@/utils/enums";

interface Props {
  transactionHash: string | undefined;
  payChain: number;
  getChain: number;
  allowFetch: boolean;
  activeTransaction: ActiveTransactionDust | undefined | ActiveTransaction;
}

const useTrackCrossChain = ({
  transactionHash,
  allowFetch,
  payChain,
  getChain,
  activeTransaction,
}: Props) => {
  const [sourceStatus, setSourceStatus] = useState<ChainStatus | null>(null);
  const [destinationStatus, setDestinationStatus] =
    useState<ChainStatus | null>(null);
  const [zetaChainStatus, setZetaChainStatus] = useState<ChainStatus | null>(
    null
  );
  const [status, setStatus] = useState<string>("");
  const [srcChainHash, setSrcChainHash] = useState<string>("");
  const [zetaChainHash, setZetaChainHash] = useState<string>("");
  const [destinationChainHash, setDestinationChainHash] = useState<string>("");

  useEffect(() => {
    if (!transactionHash || payChain === getChain || !activeTransaction) {
      console.log("Skipping connection due to missing dependencies.");
      return;
    }

    console.log("Establishing socket connection...");

    const socketConnection = io(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}track-bridge-tx`,
      {
        transports: ["websocket"], // Force WebSocket transport
        reconnectionAttempts: 3, // Limit reconnection attempts
      }
    );

    socketConnection.on("connect", () => {
      console.log("Socket connected successfully:", socketConnection.id);

      socketConnection.emit("startTracking", {
        sourceChainHash: transactionHash,
        sourceChainId: payChain.toString(),
        destinationChainId: getChain.toString(),
      });

      console.log("Tracking initiated for hash:", transactionHash);
    });

    socketConnection.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socketConnection.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socketConnection.on("sourceChainStatus", (data) => {
      console.log(data, "sourceChainStatus");
      if (data) {
        if (
          data.status === STATUS_CODES.FAILED ||
          zetaChainStatus?.status === STATUS_CODES.FAILED ||
          destinationStatus?.status === STATUS_CODES.FAILED ||
          status === STATUS_CODES.FAILED
        ) {
          setStatus(data.status);
          setSourceStatus({
            blockConfirmations: data.blockConfirmations,
            sourceChainHash: data.sourceChainHash,
            status: data.status,
            totalConfirmationBlocks: data.totalConfirmationBlocks,
            zetaChainHash: data.zetaChainHash,
          });
          socketConnection.disconnect();
        } else {
          setSourceStatus({
            blockConfirmations: data.blockConfirmations,
            sourceChainHash: data.sourceChainHash,
            status: data.status,
            totalConfirmationBlocks: data.totalConfirmationBlocks,
            zetaChainHash: data.zetaChainHash,
          });
        }
      }
    });

    socketConnection.on("zetaChainStatus", (data) => {
      console.log(data, "zetaChainStatus");
      if (data) {
        if (
          data.status === STATUS_CODES.FAILED ||
          sourceStatus?.status === STATUS_CODES.FAILED ||
          destinationStatus?.status === STATUS_CODES.FAILED ||
          status === STATUS_CODES.FAILED
        ) {
          setStatus(data.status);
          setZetaChainStatus({
            blockConfirmations: data.blockConfirmations,
            status: data.status,
            totalConfirmationBlocks: data.totalConfirmationBlocks,
            sourceChainHash: data.sourceChainHash,
            zetaChainHash: data.zetaChainHash,
          });
          socketConnection.disconnect();
        } else {
          setZetaChainStatus({
            blockConfirmations: data.blockConfirmations,
            status: data.status,
            totalConfirmationBlocks: data.totalConfirmationBlocks,
            sourceChainHash: data.sourceChainHash,
            zetaChainHash: data.zetaChainHash,
          });
        }
      }
    });

    socketConnection.on("destinationChainStatus", (data) => {
      console.log(data, "destinationChainStatus");
      if (data) {
        if (
          data.status === STATUS_CODES.FAILED ||
          sourceStatus?.status === STATUS_CODES.FAILED ||
          zetaChainStatus?.status === STATUS_CODES.FAILED ||
          status === STATUS_CODES.FAILED
        ) {
          setStatus(data.status);
          setDestinationStatus({
            blockConfirmations: data.blockConfirmations,
            status: data.status,
            totalConfirmationBlocks: data.totalConfirmationBlocks,
            destinationChainHash: data.destinationChainHash,
            sourceChainHash: data.sourceChainHash,
            zetaChainHash: data.zetaChainHash,
          });
          socketConnection.disconnect();
        } else {
          setDestinationStatus({
            blockConfirmations: data.blockConfirmations,
            status: data.status,
            totalConfirmationBlocks: data.totalConfirmationBlocks,
            destinationChainHash: data.destinationChainHash,
            sourceChainHash: data.sourceChainHash,
            zetaChainHash: data.zetaChainHash,
          });
        }
      }
    });

    socketConnection.on("transactionComplete", (data) => {
      console.log(data, "transactionComplete");
      setStatus(data.status);
      setDestinationStatus(data.status);
      setSrcChainHash(data.sourceChainHash);
      setZetaChainHash(data.zetaChainHash);
      setDestinationChainHash(data.destinationChainHash);
      socketConnection.disconnect();
    });

    if (!allowFetch) {
      console.log("Disallowing fetch, disconnecting socket...");
      socketConnection.disconnect();
    }

    return () => {
      console.log("Cleaning up socket connection...");
      socketConnection.disconnect();
    };
  }, [transactionHash, activeTransaction, payChain, getChain, allowFetch]);

  return {
    sourceStatus,
    destinationStatus,
    status,
    zetaChainStatus,
    srcChainHash,
    destinationChainHash,
    zetaChainHash,
  };
};

export default useTrackCrossChain;
