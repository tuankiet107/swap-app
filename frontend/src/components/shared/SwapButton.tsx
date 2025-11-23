import { useSwitchChain } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { SwitchIcon } from '@/components/icons'
import { useSwapContext } from '@/contexts/swap.context'

import { cn } from '@/utils'
import env from '@/configs/env.config'
import supportedChains from '@/configs/supported-chains.config'

import { SwapStatus } from '@/types'

interface SwapButtonProps {
  onClick: () => void
}

export default function SwapButton({ onClick }: SwapButtonProps) {
  const { status, disabledBtn } = useSwapContext()
  const { openConnectModal } = useConnectModal()
  const { switchChain } = useSwitchChain()

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
      case SwapStatus.NeedsApproval:
        return 'Approve Token & Swap'
      case SwapStatus.ReadyToSwap:
      default:
        return 'Swap'
    }
  }

  const handleClick = () => {
    if (status === SwapStatus.NotConnected) {
      return openConnectModal?.()
    }

    if (status === SwapStatus.WrongNetwork) {
      switchChain({ chainId: supportedChains[env][0].id })
    }

    if (
      !disabledBtn &&
      (status === SwapStatus.ReadyToSwap || status === SwapStatus.NeedsApproval)
    ) {
      return onClick()
    }
  }

  const isButtonDisabled =
    status === SwapStatus.Loading ||
    status === SwapStatus.InsufficientBalance ||
    disabledBtn

  return (
    <button
      disabled={isButtonDisabled}
      onClick={handleClick}
      className={cn(
        'w-full h-12 flex justify-center items-center gap-2 rounded-md font-medium transition-all',
        isButtonDisabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-500 text-white',
      )}
    >
      <span>{buttonLabel()}</span>
      {(status === SwapStatus.ReadyToSwap ||
        status === SwapStatus.NeedsApproval) && <SwitchIcon />}
    </button>
  )
}
