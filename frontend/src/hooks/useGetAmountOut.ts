import { formatUnits, parseUnits } from 'viem'
import { useReadContract } from 'wagmi'

import { contracts } from '@/configs'

import { swapContractAbi } from '@/abis/swap-contract.abi'

type Response = {
  data?: bigint
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  error: Error | null
  refetch: () => void
}

export const useGetAmountOut = (
  amount: string,
  reserveIn: bigint,
  reserveOut: bigint,
) => {
  const { data, ...rest }: Response = useReadContract({
    address: contracts.swapAmmContract,
    abi: swapContractAbi,
    functionName: 'getAmountOut',
    args: [parseUnits(String(amount), 18), reserveIn, reserveOut],
  })

  return {
    ...rest,
    data: data ? formatUnits(data, 18) : '0',
  }
}
