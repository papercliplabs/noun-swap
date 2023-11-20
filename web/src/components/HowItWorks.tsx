"use client";
import { useState } from "react";
import Icon from "./Icon";
import Modal from "./Modal";
import Link from "next/link";
import { NOUN_SWAP_CONTRACT_ADDRESS } from "../common/constants";

export default function HowItWorksModal() {
    const [howItWorksModalOpen, setHowItWorksModalOpen] = useState<boolean>(false);

    return (
        <>
            <button
                className="flex flex-row gap-2 items-center z-50 hover:brightness-[85%] text-gray-600"
                onClick={() => setHowItWorksModalOpen(true)}
            >
                <span>How it works</span>
                <Icon icon="questionCircle" size={20} className="fill-gray-600" />
            </button>
            <Modal title="How it works" isOpen={howItWorksModalOpen} onClose={() => setHowItWorksModalOpen(false)}>
                <div className="flex flex-col px-6 pb-6 [&>ol>li>div]:text-gray-600 text-gray-900">
                    <ol className="pl-4 flex flex-col gap-6 border-b-2 border-gray-400 pb-6">
                        <li>
                            Choose the Noun you want
                            <div>Look through the treasury and pick a Noun you like.</div>
                        </li>
                        <li>
                            Select your Noun to trade
                            <div>Decide which of your Nouns you want to trade.</div>
                        </li>
                        <li>
                            Approve your Noun:
                            <div>
                                This will approve the{" "}
                                <Link
                                    href={"https://goerli.etherscan.io/address/" + NOUN_SWAP_CONTRACT_ADDRESS}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    NounSwap contract
                                </Link>{" "}
                                to swap your Noun with the Nouns Treasury.
                            </div>
                        </li>
                        <li>
                            Create a Swap <div>Confirm the transaction and the swap will be executed.</div>
                        </li>
                    </ol>
                    <div className="flex flex-col pt-6 gap-2">
                        <h5>What is NounSwap?</h5>
                        <div className="text-gray-600">
                            NounSwap was built by{" "}
                            <Link href="https://paperclip.xyz/" target="_blank" rel="noopener noreferrer">
                                Paperclip Labs
                            </Link>{" "}
                            and inspired by{" "}
                            <Link
                                href="https://warpcast.com/toadyhawk.eth/0x38d070e1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                this cast from ToadyHawk.eth
                            </Link>
                            . NounSwap makes it easy for Noun owners to get the Noun they want. Simply create a swap
                            between your Noun and one in the treasury.
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
