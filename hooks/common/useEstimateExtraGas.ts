/**
 * Estimates gas for a transaction then adds extra amount, for instance
 * using BigInt(120) as percentage will add 20% extra gas to the estimated
 * amount
 */

import { encodeFunctionData, type WriteContractParameters } from "viem";
import { useEstimateGas } from "wagmi";

export function useEstimateExtraGas(
  params: WriteContractParameters | undefined,
  percentage: bigint
) {
  const data = params ? encodeFunctionData(params) : null;

  const { data: estimatedGas } = useEstimateGas(
    data
      ? {
          data,
          to: params?.address,
          value: params?.value ? params.value : undefined,
        }
      : undefined
  );

  const estimatedWithExtra = estimatedGas
    ? (estimatedGas * percentage) / BigInt(100)
    : null;

  return estimatedWithExtra;
}
