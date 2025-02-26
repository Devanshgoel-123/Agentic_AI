import React, { useState } from "react";
import "./styles.scss";

import CustomIcon from "@/components/common/CustomIcon";
import { ARROW_DOWN } from "@/utils/images";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const weekData = [
  {
    label: "Week 1",
    id: "1",
  },
];

export const getClaimContractsForWeekId = (week: string) => {
  switch (week) {
    case "1":
      return {
        name: "Week 1",
      };
    default:
      throw Error("No week founded");
  }
};

interface Props {
  week: string;
  setWeek: (val: string) => void;
}

export const WeekDropdown = ({ week, setWeek }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <div className="WeekContainer" onClick={handleClick}>
        <span>{getClaimContractsForWeekId(week).name}</span>
        <div className="DropdownIcon">
          <CustomIcon src={ARROW_DOWN} />
        </div>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <div className="DropdownItemContainer">
            {weekData.map((el, index) => (
              <div
                className="DropdownItem"
                key={index}
                onClick={() => {
                  setWeek(el.id);
                  handleClose();
                }}
              >
                {el.label}
              </div>
            ))}
          </div>
        </MenuItem>
      </Menu>
    </>
  );
};
