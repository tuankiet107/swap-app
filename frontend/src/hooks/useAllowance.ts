import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'

import { contracts } from '@/configs'

export const useAllowance = (owner: `0x${string}`) => {
  return useReadContract({
    address: contracts.tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner, contracts.swapAmmContract],
  })
}
