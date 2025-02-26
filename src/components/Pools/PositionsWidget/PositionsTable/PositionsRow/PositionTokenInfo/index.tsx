import React from "react";
import "./styles.scss";

import CustomIcon from "@/components/common/CustomIcon";

interface Props {
  token0Logo: string;
  token0Fee: number;
  token1Logo: string;
  token1Fee: number;
}

export const PositionTokenInfo = ({
  token0Fee,
  token0Logo,
  token1Fee,
  token1Logo,
}: Props) => {
  return (
    <div className="PositionTokenContainer">
      <div className="PositionToken">
        <div className="TokenLogo">
          <CustomIcon src={token0Logo} />
        </div>
        <div className="Value">${token0Fee}</div>
      </div>
      <div className="PositionToken">
        <div className="TokenLogo">
          <CustomIcon src={token1Logo} />
        </div>
        <div className="Value">${token1Fee}</div>
      </div>
    </div>
  );
};
