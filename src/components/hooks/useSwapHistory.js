import useSWR from "swr";

import { bridgeApi } from "../config/constant";
const swapHistoryAPI = `${bridgeApi}/swap/history/${5}/${"0xb766b2bA226242E46b9BB992CBBF3eeb5451591E"}?offset=0&limit=50`;
const allSwapHistoryAPI = `http://192.168.100.129:11556/swap/history?offset=0&limit=10`;

// const rpc = `${bridgeApi}/rpc`;
// const versionInfo = `${bridgeApi}/versioninfo`;
// const serverInfo = `${bridgeApi}/serverinfo`;
// const oracleInfo = `${bridgeApi}/oracleinfo`;
// const statusInfo = `${bridgeApi}/statusinfo`;
// const chainConfig = `${bridgeApi}/chainconfig/${5}`;
// const swapTrxStatus = `${bridgeApi}/swap/status/${5}/${"0xd63320b0a477feedbfd65702cfa9fe79ffbcb8368ae68ece33eeb5287194cd4e"}`;
// const allChainIds = `${bridgeApi}/allchainids`;
// const allTokenIds = `${bridgeApi}/alltokenids`;

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const getAllSwapTrxHistories = () => {
  const { data, error, isLoading } = useSWR(allSwapHistoryAPI, fetcher, {
    refreshInterval: 10000,
  });
  return { allSwapTrxHistories: { data, error, isLoading } };
};
