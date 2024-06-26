import { ponder } from "@/generated";
import { zeroAddress } from "viem";

ponder.on("NounsErc20:Transfer", async ({ event, context }) => {
  const { NounsErc20Transfer, User } = context.db;

  // From user
  if (event.args.from != zeroAddress) {
    await User.upsert({
      id: event.args.from,
      create: {
        address: event.args.from,
        mainnetNounsErc20Balance: -event.args.value,
        baseNounsErc20Balance: BigInt(0),
        nounBalance: BigInt(0),
      },
      update: ({ current }) => ({
        mainnetNounsErc20Balance: current.mainnetNounsErc20Balance - event.args.value,
      }),
    });
  }

  // To user
  if (event.args.to != zeroAddress) {
    await User.upsert({
      id: event.args.to,
      create: {
        address: event.args.to,
        mainnetNounsErc20Balance: event.args.value,
        baseNounsErc20Balance: BigInt(0),
        nounBalance: BigInt(0),
      },
      update: ({ current }) => ({
        mainnetNounsErc20Balance: current.mainnetNounsErc20Balance + event.args.value,
      }),
    });
  }

  await NounsErc20Transfer.create({
    id: event.log.transactionHash + "-" + event.log.logIndex,
    data: {
      timestamp: event.block.timestamp,
      amount: event.args.value,
      from: event.args.from,
      to: event.args.to,
    },
  });
});

ponder.on("NounsErc20Base:Transfer", async ({ event, context }) => {
  const { User } = context.db;

  // From user
  if (event.args.from != zeroAddress) {
    await User.upsert({
      id: event.args.from,
      create: {
        address: event.args.from,
        mainnetNounsErc20Balance: BigInt(0),
        baseNounsErc20Balance: -event.args.value,
        nounBalance: BigInt(0),
      },
      update: ({ current }) => ({
        baseNounsErc20Balance: current.baseNounsErc20Balance - event.args.value,
      }),
    });
  }

  // To user
  if (event.args.to != zeroAddress) {
    await User.upsert({
      id: event.args.to,
      create: {
        address: event.args.to,
        mainnetNounsErc20Balance: BigInt(0),
        baseNounsErc20Balance: event.args.value,
        nounBalance: BigInt(0),
      },
      update: ({ current }) => ({
        baseNounsErc20Balance: current.baseNounsErc20Balance + event.args.value,
      }),
    });
  }
});
