export enum SwapDirection {
  EthToToken = 'ETH_TO_TOKEN',
  TokenToEth = 'TOKEN_TO_ETH',
}

export enum SwapStatus {
  Loading = 'LOADING',
  NotConnected = 'NOT_CONNECTED',
  WrongNetwork = 'WRONG_NETWORK',
  InsufficientBalance = 'INSUFFICIENT_BALANCE',
  ReadyToSwap = 'READY_TO_SWAP',
}

export type TokenInfoProps = {
  balance: string
  symbol: string
  icon: React.ComponentType
  rawBalance?: bigint
}
