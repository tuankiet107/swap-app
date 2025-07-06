import { type MouseEvent } from 'react'
import { useDisconnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { LogoutIcon } from '../icons'

import { shortenAddress } from '@/utils'

export default function ConnectWalletBtn() {
  const { disconnect } = useDisconnect()

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        authenticationStatus,
        openChainModal,
        mounted,
      }) => {
        const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
          if (!connected) {
            e.preventDefault()
            openConnectModal()
            return
          }

          if (chain?.unsupported) {
            e.preventDefault()
            openChainModal()
            return
          }
        }

        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        if (!connected) {
          return (
            <button
              className="flex items-center justify-center gap-2 rounded border bg-blue-600 px-4 py-2"
              onClick={handleClick}
            >
              <p className="text-base font-bold text-white">Connect Wallet</p>
            </button>
          )
        }

        return (
          <div className="h-12 flex items-center justify-center gap-4 bg-blue-500 rounded px-3 py-2">
            <p className="text-base font-bold uppercase text-white">
              {shortenAddress(account.address)}
            </p>

            <button onClick={() => disconnect()}>
              <LogoutIcon className="text-white" />
            </button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
