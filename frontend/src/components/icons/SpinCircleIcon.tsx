import { PropsWithChildren } from 'react'

import { cn } from '@/utils/tailwind.util'

export const SpinCircleIcon = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <div className={className}>
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full">
      <div
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'h-full w-full rounded-full',
        )}
      >
        <div
          className={cn(
            'h-full w-full',
            'bg-[linear-gradient(to_right,#25ffeb_7%,black_43%,#25ffeb_100%)]',
            'animate-spin',
            '[animation-duration:6s]',
          )}
        />
      </div>

      <div
        className={cn(
          'h-[calc(100%_-_4px)] w-[calc(100%_-_4px)] rounded-full',
          'z-10 bg-white',
          'flex items-center justify-center',
        )}
      >
        {children}
      </div>
    </div>
  </div>
)
