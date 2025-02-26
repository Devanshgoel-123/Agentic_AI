import React from "react";
import "./styles.scss";
import Link from "next/link";

import useMediaQuery from "@mui/material/useMediaQuery";

import { ModalHeading } from "@/components/common/ModalHeading";
import CustomIcon from "@/components/common/CustomIcon";
import { UniV3PoolLabel } from "@/components/Pools/PoolsWidget/PoolsTable/PoolRow/UniV3Label";
import { Token } from "@/store/types/token-type";
import Modal from "@mui/material/Modal";
import Grow from "@mui/material/Grow";
import Slide from "@mui/material/Slide";

interface Props {
  open: boolean;
  poolName: string;
  slug: string;
  range: string;
  liquidity: string;
  fee: string;
  token0: Token;
  token1: Token;
  nftId: string;
  tickLower: number;
  tickUpper: number;
  handleClose: () => void;
}

export const AddLiquidityModal = ({
  open,
  handleClose,
  slug,
  token0,
  token1,
  poolName,
  fee,
  nftId,
  range,
  liquidity,
  tickLower,
  tickUpper,
}: Props) => {
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0,0,0,0.7)",
      }}
    >
      <div className="AddLiquidityModalWrapper">
        {!mobileDevice && (
          <Grow in={open}>
            <div className="AddLiquidityModal">
              <ModalHeading heading="Add Liquidity" handleClick={handleClose} />
              <div className="PoolInfo">
                <div className="PoolTokens">
                  <div className="TokenLogo">
                    <CustomIcon src={token0.tokenLogo} />
                  </div>
                  <div className="TokenLogo">
                    <CustomIcon src={token1.tokenLogo} />
                  </div>
                </div>
                <div className="PoolNameContainer">
                  <span className="PoolName">{poolName}</span>
                  <div className="LabelContainer">
                    <UniV3PoolLabel />
                    <div className="FeeLabel">Fee Tier:{fee}%</div>
                  </div>
                </div>
              </div>
              <div className="LiquidityContainer">
                <span>Liquidity</span>
                <span>${liquidity}</span>
              </div>
              <div className="RangeContainer">
                <span>Range</span>
                <span>{range}</span>
              </div>
              <div className="ButtonsWrapper">
                <div className="AddButtonsContainer">
                  <span className="Label">
                    Add Liquidity to the same position
                  </span>
                  <Link
                    style={{
                      textDecoration: "none",
                    }}
                    href={`/pools/univ3/${slug}/add?current=true&nftId=${nftId}&tickLower=${tickLower}&tickUpper=${tickUpper}`}
                  >
                    <div className="ActionBtn">Add Liquidity</div>
                  </Link>
                </div>
                <div className="AddButtonsContainer">
                  <span className="Label">Create new position</span>
                  <Link
                    style={{
                      textDecoration: "none",
                    }}
                    href={`/pools/univ3/${slug}/add`}
                  >
                    <div className="ActionBtn">Create Position</div>
                  </Link>
                </div>
              </div>
            </div>
          </Grow>
        )}
        {mobileDevice && (
          <Slide in={open} direction="up">
            <div className="AddLiquidityModal">
              <ModalHeading heading="Add Liquidity" handleClick={handleClose} />
              <div className="PoolInfo">
                <div className="PoolTokens">
                  <div className="TokenLogo">
                    <CustomIcon src={token0.tokenLogo} />
                  </div>
                  <div className="TokenLogo">
                    <CustomIcon src={token1.tokenLogo} />
                  </div>
                </div>
                <div className="PoolNameContainer">
                  <span className="PoolName">{poolName}</span>
                  <div className="LabelContainer">
                    <UniV3PoolLabel />
                    <div className="FeeLabel">Fee Tier:{fee}%</div>
                  </div>
                </div>
              </div>
              <div className="LiquidityContainer">
                <span>Liquidity</span>
                <span>{liquidity}</span>
              </div>
              <div className="RangeContainer">
                <span>Range</span>
                <span>{range}</span>
              </div>
              <div className="ButtonsWrapper">
                <div className="AddButtonsContainer">
                  <span className="Label">
                    Add Liquidity to the same position
                  </span>
                  <Link
                    style={{
                      textDecoration: "none",
                    }}
                    href={`/pools/univ3/${slug}/add?current=true&nftId=${nftId}&tickLower=${tickLower}&tickUpper=${tickUpper}`}
                  >
                    <div className="ActionBtn">Add Liquidity</div>
                  </Link>
                </div>
                <div className="AddButtonsContainer">
                  <span className="Label">Create new position</span>
                  <Link
                    style={{
                      textDecoration: "none",
                    }}
                    href={`/pools/univ3/${slug}/add`}
                  >
                    <div className="ActionBtn">Create Position</div>
                  </Link>
                </div>
              </div>
            </div>
          </Slide>
        )}
      </div>
    </Modal>
  );
};
