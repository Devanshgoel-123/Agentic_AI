import React from "react";
import "./styles.scss";

import useFetchClaimableFee from "@/hooks/Pools/useFetchClaimableFee";
import { useAccount } from "wagmi";
import useFetchCollectFeeContractConfig from "@/hooks/Pools/useFetchCollectFeeContractConfig";
import useSendCollectFeeTransaction from "@/hooks/Pools/useSendCollectFeeTransaction";
import useMediaQuery from "@mui/material/useMediaQuery";

import { MODAL_STYLE } from "@/utils/constants";
import { ModalHeading } from "@/components/common/ModalHeading";
import CustomIcon from "@/components/common/CustomIcon";
import { UniV3PoolLabel } from "@/components/Pools/PoolsWidget/PoolsTable/PoolRow/UniV3Label";
import { Token } from "@/store/types/token-type";
import {
  convertBigIntToUIFormat,
  formatNumberWithDecimals,
} from "@/utils/number";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { ActionBtnContainer } from "./ActionBtnContainer";
import Modal from "@mui/material/Modal/Modal";
import Grow from "@mui/material/Grow";
import Slide from "@mui/material/Slide";

interface Props {
  open: boolean;
  nftId: string;
  token0Logo: string;
  token1Logo: string;
  poolName: string;
  fee: number;
  range: string;
  token0Dollar: string;
  token1Dollar: string;
  token0: Token;
  token1: Token;
  contract: string;
  handleClose: () => void;
}

export const ReviewFeesModal = ({
  open,
  nftId,
  handleClose,
  poolName,
  range,
  fee,
  token0Dollar,
  token1Dollar,
  token0Logo,
  token1Logo,
  token0,
  token1,
  contract,
}: Props) => {
  const { address } = useAccount();
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  const {
    loading: collectFeeContractConfigLoading,
    error: collectFeeContractConfigError,
  } = useFetchCollectFeeContractConfig({
    contract: contract,
    nftId: nftId,
    isSkip: !open,
  });

  const { loading, data, error } = useFetchClaimableFee({
    wallet: address,
    nftId: Number(nftId),
    isSkip: !open || !address,
  });

  const { loading: collectFeeTransactionLoading, sendCollectFeeTransaction } =
    useSendCollectFeeTransaction({
      poolChainId: 7000,
      callBackFn: handleClose,
    });

  const returnLoadingState = (jsx: JSX.Element) => {
    if (loading) {
      return <CustomTextLoader text="$0.00" />;
    } else {
      return jsx;
    }
  };

  const handleMainBtnClick = () => {
    sendCollectFeeTransaction();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={MODAL_STYLE}
    >
      <div className="ReviewFeesModalWrapper">
        {!mobileDevice && (
          <Grow in={open}>
            <div className="ReviewFeesModal">
              <ModalHeading heading="Collect Fees" handleClick={handleClose} />
              <div className="PoolInfo">
                <div className="PoolTokens">
                  <div className="TokenLogo">
                    <CustomIcon src={token0Logo} />
                  </div>
                  <div className="TokenLogo">
                    <CustomIcon src={token1Logo} />
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
              <div className="RangeContainer">
                <span>Range</span>
                <span>{range}</span>
              </div>
              <div className="FeeInfoContainer">
                <span className="Heading">Unclaimed Fees</span>
                <div className="FeeInfo">
                  <div className="TokenInfo">
                    <div className="TokenLogo">
                      <CustomIcon src={token0Logo} />
                    </div>
                    {token0.name}
                  </div>
                  <div className="FeeValue">
                    {returnLoadingState(
                      <>
                        $
                        {formatNumberWithDecimals(
                          Number(
                            convertBigIntToUIFormat(
                              data.claimableFeesToken0,
                              token0.decimal
                            )
                          ) * Number(token0Dollar)
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="FeeInfo">
                  <div className="TokenInfo">
                    <div className="TokenLogo">
                      <CustomIcon src={token1Logo} />
                    </div>
                    {token1.name}
                  </div>
                  <div className="FeeValue">
                    {returnLoadingState(
                      <>
                        $
                        {formatNumberWithDecimals(
                          Number(
                            convertBigIntToUIFormat(
                              data.claimableFeesToken1,
                              token1.decimal
                            )
                          ) * Number(token1Dollar)
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <ActionBtnContainer
                loadingState={
                  loading ||
                  collectFeeContractConfigLoading ||
                  collectFeeTransactionLoading
                }
                totalFee={(
                  Number(
                    formatNumberWithDecimals(
                      Number(
                        convertBigIntToUIFormat(
                          data.claimableFeesToken1,
                          token1.decimal
                        )
                      ) * Number(token1Dollar)
                    )
                  ) +
                  Number(
                    formatNumberWithDecimals(
                      Number(
                        convertBigIntToUIFormat(
                          data.claimableFeesToken0,
                          token0.decimal
                        )
                      ) * Number(token0Dollar)
                    )
                  )
                ).toString()}
                poolChainId={7000}
                handleMainFn={handleMainBtnClick}
              />
            </div>
          </Grow>
        )}
        {mobileDevice && (
          <Slide in={open} direction="up">
            <div className="ReviewFeesModal">
              <ModalHeading heading="Collect Fees" handleClick={handleClose} />
              <div className="PoolInfo">
                <div className="PoolTokens">
                  <div className="TokenLogo">
                    <CustomIcon src={token0Logo} />
                  </div>
                  <div className="TokenLogo">
                    <CustomIcon src={token1Logo} />
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
              <div className="RangeContainer">
                <span>Range</span>
                <span>{range}</span>
              </div>
              <div className="FeeInfoContainer">
                <span className="Heading">Unclaimed Fees</span>
                <div className="FeeInfo">
                  <div className="TokenInfo">
                    <div className="TokenLogo">
                      <CustomIcon src={token0Logo} />
                    </div>
                    {token0.name}
                  </div>
                  <div className="FeeValue">
                    {returnLoadingState(
                      <>
                        $
                        {formatNumberWithDecimals(
                          Number(
                            convertBigIntToUIFormat(
                              data.claimableFeesToken0,
                              token0.decimal
                            )
                          ) * Number(token0Dollar)
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="FeeInfo">
                  <div className="TokenInfo">
                    <div className="TokenLogo">
                      <CustomIcon src={token1Logo} />
                    </div>
                    {token1.name}
                  </div>
                  <div className="FeeValue">
                    {returnLoadingState(
                      <>
                        $
                        {formatNumberWithDecimals(
                          Number(
                            convertBigIntToUIFormat(
                              data.claimableFeesToken1,
                              token1.decimal
                            )
                          ) * Number(token1Dollar)
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <ActionBtnContainer
                loadingState={
                  loading ||
                  collectFeeContractConfigLoading ||
                  collectFeeTransactionLoading
                }
                totalFee={(
                  Number(
                    formatNumberWithDecimals(
                      Number(
                        convertBigIntToUIFormat(
                          data.claimableFeesToken1,
                          token1.decimal
                        )
                      ) * Number(token1Dollar)
                    )
                  ) +
                  Number(
                    formatNumberWithDecimals(
                      Number(
                        convertBigIntToUIFormat(
                          data.claimableFeesToken0,
                          token0.decimal
                        )
                      ) * Number(token0Dollar)
                    )
                  )
                ).toString()}
                poolChainId={7000}
                handleMainFn={handleMainBtnClick}
              />
            </div>
          </Slide>
        )}
      </div>
    </Modal>
  );
};
