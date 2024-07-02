"use client";
import { Noun } from "@/data/noun/types";
import { ReactNode, useEffect } from "react";
import TransactionButton from "@/components/TransactionButton";
import SwapNounGraphic from "@/components/SwapNounGraphic";
import { useNounsErc20Swap } from "@/hooks/transactions/useNounsErc20Swap";
import { useRouter } from "next/navigation";
import { forceAllNounRevalidation } from "@/data/noun/getAllNouns";

interface CreateInstantSwapProps {
  fromNoun: Noun;
  toNoun: Noun;
  progressStepper: ReactNode;
}

export function CreateInstantSwap({ fromNoun, toNoun, progressStepper }: CreateInstantSwapProps) {
  const { swap, error, state, hash } = useNounsErc20Swap();

  const router = useRouter();

  // Autotrigger on mount
  useEffect(() => {
    swap(BigInt(fromNoun.id), BigInt(toNoun.id));
  }, [fromNoun.id, toNoun.id, swap]);

  // Push to swap success page
  useEffect(() => {
    if (state == "success") {
      forceAllNounRevalidation(); // Force revalidation so will update explore
      router.push(`/instant-swap/${toNoun.id}/${fromNoun.id}/${hash}`);
    }
  }, [state, hash, router, fromNoun.id, toNoun.id]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <SwapNounGraphic fromNoun={fromNoun} toNoun={toNoun} instant />
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h4>Confirm Swap</h4>
        <span className="text-content-secondary">
          This will swap Noun {fromNoun.id} for Noun {toNoun.id}.
        </span>
      </div>
      {progressStepper}
      <div className="flex w-full flex-col gap-1">
        <TransactionButton
          txnState={state}
          onClick={() => swap(BigInt(fromNoun.id), BigInt(toNoun.id))}
          className="w-full"
        >
          Swap
        </TransactionButton>
        <span className="paragraph-sm text-semantic-negative">{error?.message}</span>
      </div>
    </div>
  );
}
