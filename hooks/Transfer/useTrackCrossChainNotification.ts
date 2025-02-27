import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useTransferStore from "@/store/transfer-store";
interface Props {
  transactionHash: string | undefined;
  payChain: number;
  getChain: number;
  allowFetch: boolean;
}

const useTrackCrossChainNotification = ({
  transactionHash,
  allowFetch,
  payChain,
  getChain,
}: Props) => {
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (!transactionHash || payChain === getChain) {
      //   console.log("Skipping connection due to missing dependencies.");
      return;
    }

    // console.log("Establishing socket connection...");

    const socketConnection = io(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}track-bridge-tx`,
      {
        transports: ["websocket"], // Force WebSocket transport
        reconnectionAttempts: 3, // Limit reconnection attempts
      }
    );

    socketConnection.on("connect", () => {
      //   console.log(
      //     "Socket connected successfully from notification:",
      //     socketConnection.id
      //   );

      socketConnection.emit("startTracking", {
        sourceChainHash: transactionHash,
        sourceChainId: payChain.toString(),
        destinationChainId: getChain.toString(),
      });

      //   console.log(
      //     "Tracking initiated for hash from notification:",
      //     transactionHash
      //   );
    });

    socketConnection.on("connect_error", (error) => {
      console.error("Socket connection error from notification:", error);
    });

    socketConnection.on("disconnect", (reason) => {
      reason;
    });

    socketConnection.on("transactionComplete", (data) => {
      setStatus(data.status);
      socketConnection.disconnect();
    });

    if (!allowFetch) {
      //   console.log(
      //     "Disallowing fetch,from notification disconnecting socket..."
      //   );
      socketConnection.disconnect();
    }

    return () => {
      //   console.log("Cleaning up socket from notification connection...");
      socketConnection.disconnect();
    };
  }, [transactionHash, payChain, getChain, allowFetch]);

  return {
    status,
  };
};

export default useTrackCrossChainNotification;
