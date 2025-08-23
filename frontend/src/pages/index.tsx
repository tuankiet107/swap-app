import { useMemo } from 'react'

import { SpinCircleIcon, SwitchIcon } from '@/components/icons'
import SwapButton from '@/components/shared/SwapButton'

import { useGetAmountOut } from '@/hooks/useGetAmountOut'
import { useSwapActions } from '@/hooks/useSwapActions'
import { useSwapData } from '@/hooks/useSwapData'
import { useSwapState } from '@/hooks/useSwapState'

import { cn, formatNumber } from '@/utils'

import { SwapStatus } from '@/types'

export default function Home() {
  const { direction, amount, setAmount, handleSwitch } = useSwapState()
  const { fromToken, toToken } = useSwapData(direction)
  const { status, handleSwap } = useSwapActions(
    fromToken,
    direction,
    amount,
    setAmount,
  )
  const { data: amountOut } = useGetAmountOut(
    amount,
    fromToken?.rawReserve ?? BigInt(0),
    toToken?.rawReserve ?? BigInt(0),
  )

  const disabledBtn = useMemo(() => {
    const hasAmounts = Number(amount) > 0 && Number(amountOut) > 0

    return (
      [SwapStatus.Loading, SwapStatus.InsufficientBalance].includes(status) ||
      !hasAmounts
    )
  }, [amount, amountOut, status])

  return (
    <div className="w-screen h-full flex justify-center items-center">
      <div
        className={cn(
          'w-full max-w-[520px] p-6 flex flex-col gap-4 mx-3',
          'border border-gray-200 rounded-lg',
        )}
      >
        <h3 className="text-[26px] text-black mobile:text-xl">Swap Token</h3>

        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-end items-center mb-2">
              <p>
                <span className="text-base text-gray-500">Balance </span>
                <span className="text-blue-700 font-bold">
                  <span>{fromToken.balance}</span>{' '}
                  <span className="font-extrabold">{fromToken.symbol}</span>
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg h-[90px]">
              <div className="flex flex-col items-start gap-2">
                <input
                  type="number"
                  className="h-6 text-xl outline-none"
                  placeholder="0"
                  min={0}
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                />
                <button
                  className="hover:text-blue-800 font-medium"
                  onClick={() => setAmount(fromToken.balance.replace(/,/g, ''))}
                >
                  Max
                </button>
              </div>
              <fromToken.icon />
            </div>
          </div>

          <button className="size-6 rotate-90 mx-auto" onClick={handleSwitch}>
            <SpinCircleIcon className="h-11 w-11 mobile:h-[30px] mobile:w-[30px]">
              <SwitchIcon />
            </SpinCircleIcon>
          </button>

          <div>
            <div className="flex justify-end items-center mb-2">
              <p>
                <span className="text-base text-gray-500">Balance </span>
                <span className="text-blue-700 font-bold">
                  <span>{toToken.balance}</span>{' '}
                  <span className="font-extrabold">{toToken.symbol}</span>
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg h-[90px]">
              <div className="flex flex-col items-start gap-2">
                <input
                  type="text"
                  className="h-6 text-xl outline-none"
                  placeholder="0"
                  min={0}
                  value={formatNumber(amountOut)}
                />
              </div>
              <toToken.icon />
            </div>
          </div>
        </div>

        <SwapButton
          isDisabled={disabledBtn}
          status={status}
          onClick={handleSwap}
        />
      </div>
    </div>
  )
}
