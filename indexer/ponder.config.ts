import { createConfig, loadBalance, rateLimit } from "@ponder/core";
import { http } from "viem";

import { NounsTokenAbi } from "./abis/NounsTokenAbi";
import { nounsErc20Abi } from "./abis/nounsErc20";
import { base } from "viem/chains";
import { erc20Abi } from "./abis/erc20";

export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      transport: loadBalance([
        // http(process.env.PONDER_RPC_URL_1),
        rateLimit(http("https://eth.llamarpc.com"), { requestsPerSecond: 15 }),
        rateLimit(http("https://rpc.ankr.com/eth"), { requestsPerSecond: 15 }),
        rateLimit(http("https://mainnet.gateway.tenderly.co"), { requestsPerSecond: 15 }),
        rateLimit(http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY!}`), {
          requestsPerSecond: 12,
        }),
      ]),
    },
    base: {
      chainId: base.id,
      transport: loadBalance([
        rateLimit(http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY!}`), {
          requestsPerSecond: 12,
        }),
      ]),
    },
  },
  contracts: {
    NounsToken: {
      abi: NounsTokenAbi,
      address: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
      network: "mainnet",
      startBlock: 12985438,
    },
    NounsErc20: {
      abi: nounsErc20Abi,
      address: "0x5c1760c98be951A4067DF234695c8014D8e7619C",
      network: "mainnet",
      startBlock: 20025747,
    },
    NounsErc20Base: {
      abi: erc20Abi,
      address: "0x0a93a7BE7e7e426fC046e204C44d6b03A302b631",
      network: "base",
      startBlock: 15399701,
    },
  },
});
