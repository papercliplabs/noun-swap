import { getNounById } from "@/data/noun/getNounById";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SuccessfulNounSwapGraphic } from "@/components/SuccessfulNounSwapGraphic";
import { SomethingWentWrong } from "@/components/SomethingWentWrong";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import WalletButton from "@/components/WalletButton";
import { Button } from "@/components/ui/button";
import ShareToFarcaster from "@/components/ShareToFarcaster";

export default function SwapSuccessPage({
  params,
}: {
  params: { fromNounId: string; toNounId: string; txHash: string };
}) {
  return (
    <div className="flex grow flex-col items-center">
      <div className="flex w-full items-center justify-between px-4 pb-2 pt-4 md:px-10">
        <Suspense fallback={<LoadingSpinner />}>
          <Link href="/" className="text-content-primary flex shrink grow-0 flex-row gap-2 [&>svg]:hover:rotate-12">
            <Icon icon="swap" size={28} className="fill-gray-900 transition-all ease-linear" />
            <h5 className="hidden md:flex">NounSwap</h5>
          </Link>
        </Suspense>
        <WalletButton />
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <DataWrapper fromNounId={params.fromNounId} toNounId={params.toNounId} txHash={params.txHash} />
      </Suspense>
      <div className="item-center border-border-secondary text-content-secondary flex w-full flex-col-reverse items-center justify-end gap-6 border-t-4 px-4 py-4 md:fixed md:bottom-0 md:flex-row md:bg-white md:px-10 md:py-2">
        <span className="text-center">📸 Take a screenshot and share with the world!</span>
        <Link href="/" className="w-full md:w-fit">
          <Button className="w-full">Back to NounSwap</Button>
        </Link>
      </div>
    </div>
  );
}

async function DataWrapper({ fromNounId, toNounId, txHash }: { fromNounId: string; toNounId: string; txHash: string }) {
  const fromNoun = await getNounById(fromNounId);
  const toNoun = await getNounById(toNounId);

  if (!fromNoun || !toNoun) {
    return <SomethingWentWrong message="One of these nouns doesn't exist." returnHref="/" />;
  }

  const frameUrl = `https://frames.paperclip.xyz/nounswap/instant-swap/1/${fromNounId}/${toNounId}/${txHash}`;

  return (
    <div className="items flex w-full grow flex-col items-center gap-4 p-4 pt-[10vh]">
      <SuccessfulNounSwapGraphic fromNoun={fromNoun} toNoun={toNoun} />
      <h1>Swapped!</h1>
      <span className="paragraph-lg text-center">Congratulations you now own Noun {toNounId}!</span>
      <ShareToFarcaster text={`I just swapped on @nounswap, check out my new Noun!`} embeds={[frameUrl]} />
    </div>
  );
}

// async function DataWrapper({ fromNounId, toNounId, txHash }: { fromNounId: string; toNounId: string; txHash: string }) {
//   const fromNoun = await getNounById(fromNounId);
//   const toNoun = await getNounById(toNounId);

//   if (!fromNoun || !toNoun) {
//     return <SomethingWentWrong message="One of these nouns doesn't exist." returnHref="/" />;
//   }

//   const frameUrl = `https://frames.paperclip.xyz/nounswap/instant-swap/1/${fromNounId}/${toNounId}/${txHash}`;

//   return (
//     <div className="items flex w-full max-w-[900px] grow flex-col items-center gap-6 p-4 pt-[10vh] md:flex-row md:justify-start md:gap-[80px]">
//       <SuccessfulNounSwapGraphic fromNoun={fromNoun} toNoun={toNoun} />
//       {/* <div className="aspect-square max-h-[400px] w-full max-w-[400px] rounded-[40px] p-[7px] shadow-2xl md:p-[12px]">
//         <Image src={`${frameUrl}/image`} alt="" width={400} height={400} className="h-full w-full rounded-[32px]" />
//       </div> */}
//       <div className="flex flex-col items-center gap-6 md:items-start md:gap-10">
//         <h1>You now own Noun {toNounId}!</h1>
//         <ShareToFarcaster
//           text={`I just swapped on @nounswap, check out my new Noun!`}
//           embeds={[`https://frames.paperclip.xyz/nounswap/instant-swap/1/${fromNounId}/${toNounId}/${txHash}`]}
//         />
//       </div>
//     </div>
//   );
// }
