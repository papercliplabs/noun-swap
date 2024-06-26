import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  NounsTokenTransfer: p.createTable({
    id: p.string(), // tx hash + log index
    timestamp: p.bigint(),
    tokenId: p.bigint(),
    from: p.hex(),
    to: p.hex(),
  }),
  // Erc20Token: p.createTable({
  //   id: p.hex(), // address
  //   address: p.hex(),
  //   name: p.string(),
  //   decimals: p.int()
  // }),
  NounsErc20Transfer: p.createTable({
    id: p.string(), // tx hash + log index
    timestamp: p.bigint(),
    amount: p.bigint(),
    from: p.hex(),
    to: p.hex(),
  }),
  User: p.createTable({
    id: p.hex(), // address
    address: p.hex(),
    nounBalance: p.bigint(),
    mainnetNounsErc20Balance: p.bigint(),
    baseNounsErc20Balance: p.bigint(),
  }),
  // NounsErc20Summary: p.createTable({
  //   id: p.string(),
  //   mainnetTotalSupply: p.bigint(),
  //   baseTotalSupply: p.bigint(),
  //   numMainnetHolders: p.bigint(),
  //   numBaseHolders: p.bigint(),
  // }),
}));
