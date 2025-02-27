import { TOAST_NAMES } from "@/utils/enums";
import useMediaQuery from "@mui/material/useMediaQuery"
import { enqueueSnackbar } from "notistack";

const useHandleToast = () => {
  const mobileDevice = useMediaQuery("(max-width: 600px)");

  const handleToast = (
    heading: string,
    subHeading: string,
    type: string,
    hash?: string,
    chainId?: number
  ) => {
    if (mobileDevice) {
      enqueueSnackbar(heading, {
        //@ts-ignore
        variant: TOAST_NAMES.CUSTOM,
        type: type,
        subHeading: subHeading,
        hash: hash,
        chain: chainId,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    } else {
      enqueueSnackbar(heading, {
        //@ts-ignore
        variant: TOAST_NAMES.CUSTOM,
        type: type,
        subHeading: subHeading,
        hash: hash,
        chain: chainId,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    }
  };

  return { handleToast };
};

export default useHandleToast;
