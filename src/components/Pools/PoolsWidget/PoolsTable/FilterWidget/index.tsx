import React, { useRef, useState } from "react";
import "./styles.scss";

import { useBoolean } from "usehooks-ts";

import { BiSolidDownArrow } from "react-icons/bi";

import { POOL_TYPE } from "@/utils/enums";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Menu from "@mui/material/Menu/Menu";

interface Props {
  poolType: string;
  handleSetPoolType: (type: string) => void;
}

export const FilterWidget = ({ handleSetPoolType, poolType }: Props) => {
  const ref = useRef(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(ref.current);

  const {
    value: showDropdown,
    setTrue,
    setFalse: handleCloseDropdown,
  } = useBoolean(false);

  const handleOpenDropdown = () => {
    setAnchorEl(ref.current);
    setTrue();
  };
  return (
    <>
      <div ref={ref} onClick={handleOpenDropdown} className="FilterLabel">
        {poolType === ""
          ? "All"
          : poolType === POOL_TYPE.CURVE
          ? "Curve"
          : poolType}{" "}
        <span
          style={{
            transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
          }}
          className="ArrowDownIcon"
        >
          <BiSolidDownArrow />
        </span>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={showDropdown}
        onClose={handleCloseDropdown}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleCloseDropdown}>
          <div className="FilterDropdown">
            <span
              className="DropdownItem"
              onClick={() => {
                handleSetPoolType("");
              }}
            >
              All
            </span>
            <span
              className="DropdownItem"
              onClick={() => {
                handleSetPoolType(POOL_TYPE.CURVE);
              }}
            >
              Curve
            </span>
            <span
              className="DropdownItem"
              onClick={() => {
                handleSetPoolType(POOL_TYPE.UNI_V3);
              }}
            >
              UniV3
            </span>
            <span
              className="DropdownItem"
              onClick={() => {
                handleSetPoolType(POOL_TYPE.UNI_V2);
              }}
            >
              UniV2
            </span>
          </div>
        </MenuItem>
      </Menu>
    </>
  );
};
