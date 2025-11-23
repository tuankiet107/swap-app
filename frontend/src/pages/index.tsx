import Home from '@/views/home'
import { SwapProvider } from '@/contexts/swap.context'

export default function App() {
  return (
    <SwapProvider>
      <Home />
    </SwapProvider>
  )
}
