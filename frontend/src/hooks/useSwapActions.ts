import { useEffect } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { toast } from 'react-toastify'

import { useSwapData } from './useSwapData'
import { useApproveToken } from './useApproveToken'
import { useSwapContext } from '@/contexts/swap.context'

import { contracts } from '@/configs'

import { SwapDirection } from '@/types'
import { swapContractAbi } from '@/abis/swap-contract.abi'

export const useSwapActions = () => {
  const { direction, setAmount, parsedAmount, allowance, setLoadingState } =
    useSwapContext()
  const { refetchEthBalance, refetchTokenBalance, refetchReserves } =
    useSwapData(direction)

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
    const isLoading =
      isApproving || isSwapping || isConfirmingApprove || isConfirmingSwap
    setLoadingState(isLoading)
  }, [
    isApproving,
    isSwapping,
    isConfirmingApprove,
    isConfirmingSwap,
    setLoadingState,
  ])

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
    handleSwap,
    loading:
      isApproving || isSwapping || isConfirmingApprove || isConfirmingSwap,
    isSuccess,
  }
}
