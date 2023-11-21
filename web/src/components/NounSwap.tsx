"use client";
import { Noun } from "../common/types";
import { Address } from "wagmi";
import NounCard from "./NounCard";
import { useEffect, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Modal from "./Modal";
import SwapTransactionModal from "./SwapTransactionModal";
import WalletButton from "./WalletButton";
import Image from "next/image";
import Icon from "./Icon";
import useNounsForAddress from "../hooks/useNounsForAddress";
import { track } from "@vercel/analytics";

interface NounSwapProps {
    treasuryNoun: Noun;
    address?: Address;
}

export default function NounSwap({ treasuryNoun, address }: NounSwapProps) {
    const { openConnectModal } = useConnectModal();
    const [selectedUserNoun, setSelectedUserNoun] = useState<Noun | undefined>(undefined);
    const [pickModalOpen, setPickModalOpen] = useState<boolean>(false);
    const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false);
    const userNouns = useNounsForAddress(address);

    useEffect(() => {
        // Clear selection if disconnected
        if (!address) {
            setSelectedUserNoun(undefined);
        }
    }, [address, setSelectedUserNoun]);

    return (
        <>
            <div className="flex flex-col grow justify-between border-gray-700">
                <div className="flex flex-col md:flex-row w-full grow border-b-4">
                    <div className="flex flex-col grow justify-center items-center border-b-2 md:border-r-2 md:border-b-0 gap-8 py-12 px-6 relative">
                        <WalletButton />
                        {selectedUserNoun ? (
                            <div className="relative">
                                <button onClick={() => setPickModalOpen(true)}>
                                    <NounCard noun={selectedUserNoun} size={200} enableHover={false} />
                                </button>
                                <button onClick={() => setSelectedUserNoun(undefined)}>
                                    <Icon
                                        icon="xCircle"
                                        size={40}
                                        className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 border-4 rounded-full border-white fill-gray-600"
                                    />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => (address ? setPickModalOpen(true) : openConnectModal?.())}
                                className="h-[200px] w-[200px] border-4 border-dashed border-gray-400 rounded-[20px] p-8 flex flex-col gap-4 text-gray-600 justify-center items-center hover:brightness-[85%]"
                            >
                                <Icon icon="plusCircle" size={54} className="fill-gray-600" />
                                <div>Select your Noun</div>
                            </button>
                        )}
                        <h5>Offer: {selectedUserNoun?.id}</h5>
                        <Icon
                            icon="repeat"
                            size={64}
                            className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 md:right-0 md:top-1/2 md:translate-x-1/2 md:-translate-y-1/2 rounded-full p-3 bg-gray-200 border-4 border-white"
                        />
                    </div>
                    <div className="flex flex-col grow justify-center items-center border-t-2 md:border-l-2 md:border-t-0 gap-8 py-12 px-6">
                        <div className="flex flex-row gap-2 px-4 py-3 border-2 border-gray-400 rounded-2xl items-center">
                            <Image src="/nouns.png" width={32} height={32} alt="" className="rounded-full" />
                            <span>Nouns Treasury</span>
                        </div>
                        <NounCard noun={treasuryNoun} size={200} enableHover={false} />
                        <h5>For: Noun {treasuryNoun.id}</h5>
                    </div>
                </div>
                <div className="flex flex-col-reverse md:flex-row w-full justify-end px-4 md:px-10 py-4 md:py-2 item-center items-center gap-6 text-gray-600">
                    <button
                        className="btn-primary w-full md:w-auto justify-center"
                        onClick={() => {
                            setTransactionModalOpen(true);
                            track("InitCreateSwapProp");
                        }}
                        disabled={selectedUserNoun == undefined}
                    >
                        Create a swap
                    </button>
                </div>
            </div>
            <Modal title="Select your Noun" isOpen={pickModalOpen} onClose={() => setPickModalOpen(false)}>
                {userNouns == undefined ? (
                    <Icon icon="pending" size={60} className="animate-spin" />
                ) : (
                    userNouns.map((noun, i) => (
                        <button
                            className="flex flex-row text-center bg-gray-100 p-2 gap-6 items-center hover:brightness-[85%] px-6 py-3"
                            onClick={() => {
                                setSelectedUserNoun(noun);
                                setPickModalOpen(false);
                            }}
                            key={i}
                        >
                            <NounCard noun={noun} size={80} enableHover={false} />
                            <h4>Noun {noun.id}</h4>
                        </button>
                    ))
                )}
            </Modal>
            <SwapTransactionModal
                isOpen={transactionModalOpen}
                onClose={() => setTransactionModalOpen(false)}
                userNoun={selectedUserNoun}
                treasuryNoun={treasuryNoun}
            />
        </>
    );
}
