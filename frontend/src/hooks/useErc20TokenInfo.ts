import { useMemo } from 'react'
import { type Address, erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'

interface Erc20TokenInfo {
  address: Address
  balance?: bigint
  decimals?: number
  symbol?: string
}

export function useErc20TokenInfo(tokenAddress: Address, userAddress: Address) {
  const contracts = useMemo(() => {
    return [
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [userAddress],
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'symbol',
      },
    ] as const
  }, [tokenAddress, userAddress])

  const { data, ...rest } = useReadContracts({ contracts })

  const formattedData: Erc20TokenInfo = useMemo(() => {
    return {
      address: tokenAddress,
      balance: data?.[0]?.result ?? BigInt(0),
      decimals: data?.[1]?.result ?? 18,
      symbol: data?.[2]?.result ?? '',
    }
  }, [tokenAddress, data])

  return {
    ...rest,
    data: formattedData,
  }
}
