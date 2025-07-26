import { Address } from 'viem'

export const contracts = {
  swapAmmContract: process.env.NEXT_PUBLIC_SWAP_CONTRACT as Address,
  tokenAddress: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as Address,
}
