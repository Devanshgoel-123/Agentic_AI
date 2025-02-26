"use client";
import React, { useState } from "react";
import "./styles.scss";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Grow from "@mui/material/Grow";

import { useShallow } from "zustand/react/shallow";
import { useLazyQuery } from "@apollo/client";
import { GET_TOKEN_DOLLAR_VALUE } from "@/components/graphql/queries/getDollarValueOfToken";
import { formattedValueToDecimals } from "@/utils/number";
import useTransferStore from "@/store/transfer-store";
import useFetchTokens from "@/hooks/Transfer/useFetchTokens";
import { ModalHeading } from "@/components/common/ModalHeading";
import { ChainLabel } from "./ChainLabel";
import CustomIcon from "@/components/common/CustomIcon";
import { supportedBridgeChains } from "@/utils/constants";
import { SEARCH_ICON } from "@/utils/images";

import { TokenLabel } from "./TokenLabel";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import { Token } from "@/store/types/token-type";
import Slide from "@mui/material/Slide";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAgentStore } from "@/store/agent-store";
import { ChainIds } from "@/utils/enums";

interface Props {
  open: boolean;
  actionType: string;
  getDefaultTokens: (chain: number) => void;
  handleClose: () => void;
}

export const TokenModal = ({
  open,
  actionType,
  handleClose,
  getDefaultTokens,
}: Props) => {
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  const { payChain, getChain } = useTransferStore(
    useShallow((state) => ({
      payChain: state.payChain,
      getChain: state.getChain,
    }))
  );
  const [
    getDollarValue,
    { loading: dollarLoading, error: dollarError, data: dollarData, refetch },
  ] = useLazyQuery(GET_TOKEN_DOLLAR_VALUE);
  const [query, setQuery] = useState("");

  /**
   * Store results of token list after balance fetch
   * in this array to display it in sorted manner.
   * make sure to clear this array if chain changes or modal closes.
   */
  const [sortedTokens, setSortedTokens] = useState<
    { token: Token; balance: string; usdValue: string }[]
  >([]);

  const { loading, error, data } = useFetchTokens({
    chainId: actionType === "From" ? payChain : getChain,
    allowFetch: !open,
    actionType,
  });

  /**
   * !Important
   * Callback function call after balance fetch is successful.
   * once balance is fetch populate sortedTokens array with
   * balance and dollar value of the asset.
   * @param token Token Details
   * @param balance Balance of token.
   * @param dollarValueAsset Dollar Value of asset.
   * @param usdValue Dollar Value of user holdings for that token
   */

  const handleSetSortedTokenData = async (token: Token, balance: string) => {
    /**
     * Populate sortedTokens Array with the above data
     * @param usdValue Value of user holded tokens in USD
     */
    const addTokenData = (usdValue: string, tokenAddress?: string) => {
      const chainId = actionType === "From" ? payChain : getChain;
      setSortedTokens((prev) => {
        const currentChainTokens = prev.filter(
          (t) =>
            t.token.chain.chainId === chainId &&
            t.token.address !== tokenAddress
        );
        return [
          ...currentChainTokens,
          ...[
            {
              token,
              balance,
              usdValue,
            },
          ],
        ];
      });
    };
    if (Number(balance) > 0) {
      const {
        data: dollarUsdData,
        loading,
        error,
      } = await getDollarValue({
        variables: {
          tokenId: token.id,
        },
      });
      if (dollarUsdData && !loading && !error) {
        const tokenValueUsd = dollarUsdData.getDollarValueForToken
          ? Number(dollarUsdData.getDollarValueForToken.price) /
            10 ** Math.abs(dollarUsdData.getDollarValueForToken.expo)
          : 0;
        const userTokenHoldingsInUsd = formattedValueToDecimals(
          (
            Number(tokenValueUsd) *
            (Number(balance !== undefined ? balance : data.balance) /
              10 ** Number(token.decimal))
          ).toString(),
          4
        );
        addTokenData(userTokenHoldingsInUsd, token.address);
      }
    } else {
      addTokenData("0.00");
    }
  };
  /**
   * Render token list once data is fetched from backend.
   * @returns void
   */
  const renderSortedTokensList = () => {
    return (
      <>
        {sortedTokens.length > 0 &&
          sortedTokens
            .filter((item: { token: Token; balance: string }) =>
              item.token.name.toLowerCase().includes(query.toLowerCase())
            )
            .sort((a, b) => Number(b.usdValue) - Number(a.usdValue))

            .map(
              (item: { token: Token; balance: string; usdValue: string }) => (
                <TokenLabel
                  key={item.token.id}
                  id={item.token.id}
                  isBridge={item.token.isBridge}
                  isNative={item.token.isNative}
                  isDefault={item.token.isDefault}
                  isStable={item.token.isStable}
                  address={item.token.address}
                  zrc20Address={item.token.zrc20Address}
                  name={item.token.name}
                  chain={item.token.chain}
                  decimal={item.token.decimal}
                  tokenLogo={item.token.tokenLogo}
                  pythId={item.token.pythId}
                  curveIndex={item.token.curveIndex}
                  unsupported={item.token.unsupported}
                  isUniV3Supported={item.token.isUniV3Supported}
                  setToken={
                    actionType === "From"
                      ? useTransferStore.getState().setPayToken
                      : useTransferStore.getState().setGetToken
                  }
                  handleClose={handleCloseModal}
                  balance={item.balance}
                  actionType={actionType}
                  usdValue={item.usdValue}
                  shimmer={false}
                />
              )
            )}
      </>
    );
  };

  /**
   * Render token list once data is fetched from backend.
   * @returns void
   */
  const renderTokensList = () => {
    return (
      <>
        {data.map((item: Token) => (
          <TokenLabel
            key={item.id}
            id={item.id}
            isBridge={item.isBridge}
            isNative={item.isNative}
            isDefault={item.isDefault}
            isStable={item.isStable}
            address={item.address}
            zrc20Address={item.zrc20Address}
            name={item.name}
            chain={item.chain}
            decimal={item.decimal}
            tokenLogo={item.tokenLogo}
            pythId={item.pythId}
            curveIndex={item.curveIndex}
            unsupported={item.unsupported}
            isUniV3Supported={item.isUniV3Supported}
            setToken={
              actionType === "From"
                ? useTransferStore.getState().setPayToken
                : useTransferStore.getState().setGetToken
            }
            handleClose={handleCloseModal}
            setterFunction={handleSetSortedTokenData}
            actionType={actionType}
            shimmer={true}
          />
        ))}
      </>
    );
  };

  /**
   * Clear sortedTokens array if chain selection is changed.
   */
  const chainIdCallBack = () => {
    setSortedTokens([]);
  };

  /**
   * On close of modal clear sorted selection array.
   */
  const handleCloseModal = () => {
    //
    chainIdCallBack();
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        backdropFilter: "blur(5px)",
      }}
    >
      <Box className="TokenModalWrapper">
        {!mobileDevice && (
          <Grow in={open}>
            <Box className="TokenModalContainer">
              <ModalHeading
                heading={actionType}
                handleClick={handleCloseModal}
              />
              <Box className="TokensChainsContainer">
                <Box className="ChainWrapper">
                  <Box className="ContainerHeading">Chains</Box>
                  <Box className="ChainsContainer">
                    {supportedBridgeChains.map((item, index) => (
                      <ChainLabel
                        key={index}
                        name={item.name}
                        logo={item.logo}
                        chainId={item.chainId}
                        currentChainId={
                          actionType === "From" ? payChain : getChain
                        }
                        setChainId={
                          actionType === "From"
                            ? useTransferStore.getState().setPayChain
                            : useTransferStore.getState().setGetChain
                        }
                        getDefaultTokens={getDefaultTokens}
                        callBack={chainIdCallBack}
                        actionType={actionType}
                      />
                    ))}
                  </Box>
                </Box>
                <Box className="DividerLine"></Box>
                <Box className="TokensWrapper">
                  <Box className="ContainerHeading">Assets</Box>
                  <Box className="SearchContainer">
                    <Box className="SearchLogo">
                      <CustomIcon src={SEARCH_ICON} />
                    </Box>
                    <input
                      disabled={sortedTokens.length !== data.length}
                      placeholder={"Search by symbol, name or address"}
                      className="SearchInput"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      type="text"
                    />
                  </Box>
                  <Box className="TokensContainer">
                    {loading && (
                      <>
                        <Box className="LoaderContainer">
                          <CustomSpinner size="20" color="#909090" />
                        </Box>
                      </>
                    )}
                    {sortedTokens.length !== data.length ? (
                      <>{renderTokensList()}</>
                    ) : (
                      <>{renderSortedTokensList()}</>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grow>
        )}
        {mobileDevice && (
          <Slide in={open} direction="up">
            <Box className="TokenModalContainer">
              <ModalHeading
                heading={actionType}
                handleClick={handleCloseModal}
              />
              <Box className="TokensChainsContainer">
                <Box className="ChainWrapper">
                  <Box className="ContainerHeading">Chains</Box>
                  <Box className="ChainsContainer">
                    {supportedBridgeChains.map((item, index) => (
                      <ChainLabel
                        key={index}
                        name={item.name}
                        logo={item.logo}
                        chainId={item.chainId}
                        currentChainId={
                          actionType === "From" ? payChain : getChain
                        }
                        setChainId={
                          actionType === "From"
                            ? useTransferStore.getState().setPayChain
                            : useTransferStore.getState().setGetChain
                        }
                        getDefaultTokens={getDefaultTokens}
                        callBack={chainIdCallBack}
                        actionType={actionType}
                      />
                    ))}
                  </Box>
                </Box>
                <Box className="DividerLine"></Box>
                <Box className="TokensWrapper">
                  <Box className="ContainerHeading">Assets</Box>
                  <Box className="SearchContainer">
                    <Box className="SearchLogo">
                      <CustomIcon src={SEARCH_ICON} />
                    </Box>
                    <input
                      disabled={sortedTokens.length !== data.length}
                      placeholder={"Search by symbol, name or address"}
                      className="SearchInput"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      type="text"
                    />
                  </Box>
                  <Box className="TokensContainer">
                    {loading && (
                      <>
                        <Box className="LoaderContainer">
                          <CustomSpinner size="20" color="#909090" />
                        </Box>
                      </>
                    )}
                    {sortedTokens.length !== data.length ? (
                      <>{renderTokensList()}</>
                    ) : (
                      <>{renderSortedTokensList()}</>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Slide>
        )}
      </Box>
    </Modal>
  );
};
