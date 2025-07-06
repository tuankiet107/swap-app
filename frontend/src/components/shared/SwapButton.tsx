import { useConnectModal } from '@rainbow-me/rainbowkit'

import { SwitchIcon } from '@/components/icons'

import { cn } from '@/utils'

import { SwapStatus } from '@/types'

interface SwapButtonProps {
  status: SwapStatus
  onClick: () => void
}

export default function SwapButton({ status, onClick }: SwapButtonProps) {
  const { openConnectModal } = useConnectModal()

  const buttonLabel = () => {
    switch (status) {
      case SwapStatus.Loading:
        return 'Swapping...'
      case SwapStatus.NotConnected:
        return 'Connect Wallet'
      case SwapStatus.WrongNetwork:
        return 'Wrong Network'
      case SwapStatus.InsufficientBalance:
        return 'Insufficient Balance'
      case SwapStatus.ReadyToSwap:
      default:
        return 'Swap'
    }
  }

  const isDisabled = [
    SwapStatus.Loading,
    SwapStatus.InsufficientBalance,
  ].includes(status)

  const handleClick = () => {
    if (status === SwapStatus.NotConnected) {
      openConnectModal?.()
      return
    }

    if (!isDisabled) {
      onClick()
    }
  }

  return (
    <button
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(
        'w-full h-12 flex justify-center items-center gap-2 rounded-md font-medium transition-all',
        isDisabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-500 text-white',
      )}
    >
      <span>{buttonLabel()}</span>
      {status === SwapStatus.ReadyToSwap && <SwitchIcon />}
    </button>
  )
}
