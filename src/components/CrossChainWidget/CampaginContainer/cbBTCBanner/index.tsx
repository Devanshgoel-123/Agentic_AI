import React from "react";
import "./styles.scss";
import { BTC, CBBTC_BG,CB_BTC } from "@/utils/images";
import Image from "next/image";
import { STAR_BTC,STAR_CBBTC,STAR_TOKEN } from "@/utils/images";
export const CBBTCBanner = () => {
  return (
    <div className="cbBTCContainer">
    <div className="cbBtcTextContainer">
        Unwrap <span className="cbBTCtext">cbBTC</span>
        <Image src={STAR_CBBTC} height={9} width={9} alt="star" className="starcbBTC1" ></Image>
        <Image src={STAR_CBBTC} height={6} width={6} alt="star" className="starcbBTC2" ></Image>
    </div>
      <div className="TokenContainer">
        <Image src={BTC} height={30} width={30} alt="btc token" className="btcToken" />
        <Image src={CB_BTC} height={30} width={30} alt="cb_btc token" className="cbBtcToken" />
        <Image src={STAR_TOKEN} height={7} width={7} alt="star token" className="startToken1" />
        <Image src={STAR_TOKEN} height={7} width={7} alt="star token" className="startToken2" />
        <Image src={STAR_TOKEN} height={7} width={7} alt="star token" className="startToken3" />
        <Image src={STAR_TOKEN} height={7} width={7} alt="star token" className="startToken4" />
      </div>
      <div className="BtcTextContainer">
           to <span className="BTCtext">BTC</span>
           <Image src={STAR_BTC}height={13} width={13} alt="star token" className="starBTC1"/>
           <Image src={STAR_BTC}height={7} width={7} alt="star token" className="starBTC2" />
           <Image src={STAR_BTC}height={10} width={10} alt="star token" className="starBTC3" />
        </div>
    </div>
  )
};
