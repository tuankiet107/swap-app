import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import {
  DefaultCoinIcon,
  EthIcon,
  SpinCircleIcon,
  SwitchIcon,
} from '@/components/icons'
import SwapButton from '@/components/shared/SwapButton'

import { cn } from '@/utils'
import env from '@/configs/env.config'
import supportedChains from '@/configs/supported-chains.config'

import { SwapDirection, SwapStatus } from '@/types'

export default function Home() {
  const [direction, setDirection] = useState<SwapDirection>(
    SwapDirection.EthToToken,
  )
  const [status, setStatus] = useState<SwapStatus>(SwapStatus.ReadyToSwap)
  const [amount, setAmount] = useState<number>(0)

  // TODO: remove when mapping
  const dummyBalance = 10

  const { isConnected, chain } = useAccount()

  const isEthToToken = direction === SwapDirection.EthToToken

  const handleSwitch = () => {
    setDirection((prev) =>
      prev === SwapDirection.EthToToken
        ? SwapDirection.TokenToEth
        : SwapDirection.EthToToken,
    )

    setAmount(0)
  }

  useEffect(() => {
    if (!isConnected) {
      setStatus(SwapStatus.NotConnected)
      return
    }

    if (chain?.id !== supportedChains[env][0].id) {
      setStatus(SwapStatus.WrongNetwork)
      return
    }

    if (amount > dummyBalance) {
      setStatus(SwapStatus.InsufficientBalance)
      return
    }

    setStatus(SwapStatus.ReadyToSwap)
  }, [isConnected, chain, amount])

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
                  <span>0.001</span> {/* TODO: Call contract to get symbol */}
                  <span>{isEthToToken ? 'ETH' : 'MTK'}</span>
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
                />
                <button className="hover:text-blue-800 font-medium">Max</button>
              </div>

              {isEthToToken ? <EthIcon /> : <DefaultCoinIcon />}
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
                  <span>0.001</span> {/* TODO: Call contract to get symbol */}
                  <span>{isEthToToken ? 'MTK' : 'ETH'}</span>
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
                />
              </div>
              {!isEthToToken ? <EthIcon /> : <DefaultCoinIcon />}
            </div>
          </div>
        </div>

        <SwapButton status={status} onClick={() => {}} />
      </div>
    </div>
  )
}
