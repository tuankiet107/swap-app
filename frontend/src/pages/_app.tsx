import { AppProps } from 'next/app'

import QueryClientProvider from '@/providers/QueryClient.provider'
import RainbowKitProvider from '@/providers/RainbowKit.provider'
import WagmiProvider from '@/providers/Wagmi.provider'

import '@rainbow-me/rainbowkit/styles.css'
import '@/styles/globals.scss'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider>
      <QueryClientProvider>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
