import { Address, erc20Abi } from 'viem'
import { useWriteContract } from 'wagmi'

type UseApproveTokenProps = {
  operator: Address
  token: Address
  amount: bigint
}

export const useApproveToken = ({
  operator,
  token,
  amount,
}: UseApproveTokenProps) => {
  const {
    writeContractAsync,
    isPending,
    isSuccess,
    isError,
    data: approvedHash,
  } = useWriteContract()

  const approve = () => {
    return writeContractAsync({
      address: token,
      abi: erc20Abi,
      functionName: 'approve',
      args: [operator, amount],
    })
  }

  return {
    approve,
    approvedHash,
    isLoading: isPending,
    isSuccess,
    isError,
  }
}
