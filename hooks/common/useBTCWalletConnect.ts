import { useEffect, useRef, useState } from "react";
import useWalletConnectStore from "@/store/wallet-store";
import useBTCWalletValidation from "../Transfer/useBTCWalletValidation";
import useHandleToast from "./useHandleToast";

import {
  AddressPurpose,
  BitcoinNetworkType,
  RpcErrorCode,
  getAddress,
  request,
} from "sats-connect";
import { INVALID_BTC_ADDRESS } from "@/utils/toasts";
import { BTC_WALLET_IDS, TOAST_TYPE } from "@/utils/enums";
import {
  BITCOIN_NETWORK,
  UNISAT_BITCOIN_MAINNET,
  XDEFI_BITCOIN_MAINNET,
} from "@/utils/wallets";

const useBTCWalletConnect = () => {
  const [networksStatus, setNetworkStatus] = useState<boolean>(true);
  const {
    handleSetBtcAddress,
    handleSetBtcWalletLogo,
    handleSetBtcWalletId,
    btcWalletId,
  } = useWalletConnectStore();
  const { getBTCValidation } = useBTCWalletValidation();
  const { handleToast } = useHandleToast();

  const fetchNetworkStatus = async () => {
    getNetworkStatus().then((res) => {
      setNetworkStatus(res);
    });
  };

  const handleChainChanged = () => {
    fetchNetworkStatus();
  };

  const handleChainChangedRef = useRef<() => void>(handleChainChanged);
  const fetchNetworkStatusRef = useRef<() => Promise<void>>(fetchNetworkStatus);

  useEffect(() => {
    if (btcWalletId) {
      fetchNetworkStatusRef.current();
    }
  }, [btcWalletId, fetchNetworkStatusRef]);

  useEffect(() => {
    /**
     * add event to capture chain change in unisat.
     * @returns Event for unisat wallet
     */
    async function checkUnisat() {
      let unisat = (window as any).unisat;

      for (let i = 1; i < 10 && !unisat; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 100 * i));
        unisat = (window as any).unisat;
      }
      if (unisat) {
        unisat.on("chainChanged", handleChainChangedRef.current);
      }
      return () => {
        unisat.removeListener("chainChanged", handleChainChangedRef.current);
      };
    }

    checkUnisat().then();
  }, []);

  const handleXDefiBTCWalletConnect = async (
    logo: string,
    id: string,
    callBackFn: () => void
  ) => {
    if (!((window as any).xfi && (window as any).xfi.bitcoin)) {
      window.open("https://go.xdefi.io/eddyfinance", "_blank");
      return;
    }
    try {
      (window as any).xfi.bitcoin.request(
        { method: "request_accounts", params: [] },
        (error: any, accounts: any) => {
          if (error) {
          } else {
            const paymentAddress = accounts[0];
            handleSetBtcAddress(paymentAddress);
            handleSetBtcWalletLogo(logo);
            handleSetBtcWalletId(id);
            callBackFn();
          }
        }
      );
    } catch (error) {}
  };

  const handleOKXWalletConnect = async (
    logo: string,
    id: string,
    callBackFn: () => void
  ) => {
    // console.log(window.okxwallet);
    if (!(typeof (window as any).okxwallet !== "undefined")) {
      window.open("https://www.okx.com/web3", "_blank");
      return;
    }
    try {
      const result = await (window as any).okxwallet.bitcoin.connect();
      await getBTCValidation({
        variables: {
          address: result.address,
        },
      })
        .then((res) => {
          if (res && res.data && res.data.getValidationForBitcoinAddress) {
            if (!res.data.getValidationForBitcoinAddress.isValid) {
              handleToast(
                INVALID_BTC_ADDRESS.heading,
                INVALID_BTC_ADDRESS.subHeading,
                TOAST_TYPE.ERROR
              );
              callBackFn();
            } else {
              handleSetBtcAddress(result.address);
              handleSetBtcWalletLogo(logo);
              handleSetBtcWalletId(id);
              callBackFn();
            }
          }
        })
        .catch((error) => {});
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnisatWalletConnect = async (
    logo: string,
    id: string,
    callBackFn: () => void
  ) => {
    // console.log(window.okxwallet);
    if (!(typeof (window as any).unisat !== "undefined")) {
      window.open("https://unisat.io/", "_blank");
      return;
    }
    try {
      const unisat = (window as any).unisat;
      const result = await unisat.requestAccounts();
      if (result.length > 0) {
        await getBTCValidation({
          variables: {
            address: result[0],
          },
        })
          .then((res) => {
            if (res && res.data && res.data.getValidationForBitcoinAddress) {
              if (!res.data.getValidationForBitcoinAddress.isValid) {
                handleToast(
                  INVALID_BTC_ADDRESS.heading,
                  INVALID_BTC_ADDRESS.subHeading,
                  TOAST_TYPE.ERROR
                );
                callBackFn();
              } else {
                handleSetBtcAddress(result[0]);
                handleSetBtcWalletLogo(logo);
                handleSetBtcWalletId(id);
                callBackFn();
              }
            }
          })
          .catch((error) => {});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleXverseWalletConnect = async (
    logo: string,
    id: string,
    callBackFn: () => void
  ) => {
    try {
      getAddress({
        payload: {
          purposes: [
            AddressPurpose.Stacks,
            AddressPurpose.Payment,
            AddressPurpose.Ordinals,
          ],
          message: "My awesome dapp needs your address info",
          network: {
            type: BitcoinNetworkType.Mainnet,
          },
        },
        onFinish: (response) => {
          // handleSetBtcAddress(result[0]);
          // handleSetBtcWalletLogo(logo);
          // handleSetBtcWalletId(id);
          // callBackFn();
        },
        onCancel: () => {
          alert("User cancelled the request");
        },
      });
    } catch (err) {}
  };

  const handleBTCWalletConnect = (
    id: string,
    logo: string,
    callBackFn: () => void
  ) => {
    if (id === BTC_WALLET_IDS.XDEFI) {
      handleXDefiBTCWalletConnect(logo, id, callBackFn);
    } else if (id === BTC_WALLET_IDS.OKX) {
      handleOKXWalletConnect(logo, id, callBackFn);
    } else if (id === BTC_WALLET_IDS.UNISAT) {
      handleUnisatWalletConnect(logo, id, callBackFn);
    } else if (id === BTC_WALLET_IDS.XVERSE) {
      handleXverseWalletConnect(logo, id, callBackFn);
    }
  };

  const getNetworkStatus = async () => {
    if (!useWalletConnectStore.getState().btcWalletId) return;
    if (useWalletConnectStore.getState().btcWalletId === BTC_WALLET_IDS.XDEFI) {
      return (
        (window as any).xfi.bitcoin &&
        (window as any).xfi.bitcoin.network === XDEFI_BITCOIN_MAINNET
      );
    } else if (
      useWalletConnectStore.getState().btcWalletId === BTC_WALLET_IDS.OKX
    ) {
      const res = await (window as any).okxwallet.bitcoin.getNetwork();
      return true;
    } else if (
      useWalletConnectStore.getState().btcWalletId === BTC_WALLET_IDS.UNISAT
    ) {
      const res = await (window as any).unisat.getChain();
      return (
        res.network === BITCOIN_NETWORK && res.enum === UNISAT_BITCOIN_MAINNET
      );
    }
  };

  const handleChangeBTCNetwork = async (id: string) => {
    if (!id) return;
    if (id === BTC_WALLET_IDS.XDEFI) {
      (window as any).xfi.bitcoin.changeNetwork(XDEFI_BITCOIN_MAINNET);
    } else if (id === BTC_WALLET_IDS.OKX) {
      (window as any).okxwallet.bitcoin.switchNetwork(BITCOIN_NETWORK);
    } else if (id === BTC_WALLET_IDS.UNISAT) {
      (window as any).unisat.switchChain(UNISAT_BITCOIN_MAINNET).then(() => {
        setNetworkStatus(true);
      });
    }
  };

  return {
    handleXDefiBTCWalletConnect,
    handleOKXWalletConnect,
    handleBTCWalletConnect,
    getNetworkStatus,
    handleChangeBTCNetwork,
    networksStatus,
  };
};

export default useBTCWalletConnect;
