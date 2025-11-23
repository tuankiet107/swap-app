import { AppProps } from 'next/app'

import MainLayout from '@/layouts'
import QueryClientProvider from '@/providers/QueryClient.provider'
import RainbowKitProvider from '@/providers/RainbowKit.provider'
import WagmiProvider from '@/providers/Wagmi.provider'
import { SwapProvider } from '@/contexts/swap.context'

import '@rainbow-me/rainbowkit/styles.css'
import '@/styles/globals.scss'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider>
      <QueryClientProvider>
        <RainbowKitProvider>
          <MainLayout>
            <SwapProvider>
              <Component {...pageProps} />
            </SwapProvider>
          </MainLayout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
