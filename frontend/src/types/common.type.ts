export enum SwapDirection {
  EthToToken = 'ETH_TO_TOKEN',
  TokenToEth = 'TOKEN_TO_ETH',
}

export enum SwapStatus {
  Loading = 'LOADING',
  NotConnected = 'NOT_CONNECTED',
  WrongNetwork = 'WRONG_NETWORK',
  InsufficientBalance = 'INSUFFICIENT_BALANCE',
  NeedsApproval = 'NEEDS_APPROVAL',
  ReadyToSwap = 'READY_TO_SWAP',
}

export type TokenInfoProps = {
  balance: string
  symbol: string
  decimals: number
  icon: React.ComponentType
  rawBalance?: bigint
  rawReserve?: bigint
}
