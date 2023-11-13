"use client";
import { getLinearGradientForAddress } from "@/common/utils";
import { getDefaultWallets, RainbowKitProvider, AvatarComponent } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Address, configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, localhost, sepolia, goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
    [localhost],
    [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string }), publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: "Noun Swap",
    projectId: "cb75b98c5532821d721e6275da3e7006",
    chains,
});

const wagmiConfig = createConfig({
    autoConnect: false, // Issues with SSR, there is a workaround we used for Hopscotch can add if needed
    connectors,
    publicClient,
});

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
    const linearGradient = getLinearGradientForAddress(address as Address);
    return ensImage ? (
        <Image src={ensImage} width={size} height={size} alt="" style={{ borderRadius: 999 }} />
    ) : (
        <div
            style={{
                background: linearGradient,
                borderRadius: 999,
                height: size,
                width: size,
            }}
        />
    );
};

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains} avatar={CustomAvatar}>
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
