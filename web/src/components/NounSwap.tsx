"use client";
import { Noun } from "../lib/types";
import { Address, useNetwork, useSwitchNetwork } from "wagmi";
import NounCard from "./NounCard";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import SwapTransactionModal from "./SwapTransactionModal";
import WalletButton from "./WalletButton";
import Image from "next/image";
import Icon from "./ui/Icon";
import { track } from "@vercel/analytics";
import getChainSpecificData from "../lib/chainSpecificData";
import { switchNetwork } from "wagmi/actions";
import { goerli } from "viem/chains";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "./ui/LoadingSpinner";
import { LinkExternal } from "./ui/link";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface NounSwapProps {
    userNouns: Noun[];
    treasuryNoun: Noun;
    address?: Address;
}

export default function NounSwap({ userNouns, treasuryNoun, address }: NounSwapProps) {
    const { openConnectModal } = useConnectModal();
    const [selectedUserNoun, setSelectedUserNoun] = useState<Noun | undefined>(undefined);
    const [pickModalOpen, setPickModalOpen] = useState<boolean>(false);
    const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false);
    const { chain: activeChain } = useNetwork();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { switchNetworkAsync } = useSwitchNetwork();

    const wrongNetwork = useMemo(() => {
        return activeChain?.id != treasuryNoun.chainId;
    }, [activeChain, treasuryNoun]);

    useEffect(() => {
        // Clear selection if disconnected
        if (!address) {
            setSelectedUserNoun(undefined);
        }
    }, [address, setSelectedUserNoun]);

    return (
        <>
            <div className="flex flex-col grow justify-between  md:pb-[72px]">
                <div className="flex flex-col md:flex-row w-full grow border-b-4">
                    <div className="flex flex-col grow justify-center items-center border-b-2 md:border-r-2 md:border-b-0 gap-8 py-12 px-6 relative border-secondary">
                        <WalletButton hideChainSwitcher disableMobileShrink />
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
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button
                                        onClick={() => (address ? setPickModalOpen(true) : openConnectModal?.())}
                                        className="h-[200px] w-[200px] border-4 border-dashed rounded-[20px] p-8 flex flex-col gap-4 text-secondary justify-center items-center hover:brightness-[85%]"
                                    >
                                        <Icon icon="plusCircle" size={54} className="fill-gray-600" />
                                        <h6>Select your Noun</h6>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[425px] max-h-[60vh] flex flex-col overflow-y-auto">
                                    <h4>Select your Noun</h4>
                                    <div className="flex flex-col [&>ol>li>div]:text-secondary">
                                        {userNouns == undefined ? (
                                            <Icon icon="pending" size={60} className="animate-spin" />
                                        ) : userNouns.length == 0 ? (
                                            <div className="flex flex-col px-8 py-6 items-center w-full justify-center h-[244px] gap-2 text-center">
                                                <h4>No Nouns available</h4>
                                                <div className="text-secondary">
                                                    {getChainSpecificData(treasuryNoun.chainId).chain.id == 1 ? (
                                                        <>
                                                            Don{"'"}t have a noun on Ethereum? Try NounSwap on{" "}
                                                            <button
                                                                className="text-accent hover:brightness-[85%]"
                                                                onClick={async () => {
                                                                    await switchNetworkAsync?.(goerli.id);
                                                                    router.push("/" + "?" + searchParams.toString());
                                                                }}
                                                            >
                                                                Goerli Testnet
                                                            </button>
                                                            .
                                                        </>
                                                    ) : (
                                                        <>
                                                            You don{"'"}t have a noun on Goerli Testnet.
                                                            <br />
                                                            Get a{" "}
                                                            <LinkExternal href="https://nouns-webapp-nu.vercel.app">
                                                                Goerli Noun here
                                                            </LinkExternal>
                                                            .
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            userNouns.map((noun, i) => (
                                                <button
                                                    className="flex flex-row text-center hover:bg-secondary p-2 gap-6 items-center hover:brightness-[85%] px-6 py-3"
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
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                        <div className="flex flex-col justify-center items-center">
                            <h5>Offer: {selectedUserNoun?.id}</h5>
                            <div>
                                On {selectedUserNoun ? getChainSpecificData(selectedUserNoun.chainId).chain.name : ""}
                            </div>
                        </div>
                        <Icon
                            icon="repeat"
                            size={64}
                            className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 md:right-0 md:top-1/2 md:translate-x-1/2 md:-translate-y-1/2 rounded-full p-3 bg-secondary border-4 border-white"
                        />
                    </div>
                    <div className="flex flex-col grow justify-center items-center border-t-2 md:border-l-2 md:border-t-0 gap-8 py-12 px-6 border-secondary">
                        <LinkExternal
                            href={
                                getChainSpecificData(treasuryNoun.chainId).chain.blockExplorers?.default.url +
                                "/address/" +
                                getChainSpecificData(treasuryNoun.chainId).nounsTreasuryAddress
                            }
                            className="flex flex-row gap-2 px-4 py-3 border-2  rounded-2xl items-center text-primary hover:bg-gray-200 hover:brightness-100 active:clickable-active"
                        >
                            <Button variant="secondary" className="gap-2 px-4 py-4">
                                <Image
                                    src="/nouns-icon.png"
                                    width={32}
                                    height={32}
                                    alt=""
                                    className="rounded-full bg-nouns p-0.5"
                                />
                                <h6>Nouns Treasury</h6>
                            </Button>
                        </LinkExternal>
                        <NounCard noun={treasuryNoun} size={200} enableHover={false} />
                        <div className="flex flex-col justify-center items-center">
                            <h5>For: Noun {treasuryNoun.id}</h5>
                            <div>On {getChainSpecificData(treasuryNoun.chainId).chain.name}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col-reverse md:flex-row w-full justify-end px-4 md:px-10 py-4 md:py-2 item-center items-center gap-6 text-secondary md:fixed md:bottom-0 md:bg-white md:border-t-4 border-secondary">
                    <span>Creates a prop in Nouns governance.</span>
                    <Button
                        onClick={() => {
                            if (wrongNetwork) {
                                switchNetwork({ chainId: treasuryNoun.chainId });
                            } else {
                                setTransactionModalOpen(true);
                                track("InitCreateSwapProp");
                            }
                        }}
                        className="w-full md:w-auto justify-center"
                        disabled={selectedUserNoun == undefined}
                    >
                        {wrongNetwork && selectedUserNoun ? "Switch network" : "Create a swap prop"}
                    </Button>
                </div>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
                <SwapTransactionModal
                    userNoun={selectedUserNoun}
                    treasuryNoun={treasuryNoun}
                    isOpen={transactionModalOpen}
                    onClose={() => setTransactionModalOpen(false)}
                />
            </Suspense>
        </>
    );
}
