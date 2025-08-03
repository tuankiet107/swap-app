import { useReadContract } from 'wagmi'

import { swapContractAbi } from '@/abis/swap-contract.abi'
import { contracts } from '@/configs'

type Response = {
  data?: [bigint, bigint] // [tokenReserve, ethReserve]
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  error: Error | null
  refetch: () => void
}

export const useGetReserves = () => {
  const { data: reservesData, ...rest }: Response = useReadContract({
    address: contracts.swapAmmContract,
    abi: swapContractAbi,
    functionName: 'getReserves',
    args: [],
  })
  const reserves = reservesData
    ? {
        tokenReserve: reservesData[0],
        ethReserve: reservesData[1],
      }
    : null

  return {
    ...rest,
    data: reserves,
  }
}
