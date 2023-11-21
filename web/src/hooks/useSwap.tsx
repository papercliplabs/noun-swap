"use client";
import useSendTransaction, { UseSendTransactionReturnType } from "./useSendTransaction";
import { useMemo } from "react";
import { TransactionRequest, encodeFunctionData } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { nounSwapAbi } from "../abis/nounSwap";
import { Noun } from "../common/types";
import { NOUN_SWAP_CONTRACT_ADDRESS } from "../common/constants";

interface UseSwapProps {
    userNoun?: Noun;
    treasuryNoun?: Noun;
    ready: boolean;
    onReject?: () => void;
}

interface UseSwapReturnType extends UseSendTransactionReturnType {}

export function useSwap({ userNoun, treasuryNoun, ready, onReject }: UseSwapProps): UseSwapReturnType {
    const { address } = useAccount();
    const publicClient = usePublicClient();

    const request = useMemo(() => {
        let request: TransactionRequest | undefined = undefined;

        if (
            userNoun != undefined &&
            treasuryNoun != undefined &&
            address != undefined &&
            publicClient != undefined &&
            ready
        ) {
            const calldata = encodeFunctionData({
                abi: nounSwapAbi,
                functionName: "swap",
                args: [BigInt(userNoun.id), BigInt(treasuryNoun.id)],
            });

            request = {
                to: NOUN_SWAP_CONTRACT_ADDRESS,
                from: address,
                data: calldata,
                // gas: BigInt(1000000), // Reasonable default incase gas estimate fails...
            };
        }

        return request;
    }, [userNoun, treasuryNoun, address, publicClient, ready]);

    const sendTxnData = useSendTransaction({ request, successMsg: "Swap executed!", onReject });

    return sendTxnData;
}
