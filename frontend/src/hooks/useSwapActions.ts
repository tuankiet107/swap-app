import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { parseUnits } from 'viem'

import env from '@/configs/env.config'
import supportedChains from '@/configs/supported-chains.config'

import { SwapStatus, TokenInfoProps } from '@/types'

export const useSwapActions = (amount: string, fromToken: TokenInfoProps) => {
  const [status, setStatus] = useState<SwapStatus>(SwapStatus.ReadyToSwap)
  const { isConnected, chain } = useAccount()

  useEffect(() => {
    if (!isConnected) {
      setStatus(SwapStatus.NotConnected)
      return
    }

    if (chain?.id !== supportedChains[env][0].id) {
      setStatus(SwapStatus.WrongNetwork)
      return
    }

    if (fromToken.rawBalance && parseUnits(amount, 18) > fromToken.rawBalance) {
      setStatus(SwapStatus.InsufficientBalance)
      return
    }

    // TODO: Add logic to approve token if needed

    setStatus(SwapStatus.ReadyToSwap)
  }, [isConnected, chain, amount, fromToken.rawBalance])

  const handleSwap = () => {
    console.log('Starting swap...')
  }

  return {
    status,
    handleSwap,
  }
}
