type Config = {
  projectId: string
}

const configs: Config = {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
}

export default configs
