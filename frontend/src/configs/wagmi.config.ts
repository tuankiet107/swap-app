import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import * as allWallets from '@rainbow-me/rainbowkit/wallets'

import env from './env.config'
import supportedChains from './supported-chains.config'
import walletConnectConfig from './wallet-connect.config'

const { metaMaskWallet, coinbaseWallet, bitgetWallet } = allWallets

const wagmiConfig = getDefaultConfig({
  appName: 'swap-dapp',
  projectId: walletConnectConfig.projectId,
  chains: supportedChains[env],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, bitgetWallet, coinbaseWallet],
    },
    {
      groupName: 'All',
      wallets: Object.values(allWallets),
    },
  ],
})

export default wagmiConfig
