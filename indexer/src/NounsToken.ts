import { ponder } from "@/generated";
import { zeroAddress } from "viem";

ponder.on("NounsToken:Transfer", async ({ event, context }) => {
  const { NounsTokenTransfer, User } = context.db;

  await NounsTokenTransfer.create({
    id: event.log.transactionHash + "-" + event.log.logIndex,
    data: {
      timestamp: event.block.timestamp,
      tokenId: event.args.tokenId,
      from: event.args.from,
      to: event.args.to,
    },
  });

  // From
  if (event.args.from != zeroAddress) {
    await User.upsert({
      id: event.args.from,
      create: {
        address: event.args.from,
        mainnetNounsErc20Balance: BigInt(0),
        baseNounsErc20Balance: BigInt(0),
        nounBalance: -BigInt(1),
      },
      update: ({ current }) => ({
        nounBalance: current.nounBalance - BigInt(1),
      }),
    });
  }

  // To
  if (event.args.to != zeroAddress) {
    await User.upsert({
      id: event.args.to,
      create: {
        address: event.args.to,
        mainnetNounsErc20Balance: BigInt(0),
        baseNounsErc20Balance: BigInt(0),
        nounBalance: BigInt(1),
      },
      update: ({ current }) => ({
        nounBalance: current.nounBalance + BigInt(1),
      }),
    });
  }
});
