"use client";
import useSendTransaction, { UseSendTransactionReturnType } from "./useSendTransaction";
import { useMemo } from "react";
import {
    Address,
    TransactionRequest,
    decodeEventLog,
    encodeAbiParameters,
    encodeFunctionData,
    getFunctionSignature,
} from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { nounsDoaLogicAbi } from "../abis/nounsDoaLogic";
import { nounsTokenAbi } from "../abis/nounsToken";
import { erc20TokenAbi } from "@/abis/erc20Token";
import { Noun } from "../lib/types";
import getChainSpecificData from "../lib/chainSpecificData";
import { formatTokenAmount } from "@/lib/utils";
import { NATIVE_ASSET_DECIMALS } from "@/lib/constants";

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

interface UseCreateSwapPropReturnType extends UseSendTransactionReturnType {
    propNumber?: number;
}

export function useCreateSwapProp({
    userNoun,
    treasuryNoun,
    tip,
    reason,
    onReject,
}: UseCreateSwapPropParams): UseCreateSwapPropReturnType {
    const { address } = useAccount();
    const publicClient = usePublicClient();

    const request = useMemo(() => {
        let request: TransactionRequest | undefined = undefined;

        if (
            userNoun != undefined &&
            treasuryNoun != undefined &&
            address != undefined &&
            publicClient != undefined &&
            tip != undefined &&
            userNoun.chainId == treasuryNoun.chainId
        ) {
            const chainSpecificData = getChainSpecificData(treasuryNoun.chainId);

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

            const proposeArgs = [
                govTxns.map((txn) => txn.target), // targets
                govTxns.map((txn) => txn.value), // values
                govTxns.map((txn) => txn.functionSignature), // signatures
                govTxns.map((txn) => txn.inputData), // input data
                `# NounSwap v1: Swap Noun ${userNoun.id} + ${formatTokenAmount(
                    tip,
                    NATIVE_ASSET_DECIMALS,
                    6
                )} WETH for Noun ${treasuryNoun.id} from the Nouns Treasury

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

        return request;
    }, [userNoun, treasuryNoun, reason, tip, address, publicClient]);

    const sendTxnData = useSendTransaction({
        request,
        chainId: treasuryNoun?.chainId,
        successMsg: "Swap Prop created!",
        onReject,
    });

    const propNumber = useMemo(() => {
        const log = sendTxnData.receipt?.logs.find((log) => true); // First event is ProposalCreated
        if (log == undefined) {
            return undefined;
        }

        const event = decodeEventLog({
            abi: nounsDoaLogicAbi,
            eventName: "ProposalCreated",
            data: log.data,
            topics: log.topics,
        });

        return Number((event.args as any)["id"]);
    }, [sendTxnData]);

    return { ...sendTxnData, propNumber };
}
