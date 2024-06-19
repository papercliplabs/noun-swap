"use client";
import { CHAIN_CONFIG } from "@/config";
import { createContext, useCallback, useContext, useState } from "react";
import { Hex, TransactionType } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { ToastContext, ToastType } from "./toast";
import { track } from "@vercel/analytics";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { LinkExternal } from "@/components/ui/link";

export interface Transaction {
  hash: Hex;
  status: "pending" | "success" | "reverted";
}

interface TransactionListenerContextType {
  transactions: Transaction[];
  addTransaction?: (hash: Hex, logging: { type: TransactionType; description: string }) => void;
}

export const TransactionListenerContext = createContext<TransactionListenerContextType>({
  transactions: [],
  addTransaction: undefined,
});

export function TransactionListenerProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { addToast, removeToast } = useContext(ToastContext);
  const addRecentTransaction = useAddRecentTransaction();

  const addTransaction = useCallback(
    async (hash: Hex, logging: { type: TransactionType; description: string }) => {
      setTransactions((transactions) => [...transactions, { hash, status: "pending" }]);
      const url = CHAIN_CONFIG.publicClient.chain?.blockExplorers?.default.url + "/tx/" + hash.toString();
      const pendingToastId = addToast?.({
        content: (
          <div className="flex w-full justify-between">
            <span>{logging.description}</span>
            <LinkExternal href={url}>View</LinkExternal>
          </div>
        ),
        type: ToastType.Pending,
      });
      track("txn-pending", { hash: hash.toString(), type: logging.type });

      addRecentTransaction({ hash, description: logging.description });

      const receipt = await waitForTransactionReceipt(CHAIN_CONFIG.publicClient, { hash });
      if (pendingToastId != undefined) {
        removeToast?.(pendingToastId);
      }

      const status = receipt.status;
      setTransactions((transactions) => {
        return [...transactions.filter((txn) => txn.hash != hash), { hash, status: status }];
      });

      addToast?.({
        content: (
          <div className="flex w-full justify-between">
            <span>{logging.description}</span>
            <LinkExternal href={url}>View</LinkExternal>
          </div>
        ),
        type: status == "success" ? ToastType.Success : ToastType.Failure,
      });

      track(`txn-${status}`, { hash: hash.toString(), type: logging.type });
    },
    [setTransactions, addToast, removeToast, addRecentTransaction]
  );

  return (
    <TransactionListenerContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionListenerContext.Provider>
  );
}
