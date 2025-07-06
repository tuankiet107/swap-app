export type Env = 'development' | 'staging' | 'production'

const env: Env = (process.env.NEXT_PUBLIC_ENV as Env) || 'development'

export default env
