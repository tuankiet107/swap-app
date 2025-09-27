import { useEffect, useState } from 'react'
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { parseUnits } from 'viem'
import { toast } from 'react-toastify'

import env from '@/configs/env.config'
import { contracts } from '@/configs'
import supportedChains from '@/configs/supported-chains.config'

import { SwapDirection, SwapStatus, TokenInfoProps } from '@/types'
import { useApproveToken } from './useApproveToken'
import { useAllowance } from './useAllowance'
import { useSwapData } from './useSwapData'

import { swapContractAbi } from '@/abis/swap-contract.abi'

export const useSwapActions = (
  fromToken: TokenInfoProps,
  direction: SwapDirection,
  amount: string,
  setAmount: (amount: string) => void,
) => {
  const { refetchEthBalance, refetchTokenBalance, refetchReserves } =
    useSwapData(direction)

  const [status, setStatus] = useState<SwapStatus>(SwapStatus.ReadyToSwap)
  const { isConnected, address: userAddress, chain } = useAccount()
  const {
    writeContractAsync,
    isPending: isSwapping,
    isSuccess,
    data: swapHash,
  } = useWriteContract()
  const { isLoading: isConfirmingSwap, isSuccess: isSwapConfirmed } =
    useWaitForTransactionReceipt({
      hash: swapHash,
    })

  const parsedAmount = amount
    ? parseUnits(amount, fromToken.decimals)
    : BigInt(0)

  const { data: allowance, isLoading: isAllowanceLoading } = useAllowance(
    userAddress!,
  )
  const {
    approve,
    isLoading: isApproving,
    approvedHash,
  } = useApproveToken({
    operator: contracts.swapAmmContract,
    token: contracts.tokenAddress,
    amount: parsedAmount,
  })
  const { isLoading: isConfirmingApprove } = useWaitForTransactionReceipt({
    hash: approvedHash,
  })

  useEffect(() => {
    if (isSwapConfirmed) {
      refetchEthBalance()
      refetchTokenBalance()

      refetchReserves()
      setAmount('0')

      toast.success('Transaction submitted', {
        position: 'top-center',
        autoClose: 5000,
      })
    }
  }, [
    isSwapConfirmed,
    refetchEthBalance,
    refetchTokenBalance,
    refetchReserves,
    setAmount,
  ])

  useEffect(() => {
    if (!isConnected) {
      setStatus(SwapStatus.NotConnected)
      return
    }

    if (chain?.id !== supportedChains[env][0].id) {
      setStatus(SwapStatus.WrongNetwork)
      return
    }

    if (isApproving || isConfirmingApprove || isSwapping || isConfirmingSwap) {
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
    fromToken.rawBalance,
    direction,
    isAllowanceLoading,
    allowance,
    parsedAmount,
    isApproving,
    isSwapping,
    isConfirmingSwap,
    isConfirmingApprove,
  ])

  const handleSwap = async () => {
    toast.info('Processing swap...', {
      position: 'top-center',
      autoClose: 5000,
    })

    try {
      if (direction === SwapDirection.EthToToken) {
        await writeContractAsync({
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

        await writeContractAsync({
          address: contracts.swapAmmContract,
          abi: swapContractAbi,
          functionName: 'swapTokenToEth',
          args: [parsedAmount],
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error('Transaction failed', {
        position: 'top-center',
        autoClose: 5000,
      })
    }
  }

  return {
    status,
    handleSwap,
    loading:
      isApproving || isSwapping || isConfirmingApprove || isConfirmingSwap,
    isSuccess,
  }
}
