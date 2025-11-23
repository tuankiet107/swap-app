import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react'
import { useAccount } from 'wagmi'
import { parseUnits } from 'viem'

import { useSwapData } from '@/hooks/useSwapData'
import { useAllowance } from '@/hooks/useAllowance'

import env from '@/configs/env.config'
import supportedChains from '@/configs/supported-chains.config'

import { SwapDirection, SwapStatus, TokenInfoProps } from '@/types'

interface SwapContextType {
  direction: SwapDirection
  amount: string
  status: SwapStatus
  fromToken: TokenInfoProps
  toToken: TokenInfoProps
  disabledBtn: boolean
  parsedAmount: bigint
  allowance: bigint | undefined
  isAllowanceLoading: boolean
  setAmount: (amount: string) => void
  handleSwitch: () => void
  setLoadingState: (loading: boolean) => void
}

const SwapContext = createContext<SwapContextType | undefined>(undefined)

export const useSwapContext = () => {
  const context = useContext(SwapContext)
  if (!context) {
    throw new Error('useSwapContext must be used within SwapProvider')
  }
  return context
}

interface SwapProviderProps {
  children: ReactNode
}

export const SwapProvider = ({ children }: SwapProviderProps) => {
  const [direction, setDirection] = useState<SwapDirection>(
    SwapDirection.EthToToken,
  )
  const [amount, setAmount] = useState<string>('0')
  const [status, setStatus] = useState<SwapStatus>(SwapStatus.ReadyToSwap)
  const [isLoading, setIsLoading] = useState(false)

  const { isConnected, address: userAddress, chain } = useAccount()
  const { fromToken, toToken } = useSwapData(direction)

  const parsedAmount = amount
    ? parseUnits(amount, fromToken.decimals)
    : BigInt(0)

  const { data: allowance, isLoading: isAllowanceLoading } = useAllowance(
    userAddress!,
  )

  const handleSwitch = () => {
    if (status === SwapStatus.Loading) return

    setDirection((prev) =>
      prev === SwapDirection.EthToToken
        ? SwapDirection.TokenToEth
        : SwapDirection.EthToToken,
    )
    setAmount('0')
  }

  const setLoadingState = (loading: boolean) => {
    setIsLoading(loading)
  }

  useEffect(() => {
    if (!isConnected) {
      setStatus(SwapStatus.NotConnected)
      return
    }

    if (chain?.id !== supportedChains[env][0].id) {
      setStatus(SwapStatus.WrongNetwork)
      return
    }

    if (isLoading) {
      setStatus(SwapStatus.Loading)
      return
    }

    if (parsedAmount > BigInt(0) && fromToken.rawBalance !== undefined) {
      if (parsedAmount > fromToken.rawBalance) {
        setStatus(SwapStatus.InsufficientBalance)
        return
      }
    }

    if (direction === SwapDirection.TokenToEth && !isAllowanceLoading) {
      if (
        allowance !== undefined &&
        parsedAmount > BigInt(0) &&
        allowance < parsedAmount
      ) {
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
    isLoading,
  ])

  const disabledBtn = useMemo(() => {
    if (
      status === SwapStatus.NotConnected ||
      status === SwapStatus.WrongNetwork
    ) {
      return false
    }

    if (status === SwapStatus.Loading) {
      return true
    }

    if (status === SwapStatus.InsufficientBalance) {
      return true
    }

    const amountNum = Number(amount)
    if (!amount || amountNum <= 0 || isNaN(amountNum)) {
      return true
    }

    return false
  }, [amount, status])

  const value: SwapContextType = {
    direction,
    amount,
    status,
    fromToken,
    toToken,
    setAmount,
    handleSwitch,
    setLoadingState,
    disabledBtn,
    parsedAmount,
    allowance,
    isAllowanceLoading,
  }

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>
}
