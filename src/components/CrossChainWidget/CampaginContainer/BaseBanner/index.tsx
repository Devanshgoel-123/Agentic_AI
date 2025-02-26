import React from "react";
import "./styles.scss";
import CustomIcon from "@/components/common/CustomIcon";
import { EDDY_LOGO } from "@/utils/images";

export const BaseBanner = () => {
  return (
    <div className="BaseBannerContainer">
      <div className="TokenContainer">
        <div className="Logo">
          <CustomIcon src="https://asset.eddy.finance/logo/base.svg" />
        </div>
        <div className="Logo">
          <CustomIcon src={EDDY_LOGO} />
        </div>
      </div>
      <div className="BannerText">
        <span className="Blue">BASE</span> is now live on{" "}
        <span className="Green">Eddy</span>
      </div>
    </div>
  );
};
