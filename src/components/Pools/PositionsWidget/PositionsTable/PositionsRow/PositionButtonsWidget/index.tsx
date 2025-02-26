import Link from "next/link";
import React from "react";
import "./styles.scss";

interface Props {
  slug: string;
  handleOpen: () => void;
  handleOpenRemoveLiquidityModal: () => void;
  handleOpenAddLiquidityModal: () => void;
}

export const PositionButtonsWidget = ({
  handleOpen,
  slug,
  handleOpenRemoveLiquidityModal,
  handleOpenAddLiquidityModal,
}: Props) => {
  return (
    <div className="PositionButtonsContainer">
      <div className="ManageButtonGreen" onClick={handleOpen}>
        Collect fees
      </div>
      <div className="ManageButton" onClick={handleOpenRemoveLiquidityModal}>
        Remove liquidity
      </div>
      <div className="ManageButton" onClick={handleOpenAddLiquidityModal}>
        Add Liquidity
      </div>
    </div>
  );
};
