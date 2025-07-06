import { PropsWithChildren } from 'react'
import { WagmiProvider as Wagmi } from 'wagmi'

import wagmiConfig from '@/configs/wagmi.config'

const WagmiProvider = ({ children }: PropsWithChildren) => {
  return <Wagmi config={wagmiConfig}>{children}</Wagmi>
}

export default WagmiProvider
