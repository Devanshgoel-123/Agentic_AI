import { useLazyQuery, useQuery } from "@apollo/client";
import useWalletConnectStore from "@/store/wallet-store";
import useHandleToast from "../common/useHandleToast";
import { useEffect, useRef } from "react";
import { GET_BTC_WALLET_VALIDATION } from "@/components/graphql/queries/getBTCWalletValidation";
import { INVALID_BTC_ADDRESS } from "@/utils/toasts";
import { TOAST_TYPE } from "@/utils/enums";

const useBTCWalletValidation = () => {
  const { handleToast } = useHandleToast();
  const [getBTCValidation] = useLazyQuery(GET_BTC_WALLET_VALIDATION);
  const { loading, error, data } = useQuery(GET_BTC_WALLET_VALIDATION, {
    variables: {
      address: useWalletConnectStore.getState().destinationAddress,
    },
    skip:
      !useWalletConnectStore.getState().destinationAddress ||
      useWalletConnectStore.getState().destinationAddress?.length === 0,
  });

  const handleToastRef =
    useRef<
      (
        heading: string,
        subHeading: string,
        type: string,
        hash?: string | undefined,
        chainId?: number | undefined
      ) => void
    >(handleToast);

  useEffect(() => {
    if (data && data.getValidationForBitcoinAddress) {
      if (!data.getValidationForBitcoinAddress.isValid) {
        handleToastRef.current(
          INVALID_BTC_ADDRESS.heading,
          INVALID_BTC_ADDRESS.subHeading,
          TOAST_TYPE.ERROR
        );
      }
    }
  }, [data]);

  return {
    loading,
    error,
    isValid: data && (data.getValidationForBitcoinAddress.isValid ?? undefined),
    getBTCValidation,
  };
};

export default useBTCWalletValidation;
