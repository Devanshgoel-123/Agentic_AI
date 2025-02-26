import React from "react";
import "./styles.scss";
import CustomIcon from "@/components/common/CustomIcon";

interface Props {
  tokenLogos: string[];
}

export const MultiTokenLogo = ({ tokenLogos }: Props) => {
  return (
    <div className="MultiTokenLogoWrapper">
      {tokenLogos.map((item, index) => (
        <div key={index} className="Token">
          <CustomIcon src={item} />
        </div>
      ))}
    </div>
  );
};
