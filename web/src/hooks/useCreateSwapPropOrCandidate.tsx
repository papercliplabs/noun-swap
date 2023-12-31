"use client";
import useSendTransaction, { UseSendTransactionReturnType } from "./useSendTransaction";
import { useMemo } from "react";
import {
    Address,
    TransactionRequest,
    encodeAbiParameters,
    encodeFunctionData,
    getFunctionSignature,
    zeroAddress,
} from "viem";
import { useAccount, useBlockNumber, useContractReads, usePublicClient } from "wagmi";
import { nounsDoaLogicAbi } from "../abis/nounsDoaLogic";
import { nounsTokenAbi } from "../abis/nounsToken";
import { erc20TokenAbi } from "@/abis/erc20Token";
import { Noun } from "../lib/types";
import getChainSpecificData, { ChainSpecificData } from "../lib/chainSpecificData";
import { formatTokenAmount } from "@/lib/utils";
import { NATIVE_ASSET_DECIMALS } from "@/lib/constants";
import { nounsDaoDataAbi } from "@/abis/nounsDaoData";

interface UseCreateSwapPropParams {
    userNoun?: Noun;
    treasuryNoun?: Noun;
    tip?: bigint;
    reason?: string;
    onReject?: () => void;
}

interface GovernanceProposalTransaction {
    target: Address;
    value: bigint;
    functionSignature: string;
    inputData: `0x${string}`;
}

interface UseCreateSwapPropOrCandidateReturnType extends UseSendTransactionReturnType {
    requiresPropCandidate?: boolean;
    // propNumber?: number;
}

export function useCreateSwapPropOrCandidate({
    userNoun,
    treasuryNoun,
    tip,
    reason,
    onReject,
}: UseCreateSwapPropParams): UseCreateSwapPropOrCandidateReturnType {
    const { address } = useAccount();
    const publicClient = usePublicClient();

    const chainSpecificData: ChainSpecificData | undefined = useMemo(() => {
        return treasuryNoun != undefined ? getChainSpecificData(treasuryNoun.chainId) : undefined;
    }, [treasuryNoun]);

    const { data: blockNumber } = useBlockNumber();

    const { data: thresholdData, error } = useContractReads({
        contracts: [
            {
                address: chainSpecificData?.nounsTokenAddress,
                abi: nounsTokenAbi,
                functionName: "getPriorVotes",
                args: [userNoun?.owner ?? zeroAddress, blockNumber ? blockNumber - BigInt(1) : BigInt(0)],
            },
            {
                address: chainSpecificData?.nounsDoaProxyAddress,
                abi: nounsDoaLogicAbi,
                functionName: "proposalThreshold",
            },
        ],
        enabled: chainSpecificData != undefined && userNoun != undefined && blockNumber != undefined,
    });

    const requiresPropCandidate = useMemo(() => {
        if (
            thresholdData != undefined &&
            thresholdData[0].result != undefined &&
            thresholdData[1].result != undefined
        ) {
            // required prop if votes <= proposalThreshold (inclusive is intentional)
            const votes = thresholdData[0].result as bigint;
            const threshold = thresholdData[1].result as bigint;
            return votes <= threshold;
        } else {
            return true;
        }
    }, [thresholdData]);

    const request = useMemo(() => {
        let request: TransactionRequest | undefined = undefined;

        if (
            chainSpecificData != undefined &&
            userNoun != undefined &&
            treasuryNoun != undefined &&
            address != undefined &&
            publicClient != undefined &&
            tip != undefined &&
            userNoun.chainId == treasuryNoun.chainId
        ) {
            const transferNounFromAbi = nounsTokenAbi.find((entry) => entry.name == "transferFrom")!; // Must exist
            const safeTransferNounFromAbi = nounsTokenAbi.find((entry) => entry.name == "safeTransferFrom")!; // Must exist
            const erc20TransferFromAbi = erc20TokenAbi.find((entry) => entry.name == "transferFrom")!; // Must exist

            const userNounToTreasuryTransferFromInputData = encodeAbiParameters(
                transferNounFromAbi.inputs, // from: address, to: address, tokenId: uint256
                [userNoun.owner, chainSpecificData.nounsTreasuryAddress, BigInt(userNoun.id)]
            );

            const wethTransferToTreasuryInputData = encodeAbiParameters(erc20TransferFromAbi.inputs, [
                userNoun.owner,
                chainSpecificData.nounsTreasuryAddress,
                tip,
            ]);

            const treasuryNounToUserSafeTransferFromInputData = encodeAbiParameters(
                safeTransferNounFromAbi.inputs, // from: address, to: address, tokenId: uint256
                [chainSpecificData.nounsTreasuryAddress, userNoun.owner, BigInt(treasuryNoun.id)]
            );

            const transferUserNounGovTxn: GovernanceProposalTransaction = {
                target: chainSpecificData.nounsTokenAddress,
                value: BigInt(0),
                functionSignature: getFunctionSignature(transferNounFromAbi),
                inputData: userNounToTreasuryTransferFromInputData,
            };

            const transferWethGovTxn: GovernanceProposalTransaction = {
                target: chainSpecificData.wrappedNativeTokenAddress,
                value: BigInt(0),
                functionSignature: getFunctionSignature(erc20TransferFromAbi),
                inputData: wethTransferToTreasuryInputData,
            };

            const transferTreasuryNounGovTxn: GovernanceProposalTransaction = {
                target: chainSpecificData.nounsTokenAddress,
                value: BigInt(0),
                functionSignature: getFunctionSignature(safeTransferNounFromAbi),
                inputData: treasuryNounToUserSafeTransferFromInputData,
            };

            let govTxns: GovernanceProposalTransaction[] = [];
            if (tip > 0) {
                govTxns = [transferUserNounGovTxn, transferWethGovTxn, transferTreasuryNounGovTxn];
            } else {
                // Exclude the WETH transfer all together if the tip is 0
                govTxns = [transferUserNounGovTxn, transferTreasuryNounGovTxn];
            }

            const propTitle = `NounSwap v1: Swap Noun ${userNoun.id} + ${formatTokenAmount(
                tip,
                NATIVE_ASSET_DECIMALS,
                6
            )} WETH for Noun ${treasuryNoun.id} from the Nouns Treasury`;

            const proposeArgs: any = [
                govTxns.map((txn) => txn.target), // targets
                govTxns.map((txn) => txn.value), // values
                govTxns.map((txn) => txn.functionSignature), // signatures
                govTxns.map((txn) => txn.inputData), // input data
                `# ${propTitle}

## Summary
                
This proposal seeks to swap **Noun ${userNoun.id} + ${formatTokenAmount(
                    tip,
                    NATIVE_ASSET_DECIMALS,
                    6
                )} WETH** for **Noun ${treasuryNoun.id}** from the Nouns DAO treasury.
                  
Noun ${userNoun.id}   
![Noun ${userNoun.id}](https://noun-api.com/beta/pfp?background=${userNoun.seed.background}&body=${
                    userNoun.seed.body
                }&accessory=${userNoun.seed.accessory}&head=${userNoun.seed.head}&glasses=${
                    userNoun.seed.glasses
                }&size=200)

Noun ${treasuryNoun.id}   
![Noun ${treasuryNoun.id}](https://noun-api.com/beta/pfp?background=${treasuryNoun.seed.background}&body=${
                    treasuryNoun.seed.body
                }&accessory=${treasuryNoun.seed.accessory}&head=${treasuryNoun.seed.head}&glasses=${
                    treasuryNoun.seed.glasses
                }&size=200)

---

## Rationale for Swap

*This rationale is directly from the creator of the proposal*
${reason ?? "No rationale provided"}

---

## This Prop was created using NounSwap.

[NounSwap](nounswap.wtf) is a tool built for the Nouns communities by [Paperclip Labs](https://paperclip.xyz/). It allows Noun owners to easily create proposals to swap their Noun for a Noun in the DAO treasury. It serves purely as a facilitation tool for proposal creation. NounSwap does not have contracts and does not take custody of any Nouns or tokens at any time.`,
            ];

            if (requiresPropCandidate) {
                const slug = propTitle
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[^\w-]+/g, "");

                // Candidate requires slug and proposalIdToUpdate
                proposeArgs.push(slug);
                proposeArgs.push(BigInt(0));

                const propCalldata = encodeFunctionData({
                    abi: nounsDaoDataAbi,
                    functionName: "createProposalCandidate",
                    args: proposeArgs,
                });
                request = {
                    to: chainSpecificData.nounsDoaDataProxyAddress,
                    from: address,
                    data: propCalldata,
                    gas: BigInt(2000000), // Reasonable default incase gas estimate fails...
                };
            } else {
                const propCalldata = encodeFunctionData({
                    abi: nounsDoaLogicAbi,
                    functionName: "propose",
                    args: proposeArgs,
                });
                request = {
                    to: chainSpecificData.nounsDoaProxyAddress,
                    from: address,
                    data: propCalldata,
                    gas: BigInt(2000000), // Reasonable default incase gas estimate fails...
                };
            }
        }

        return request;
    }, [chainSpecificData, requiresPropCandidate, userNoun, treasuryNoun, reason, tip, address, publicClient]);

    const sendTxnData = useSendTransaction({
        request,
        chainId: treasuryNoun?.chainId,
        successMsg: `Swap Prop ${requiresPropCandidate && "Candidate "}created!`,
        onReject,
    });

    // const propNumber = useMemo(() => {
    //     const log = sendTxnData.receipt?.logs.find((log) => true); // First event is ProposalCreated
    //     if (log == undefined) {
    //         return undefined;
    //     }

    //     const event = decodeEventLog({
    //         abi: nounsDoaLogicAbi,
    //         eventName: "ProposalCreated",
    //         data: log.data,
    //         topics: log.topics,
    //     });

    //     return Number((event.args as any)["id"]);
    // }, [sendTxnData]);

    return { ...sendTxnData, requiresPropCandidate };
}
