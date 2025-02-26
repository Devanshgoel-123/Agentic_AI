import React from "react";
import "./styles.scss";

import { useBoolean } from "usehooks-ts";
import useUniV2Store from "@/store/univ2-store";
import { useShallow } from "zustand/react/shallow";

import CustomIcon from "@/components/common/CustomIcon";
import { EDIT_ICON } from "@/utils/images";
import { SlippageModal } from "./SlippageModal";

export const SlippageInfo = () => {
  const { value, setValue, setTrue, setFalse, toggle } = useBoolean();
  const { slippageValue } = useUniV2Store(
    useShallow((state) => ({
      slippageValue: state.slippageValue,
    }))
  );
  return (
    <>
      <div className="SlippageInfo">
        <div className="Label">
          Slippage
          <div className="SlippageEditIcon" onClick={setTrue}>
            <CustomIcon src={EDIT_ICON} />
          </div>
        </div>
        <span className="Value">%{slippageValue}</span>
      </div>
      <SlippageModal open={value} handleClose={setFalse} />
    </>
  );
};
