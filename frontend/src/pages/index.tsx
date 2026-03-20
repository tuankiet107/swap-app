import { ToastContainer } from 'react-toastify'
import Head from 'next/head'

import SwapButton from '@/components/shared/SwapButton'
import { SpinCircleIcon, SwitchIcon } from '@/components/icons'
import { useSwapContext } from '@/contexts/swap.context'

import { useGetAmountOut } from '@/hooks/useGetAmountOut'
import { useSwapActions } from '@/hooks/useSwapActions'

import { cn, formatNumber } from '@/utils'
import { SEO_CONFIG } from '@/configs'
import { SwapStatus } from '@/types'

export default function Home() {
  const { amount, setAmount, handleSwitch, fromToken, toToken, status } =
    useSwapContext()

  const { handleSwap } = useSwapActions()

  const { data: amountOut } = useGetAmountOut(
    amount,
    fromToken?.rawReserve ?? BigInt(0),
    toToken?.rawReserve ?? BigInt(0),
  )

  const handleChangeDirection = () => {
    if (status === SwapStatus.Loading) return
    handleSwitch()
  }

  return (
    <>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>Swap DApp - Fast & Secure Token Swap</title>

        <meta
          name="description"
          content="Swap tokens instantly with low fees and secure smart contracts. Built for Web3 users."
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:title"
          content="Swap DApp - Fast & Secure Token Swap"
        />
        <meta
          property="og:description"
          content="Swap tokens instantly with low fees and secure smart contracts."
        />
        <meta
          property="og:image"
          content={`${SEO_CONFIG.origin}/preview.png`}
        />
        <meta property="og:url" content={SEO_CONFIG.origin} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Swap DApp - Fast & Secure Token Swap"
        />
        <meta
          name="twitter:description"
          content="Swap tokens instantly with low fees and secure smart contracts."
        />
        <meta
          name="twitter:image"
          content={`${SEO_CONFIG.origin}/preview.png`}
        />

        <link rel="canonical" href={SEO_CONFIG.origin} />
      </Head>

      <div className="w-screen h-full flex justify-center items-center">
        <div
          className={cn(
            'w-full max-w-[520px] p-6 flex flex-col gap-4 mx-3',
            'border border-gray-200 rounded-lg shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]',
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
                    onClick={() =>
                      setAmount(fromToken.balance.replace(/,/g, ''))
                    }
                  >
                    Max
                  </button>
                </div>
                <fromToken.icon />
              </div>
            </div>

            <button
              className="size-6 rotate-90 mx-auto"
              onClick={handleChangeDirection}
            >
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
                    readOnly
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

          <SwapButton onClick={handleSwap} />

          <ToastContainer />
        </div>
      </div>
    </>
  )
}
