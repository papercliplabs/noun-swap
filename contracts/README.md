# NounSwap Contracts

Smart contracts that allow anyone to swap their Noun with the Nouns treasury, built using [Foundry](https://book.getfoundry.sh/).

# Development

Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

Populate the `.env` file

Build

```bash
forge build
```

Test

```bash
forge test
```

Format

```bash
forge fmt
```

Gas snapshot

```bash
forge snapshot
```

Deploy

```bash
# Goerli
source .env; forge create NounSwap --contracts src/NounSwap.sol --private-key $FOUNDRY_PRIVATE_KEY --rpc-url $GOERLI_RPC_URL --constructor-args 0x99265CE0983aab76F5a3789663FDD887dE66638A 0xc15008dE43D93D115BD64ED4D95817fFdBfb6DEA --etherscan-api-key $ETHERSCAN_API_KEY --verify

# Mainnet (TODO)
```
