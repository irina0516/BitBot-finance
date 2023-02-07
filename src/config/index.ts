import { config as mainnetConfig } from "./mainnet"
import { config as envConfig } from "./env"
import { Config } from "./ConfigType"

const networkId = parseInt(process.env.REACT_APP_NETWORK_ID as string)
// const networkId = 250
const config: Config = networkId === 1 ? mainnetConfig : envConfig
export const botAddress = "0x0621d9c22fad25bf5b88735defb419fa60f118f7";
export default config
