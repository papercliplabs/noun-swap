import { getAddress, Address } from "viem";
// import { ChainId, getContractAddressesForChainOrThrow } from "@nouns/sdk";

// const nounsAddresses = getContractAddressesForChainOrThrow(5);

// export const NOUNS_TREASURY_ADDRESS: Address = getAddress("0xb1a32fc9f9d8b2cf86c068cae13108809547ef71"); // Mainnet
// export const NOUNS_TREASURY_ADDRESS: Address = getAddress("0x07e5D6a1550aD5E597A9b0698A474AA080A2fB28"); // Sepolia
export const NOUNS_TREASURY_ADDRESS: Address = getAddress("0xc15008dE43D93D115BD64ED4D95817fFdBfb6DEA"); // Goerli
export const NOUNS_TOKEN_ADDRESS: Address = getAddress("0x99265CE0983aab76F5a3789663FDD887dE66638A");
export const NOUNS_DOA_PROXY: Address = getAddress("0x22F7658f64be277e6b3968ecE7b773b092a39864");

export const NOUN_SWAP_CONTRACT_ADDRESS: Address = getAddress("0xaF45ecd8391b22E2006bD90BD743617948A823be");

export const NOUNS_WTF_PROP_URL = "https://nouns-webapp-nu.vercel.app/vote";

// For testing only
export const LOCAL_ANVIL_0_ADDRESS: Address = getAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
export const NOUNDERS_ADDRESS: Address = getAddress("0x2573c60a6d127755aa2dc85e342f7da2378a0cc5");

export const SUBGRAPH_URL =
    "https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns-v3-goerli/0.1.6/gn";

// NounsDAOExecutorProxy => NounsDAOExecutor: a.k.a Treasury
// NounsDAOProxy => NounsDOALogic: a.k.a Governance (don't need this if we go without props)
