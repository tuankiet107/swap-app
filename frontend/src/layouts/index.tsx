import { ReactNode } from 'react'

import ConnectWalletBtn from '@/components/shared/ConnectWalletBtn'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <header className="h-12 flex items-center justify-end w-full px-6">
        <ConnectWalletBtn />
      </header>

      <main className="main-container">{children}</main>
    </div>
  )
}

export default MainLayout
