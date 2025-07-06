import { PropsWithChildren } from 'react'
import {
  darkTheme,
  RainbowKitProvider as RainbowKit,
} from '@rainbow-me/rainbowkit'

import '@rainbow-me/rainbowkit/styles.css'

const theme = darkTheme({
  accentColor: 'rgba(255, 255, 255, 0.12)',
})

function RainbowKitProvider({ children }: PropsWithChildren) {
  return (
    <RainbowKit theme={theme} modalSize="compact">
      {children}
    </RainbowKit>
  )
}

export default RainbowKitProvider
