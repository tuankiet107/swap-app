import { useAccount, useBalance } from 'wagmi'
import { useMemo } from 'react'
import { formatUnits } from 'viem'

import { DefaultCoinIcon, EthIcon } from '@/components/icons'

import { useGetReserves } from './useGetReserves'
import { useErc20TokenInfo } from './useErc20TokenInfo'

import { contracts } from '@/configs'
import { formatNumber } from '@/utils'

import { SwapDirection, TokenInfoProps } from '@/types'

export const useSwapData = (direction: SwapDirection) => {
  const { address: userAddress } = useAccount()
  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address: userAddress,
  })
  const {
    data: { balance: tokenBalance, symbol, decimals },
    refetch: refetchTokenBalance,
  } = useErc20TokenInfo(contracts.tokenAddress, userAddress!)

  const { data: rawReserves, refetch: refetchReserves } = useGetReserves()

  const isEthToToken = direction === SwapDirection.EthToToken

  const formattedEthBalance = useMemo(() => {
    if (ethBalance) {
      return formatNumber(formatUnits(ethBalance.value, ethBalance.decimals))
    }
    return '0'
  }, [ethBalance])

  const formattedTokenBalance = useMemo(() => {
    if (tokenBalance !== undefined && decimals !== undefined) {
      return formatNumber(formatUnits(tokenBalance, decimals))
    }
    return '0'
  }, [tokenBalance, decimals])

  const fromToken: TokenInfoProps = useMemo(() => {
    if (isEthToToken) {
      return {
        balance: formattedEthBalance,
        symbol: 'ETH',
        decimals: 18,
        icon: EthIcon,
        rawBalance: ethBalance?.value ?? BigInt(0),
        rawReserve: rawReserves?.ethReserve ?? BigInt(0),
      }
    } else {
      return {
        balance: formattedTokenBalance,
        symbol: symbol ?? 'MTK',
        decimals: decimals || 18,
        icon: DefaultCoinIcon,
        rawBalance: tokenBalance ?? BigInt(0),
        rawReserve: rawReserves?.tokenReserve ?? BigInt(0),
      }
    }
  }, [
    isEthToToken,
    formattedEthBalance,
    ethBalance?.value,
    rawReserves?.ethReserve,
    rawReserves?.tokenReserve,
    formattedTokenBalance,
    symbol,
    decimals,
    tokenBalance,
  ])

  const toToken: TokenInfoProps = useMemo(() => {
    if (!isEthToToken) {
      return {
        balance: formattedEthBalance,
        symbol: 'ETH',
        decimals: decimals || 18,
        icon: EthIcon,
        rawReserve: rawReserves?.ethReserve ?? BigInt(0),
      }
    } else {
      return {
        balance: formattedTokenBalance,
        symbol: symbol ?? 'MTK',
        decimals: 18,
        icon: DefaultCoinIcon,
        rawReserve: rawReserves?.tokenReserve ?? BigInt(0),
      }
    }
  }, [
    isEthToToken,
    formattedEthBalance,
    decimals,
    rawReserves?.ethReserve,
    rawReserves?.tokenReserve,
    formattedTokenBalance,
    symbol,
  ])

  return {
    fromToken,
    toToken,
    refetchEthBalance,
    refetchTokenBalance,
    refetchReserves,
  }
}
