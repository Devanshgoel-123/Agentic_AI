import React from "react";
import "./styles.scss";

import useMediaQuery from "@mui/material/useMediaQuery";

import { WithdrawWidget } from "@/components/Pools/UniV3Widget/WithdrawWidget";
import Grow from "@mui/material/Grow";
import Modal from "@mui/material/Modal";
import { Token } from "@/store/types/token-type";
import Slide from "@mui/material/Slide";

interface Props {
  open: boolean;
  slug: string;
  nftId: string;
  token0: Token;
  token1: Token;
  token0Dollar: number;
  token1Dollar: number;
  depositedToken0: number;
  depositedToken1: number;
  collectedFeesToken0: number;
  collectedFeesToken1: number;
  contract: string;
  poolName: string;
  handleClose: () => void;
}

export const RemoveLiquidityModal = ({
  open,
  slug,
  nftId,
  token0,
  token1,
  token0Dollar,
  token1Dollar,
  handleClose,
  depositedToken0,
  depositedToken1,
  collectedFeesToken0,
  collectedFeesToken1,
  contract,
  poolName,
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
      slotProps={{
        backdrop: {
          style: { opacity: 0.2 },
        },
      }}
      sx={{
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0,0,0,0.7)",
      }}
    >
      <div className="RemoveLiquidityModalWrapper">
        {!mobileDevice && (
          <Grow in={open}>
            <div>
              <WithdrawWidget
                slug={slug}
                nftId={nftId}
                token0={token0}
                token1={token1}
                token0Dollar={token0Dollar}
                token1Dollar={token1Dollar}
                depositedToken0={depositedToken0}
                depositedToken1={depositedToken1}
                collectedFeesToken0={collectedFeesToken0}
                collectedFeesToken1={collectedFeesToken1}
                handleClose={handleClose}
                contract={contract}
                poolName={poolName}
                openModal={open}
              />
            </div>
          </Grow>
        )}
        {mobileDevice && (
          <Slide in={open} direction="up">
            <div>
              <WithdrawWidget
                slug={slug}
                nftId={nftId}
                token0={token0}
                token1={token1}
                token0Dollar={token0Dollar}
                token1Dollar={token1Dollar}
                depositedToken0={depositedToken0}
                depositedToken1={depositedToken1}
                collectedFeesToken0={collectedFeesToken0}
                collectedFeesToken1={collectedFeesToken1}
                handleClose={handleClose}
                contract={contract}
                poolName={poolName}
                openModal={open}
              />
            </div>
          </Slide>
        )}
      </div>
    </Modal>
  );
};
