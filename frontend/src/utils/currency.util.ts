import numbro from 'numbro'

import { MAX_DECIMALS } from '@/constants'

export const formatNumber = (
  value: string | number,
  decimals: number = MAX_DECIMALS,
) => {
  return numbro(value).format({
    thousandSeparated: true,
    trimMantissa: true,
    mantissa: decimals,
  })
}
