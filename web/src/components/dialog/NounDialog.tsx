"use client";
import { useSearchParams } from "next/navigation";
import { Dialog, DialogContent } from "../ui/dialogBase";
import clsx from "clsx";
import Image from "next/image";
import { Noun, NounTraitType } from "@/data/noun/types";
import { Separator } from "../ui/separator";
import { useCallback, useMemo } from "react";
import { CHAIN_CONFIG } from "@/config";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import HowItWorksDialog from "./HowItWorksDialog";
import { useNounImage } from "@/hooks/useNounImage";
import Icon from "../ui/Icon";
import { UserAvatar, UserName, UserRoot } from "../User/UserClient";
import { scrollToNounExplorer } from "@/utils/scroll";

interface NounsDialogProps {
  nouns: Noun[];
}

export default function NounDialog({ nouns }: NounsDialogProps) {
  const searchParams = useSearchParams();
  const nounId = searchParams.get("nounId");

  const noun = useMemo(() => {
    return nounId ? nouns.find((noun) => noun.id === nounId) : undefined;
  }, [nouns, nounId]);

  const fullImageData = useNounImage("full", noun);

  function handleOpenChange(open: boolean) {
    if (!open) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("nounId");
      window.history.pushState(null, "", `?${params.toString()}`);
    }
  }

  const heldByTreasury = useMemo(() => {
    return noun?.owner == CHAIN_CONFIG.addresses.nounsTreasury;
  }, [noun]);

  const heldByNounsErc20 = useMemo(() => {
    return noun?.owner == CHAIN_CONFIG.addresses.nounsErc20;
  }, [noun]);

  if (!noun) {
    return null;
  }

  return (
    <Dialog open={nounId != undefined} onOpenChange={handleOpenChange}>
      <DialogContent
        className={clsx(
          "max-h-[80vh] min-w-0 max-w-[95vw] overflow-hidden overflow-y-auto rounded-2xl border-none p-0 md:max-w-[min(85vw,1400px)] md:overflow-y-hidden",
          noun.traits.background.seed == 1 ? "bg-nouns-warm" : "bg-nouns-cool"
        )}
      >
        <div className="flex aspect-auto w-full flex-col md:aspect-[100/45] md:flex-row">
          <div className="flex h-fit w-full shrink-0 justify-center md:h-full md:w-[45%]">
            <Image
              src={fullImageData ?? "/noun-loading-skull.gif"}
              width={600}
              height={600}
              alt=""
              unoptimized={fullImageData == undefined}
              className="aspect-square h-full max-h-[400px] w-full max-w-[400px] object-contain object-bottom md:max-h-none md:max-w-none"
            />
          </div>
          <div className="flex flex-auto flex-col gap-6 overflow-visible px-6 pb-6 pt-12 md:h-full md:overflow-y-auto md:px-8">
            <h1>Noun {noun.id}</h1>

            <Separator className="h-[2px]" />

            <UserRoot address={noun.owner} className="w-full max-w-full items-center gap-6">
              <UserAvatar />
              <div className="flex h-full min-w-0 flex-col justify-start overflow-hidden">
                <span className="paragraph-sm text-content-secondary">Held by</span>
                <UserName className="label-md text-content-primary hover:text-content-primary/80" />
              </div>
            </UserRoot>

            {heldByTreasury && (
              <>
                <Link href={`/treasury-swap/${noun.id}`}>
                  <Button className="w-full">Create a swap offer</Button>
                </Link>
                <div className="text-content-secondary">
                  You can create a swap offer for this Noun.{" "}
                  <HowItWorksDialog>
                    <span className="text-semantic-accent">
                      <button>Learn More</button>
                    </span>
                  </HowItWorksDialog>
                </div>
              </>
            )}

            {heldByNounsErc20 && (
              <>
                <Link href={`/instant-swap/${noun.id}`}>
                  <Button className="w-full gap-[10px]">
                    <Icon icon="lightning" size={20} className="fill-white" />
                    Instant swap
                  </Button>
                </Link>
                <div className="text-content-secondary">
                  This Noun can be instantly swapped with any Noun you own. No need for a proposal because its held in
                  the $nouns contract. Just swap it.
                </div>
              </>
            )}

            <Separator className="h-[2px]" />

            <div className="flex flex-col gap-4">
              <h5>Traits</h5>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <NounTraitCard type="head" noun={noun} />
                <NounTraitCard type="glasses" noun={noun} />
                <NounTraitCard type="body" noun={noun} />
                <NounTraitCard type="accessory" noun={noun} />
                <NounTraitCard type="background" noun={noun} />
              </div>
            </div>

            <Separator className="h-[2px]" />

            <span className="paragraph-sm text-content-secondary">One Noun, Every Day, Forever.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NounTraitCard({ type, noun }: { type: NounTraitType; noun?: Noun }) {
  const searchParams = useSearchParams();
  const traitImage = useNounImage(type, noun);
  const trait = noun?.traits[type];

  const handleClick = useCallback(() => {
    if (trait) {
      const currentParams = new URLSearchParams(searchParams.toString());
      const params = new URLSearchParams();
      const filterKey = type + "[]";

      // Remove all filters but this one, also will close the card since removing nounId
      params.set(filterKey, trait.seed.toString());

      // Keep auctionId
      const auctionId = currentParams.get("auctionId");
      if (auctionId) {
        params.set("auctionId", auctionId);
      }

      window.history.pushState(null, "", `?${params.toString()}`);

      // Scroll explore section into view
      scrollToNounExplorer();
    }
  }, [type, trait, searchParams]);

  return (
    <button
      className="clickable-active flex justify-start gap-4 rounded-xl bg-black/5 p-2 text-start hover:bg-black/10"
      onClick={() => handleClick()}
    >
      {traitImage ? (
        <Image src={traitImage} width={48} height={48} alt="" className="h-12 w-12 rounded-lg" />
      ) : (
        <Skeleton className="h-12 w-12 rounded-lg" />
      )}
      <div className="flex flex-col">
        <span className="paragraph-sm text-content-secondary">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
        <span className="label-md">
          {trait?.name
            ?.split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </span>
      </div>
    </button>
  );
}
