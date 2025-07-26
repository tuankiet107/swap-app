import { useState } from 'react'

import { SwapDirection } from '@/types'

export const useSwapState = () => {
  const [direction, setDirection] = useState<SwapDirection>(
    SwapDirection.EthToToken,
  )
  const [amount, setAmount] = useState<number>(0)

  const handleSwitch = () => {
    setDirection((prev) =>
      prev === SwapDirection.EthToToken
        ? SwapDirection.TokenToEth
        : SwapDirection.EthToToken,
    )
    setAmount(0)
  }

  return {
    direction,
    amount,
    setAmount,
    handleSwitch,
  }
}
