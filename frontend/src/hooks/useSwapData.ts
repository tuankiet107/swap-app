import { useAccount, useBalance } from 'wagmi'
import { useMemo } from 'react'
import { formatUnits } from 'viem'

import { DefaultCoinIcon, EthIcon } from '@/components/icons'

import { useErc20TokenInfo } from '@/hooks/useErc20TokenInfo'

import { contracts } from '@/configs'
import { formatNumber } from '@/utils'

import { SwapDirection, TokenInfoProps } from '@/types'

export const useSwapData = (direction: SwapDirection) => {
  const { isConnected, chain, address: userAddress } = useAccount()
  const { data: ethBalance } = useBalance({
    address: userAddress,
  })
  const {
    data: { balance: tokenBalance, symbol, decimals },
  } = useErc20TokenInfo(contracts.tokenAddress, userAddress!)

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
        icon: EthIcon,
        rawBalance: ethBalance?.value ?? BigInt(0),
      }
    } else {
      return {
        balance: formattedTokenBalance,
        symbol: symbol ?? 'MTK',
        icon: DefaultCoinIcon,
        rawBalance: tokenBalance ?? BigInt(0),
      }
    }
  }, [
    isEthToToken,
    formattedEthBalance,
    formattedTokenBalance,
    symbol,
    ethBalance,
    tokenBalance,
  ])

  const toToken: TokenInfoProps = useMemo(() => {
    if (!isEthToToken) {
      return {
        balance: formattedEthBalance,
        symbol: 'ETH',
        icon: EthIcon,
      }
    } else {
      return {
        balance: formattedTokenBalance,
        symbol: symbol ?? 'MTK',
        icon: DefaultCoinIcon,
      }
    }
  }, [isEthToToken, formattedEthBalance, formattedTokenBalance, symbol])

  return {
    isConnected,
    chain,
    userAddress,
    fromToken,
    toToken,
  }
}
