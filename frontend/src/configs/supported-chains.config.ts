import type { Chain as RainbowKitChain } from '@rainbow-me/rainbowkit'
import { mainnet, sepolia } from 'viem/chains'

import type { Env } from './env.config'

import EthChainLogo from '@/assets/img/chain/eth-chain.png'

const supportedChains: Record<Env, [RainbowKitChain, ...RainbowKitChain[]]> = {
  development: [{ ...sepolia, iconUrl: EthChainLogo.src }],
  staging: [{ ...sepolia, iconUrl: EthChainLogo.src }],
  production: [{ ...mainnet, iconUrl: EthChainLogo.src }],
}

export default supportedChains
