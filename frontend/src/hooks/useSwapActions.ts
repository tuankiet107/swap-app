import { useEffect, useState } from 'react'
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { parseUnits } from 'viem'

import env from '@/configs/env.config'
import { contracts } from '@/configs'
import supportedChains from '@/configs/supported-chains.config'

import { SwapDirection, SwapStatus, TokenInfoProps } from '@/types'
import { useApproveToken } from './useApproveToken'
import { useAllowance } from './useAllowance'

import { swapContractAbi } from '@/abis/swap-contract.abi'

export const useSwapActions = (
  amount: string,
  fromToken: TokenInfoProps,
  direction: SwapDirection,
) => {
  const [status, setStatus] = useState<SwapStatus>(SwapStatus.ReadyToSwap)
  const { isConnected, address: userAddress, chain } = useAccount()
  const {
    writeContract,
    isPending,
    isSuccess,
    data: swapHash,
  } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: swapHash,
    })

  const parsedAmount = amount
    ? parseUnits(amount, fromToken.decimals)
    : BigInt(0)

  const { data: allowance, isLoading: isAllowanceLoading } = useAllowance(
    userAddress!,
  )
  const { approve, isLoading: isApproving } = useApproveToken({
    operator: contracts.swapAmmContract,
    token: contracts.tokenAddress,
    amount: parsedAmount,
  })

  useEffect(() => {
    if (!isConnected) {
      setStatus(SwapStatus.NotConnected)
      return
    }

    if (chain?.id !== supportedChains[env][0].id) {
      setStatus(SwapStatus.WrongNetwork)
      return
    }

    if (isApproving || isPending || isConfirming) {
      setStatus(SwapStatus.Loading)
      return
    }

    if (fromToken.rawBalance && parsedAmount > fromToken.rawBalance) {
      setStatus(SwapStatus.InsufficientBalance)
      return
    }

    if (direction === SwapDirection.TokenToEth && !isAllowanceLoading) {
      if (allowance !== undefined && allowance < parsedAmount) {
        setStatus(SwapStatus.NeedsApproval)
        return
      }
    }

    setStatus(SwapStatus.ReadyToSwap)
  }, [
    isConnected,
    chain,
    amount,
    fromToken.rawBalance,
    direction,
    isAllowanceLoading,
    allowance,
    parsedAmount,
    isApproving,
    isPending,
    isConfirming,
    isConfirmed,
  ])

  const handleSwap = async () => {
    if (direction === SwapDirection.EthToToken) {
      writeContract({
        address: contracts.swapAmmContract,
        abi: swapContractAbi,
        functionName: 'swapEthToToken',
        args: [],
        value: parsedAmount,
      })
      return
    }

    if (direction === SwapDirection.TokenToEth) {
      if (allowance !== undefined && allowance < parsedAmount) {
        await approve()
      }

      writeContract({
        address: contracts.swapAmmContract,
        abi: swapContractAbi,
        functionName: 'swapTokenToEth',
        args: [parsedAmount],
      })
    }
  }

  return {
    status,
    handleSwap,
    loading: isPending || isConfirming || isApproving,
    isSuccess,
  }
}
