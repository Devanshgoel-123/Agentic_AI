import React from "react";
import "./styles.scss";

import CustomIcon from "@/components/common/CustomIcon";

interface Props {
  tokenLogos: string[];
}

export const DiTokenLogo = ({ tokenLogos }: Props) => {
  return (
    <div className="TokenWrapper">
      {tokenLogos.map((item, index) => (
        <div key={index} className="Token">
          <CustomIcon src={item} />
        </div>
      ))}
      <div className="Token"></div>
    </div>
  );
};
