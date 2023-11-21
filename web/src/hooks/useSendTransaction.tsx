"use client";
import { useEffect, useMemo, useState } from "react";
import { TransactionReceipt, TransactionRequest } from "viem";
import { Hash } from "viem";
import { usePrepareSendTransaction, useSendTransaction as useWagmiSendTransaction, useWaitForTransaction } from "wagmi";
import useToast from "./useToast";
import { ToastType } from "../contexts/toast";
import { track } from "@vercel/analytics";

interface UseSendTransactionParams {
    request?: TransactionRequest;
    successMsg?: string;
    onSuccess?: () => void;
    onReject?: () => void;
}

export enum SendTransactionState {
    Idle = "idle",
    PendingWalletSignature = "pendingWalletSignature",
    Rejected = "rejected",
    PendingTransaction = "pendingTransaction",
    Failed = "failed",
    Success = "success",
}

export interface UseSendTransactionReturnType {
    state: SendTransactionState;
    estimatedFeeEth?: bigint;
    hash?: Hash;
    receipt?: TransactionReceipt;
    send?: () => void;
    reset: () => void;
}

export default function useSendTransaction({
    request,
    successMsg,
    onSuccess,
    onReject,
}: UseSendTransactionParams): UseSendTransactionReturnType {
    const [_, setPendingToastId] = useState<number | undefined>(undefined);
    const { addToast, removeToast } = useToast();

    const { config } = usePrepareSendTransaction({
        to: request?.to ?? undefined,
        data: request?.data,
        enabled: request != undefined,
        gas: request?.gas,
    });

    const {
        data: sendData,
        isLoading: pendingWalletSignature,
        sendTransactionAsync,
        reset,
        isError: rejected,
    } = useWagmiSendTransaction({
        ...config,
        onError: (e) => {
            console.error("SEND ERROR: ", e);
            onReject?.();
        },
    });

    const {
        data: receipt,
        isLoading: pendingTransaction,
        isSuccess: success,
        isError: failed,
    } = useWaitForTransaction({
        hash: sendData?.hash,
        confirmations: 2,
        onSettled: (data, error) => {
            console.log("Transaction settled", { data, error });
        },
        onSuccess: () => onSuccess?.(),
    });

    const state = useMemo(() => {
        if (pendingWalletSignature) {
            return SendTransactionState.PendingWalletSignature;
        } else if (rejected) {
            return SendTransactionState.Rejected;
        } else if (pendingTransaction) {
            return SendTransactionState.PendingTransaction;
        } else if (failed) {
            track("TxFailed");
            return SendTransactionState.Failed;
        } else if (success) {
            track("TxSuccess");
            return SendTransactionState.Success;
        } else {
            return SendTransactionState.Idle;
        }
    }, [pendingWalletSignature, pendingTransaction, failed, success, rejected]);

    // Handle toasts
    useEffect(() => {
        let pendingToastId: number | undefined = undefined;
        console.log("HANDLE TOAST", state);

        switch (state) {
            case SendTransactionState.Rejected:
                addToast({
                    content: "Txn rejected",
                    type: ToastType.Failure,
                });
                break;
            case SendTransactionState.PendingTransaction:
                pendingToastId = addToast({
                    content: "Txn pending",
                    type: ToastType.Pending,
                });
                break;
            case SendTransactionState.Failed:
                addToast({
                    content: "Txn failed",
                    type: ToastType.Failure,
                });
                break;
            case SendTransactionState.Success:
                addToast({
                    content: successMsg ?? "Txn success",
                    type: ToastType.Success,
                });
                break;
        }

        setPendingToastId((currentId) => {
            if (currentId != undefined) {
                removeToast(currentId);
            }

            return pendingToastId;
        });
    }, [state, addToast, removeToast, setPendingToastId, successMsg]);

    return {
        state,
        estimatedFeeEth: config && config.maxFeePerGas && config.gas ? config.maxFeePerGas * config.gas : undefined,
        hash: sendData?.hash,
        receipt,
        send: sendTransactionAsync ? () => sendTransactionAsync() : undefined,
        reset,
    };
}
