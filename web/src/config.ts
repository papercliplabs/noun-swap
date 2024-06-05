import { Address, Client, createClient, fallback, getAddress, http } from "viem";
import { mainnet, Chain, sepolia } from "viem/chains";
import dotenv from "dotenv";

dotenv.config();

export interface ChainSpecificData {
  chain: Chain;
  publicClient: Client;
  rpcUrl: {
    primary: string;
    fallback: string;
  };
  addresses: {
    nounsToken: Address;
    nounsTreasury: Address; // a.k.a NounsDAOExecutor, which is the treasury time lock
    nounsDoaProxy: Address; // GovernorBravoDelegator, proxy to logic contract
    nounsDoaDataProxy: Address; // proxy to NounsDAOData.sol contract, which
    nounsAuctionHouseProxy: Address;
  };
  nounsGovernanceUrl: string;
  subgraphUrl: {
    primary: string;
    fallback: string;
  };
  wrappedNativeTokenAddress: Address;
  swapForWrappedNativeUrl: string;
}

export const mainnetPublicClient = createClient({
  chain: mainnet,
  transport: fallback([
    http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!}`),
    http(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY!}`),
  ]),
});

const CHAIN_SPECIFIC_CONFIGS: Record<number, ChainSpecificData> = {
  [mainnet.id]: {
    chain: mainnet,
    rpcUrl: {
      primary: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!}`,
      fallback: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY!}`,
    },
    publicClient: mainnetPublicClient,
    addresses: {
      nounsToken: getAddress("0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03"),
      nounsTreasury: getAddress("0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71"),
      nounsDoaProxy: getAddress("0x6f3E6272A167e8AcCb32072d08E0957F9c79223d"),
      nounsDoaDataProxy: getAddress("0xf790A5f59678dd733fb3De93493A91f472ca1365"),
      nounsAuctionHouseProxy: getAddress("0x830BD73E4184ceF73443C15111a1DF14e495C706"),
    },
    nounsGovernanceUrl: "https://nouns.camp/",
    subgraphUrl: {
      primary: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.DECENTRALIZED_SUBGRAPH_API_KEY}/deployments/id/QmaGTf5zdPhmcxXjUs23bMdhSdFU8LsMyho5saptQXAuCT`,
      fallback: "https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns/prod/gn",
    },
    wrappedNativeTokenAddress: getAddress("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"),
    swapForWrappedNativeUrl:
      "https://app.uniswap.org/swap?outputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&chain=mainnet",
  },
  [sepolia.id]: {
    chain: sepolia,
    rpcUrl: {
      primary: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!}`,
      fallback: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY!}`,
    },
    publicClient: createClient({
      chain: sepolia,
      transport: fallback([
        http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!}`),
        http(`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY!}`),
      ]),
    }),
    addresses: {
      nounsToken: getAddress("0x4C4674bb72a096855496a7204962297bd7e12b85"),
      nounsTreasury: getAddress("0x07e5D6a1550aD5E597A9b0698A474AA080A2fB28"),
      nounsDoaProxy: getAddress("0x35d2670d7C8931AACdd37C89Ddcb0638c3c44A57"),
      nounsDoaDataProxy: getAddress("0x9040f720AA8A693F950B9cF94764b4b06079D002"),
      nounsAuctionHouseProxy: getAddress("0x488609b7113FCf3B761A05956300d605E8f6BcAf"),
    },
    nounsGovernanceUrl: "https://sepolia.nouns.camp/",
    subgraphUrl: {
      // primary: "https://api.studio.thegraph.com/query/35078/nouns-sepolia/version/latest", // TODO: deploy and use that version
      // fallback: "https://api.studio.thegraph.com/query/35078/nouns-sepolia/version/latest", // TODO: deploy and use that version
      primary: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.DECENTRALIZED_SUBGRAPH_API_KEY}/deployments/id/QmYZnkWSMeHREiW51ABPqpnssH11nKiV1NBJv46W4Duogn`,
      fallback: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.DECENTRALIZED_SUBGRAPH_API_KEY}/deployments/id/QmYZnkWSMeHREiW51ABPqpnssH11nKiV1NBJv46W4Duogn`,
    },
    wrappedNativeTokenAddress: getAddress("0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"),
    swapForWrappedNativeUrl: "",
  },
};

export const CHAIN_CONFIG = CHAIN_SPECIFIC_CONFIGS[Number(process.env.NEXT_PUBLIC_CHAIN_ID!)]!;