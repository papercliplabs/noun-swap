import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Analytics } from "@vercel/analytics/react";

import Providers from "./providers";
import ToastContainer from "../components/ToastContainer";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "NounSwap",
    description: "Swap your Noun with the Nouns Treasury",
    metadataBase: new URL("https://nounswap.wtf"),
    openGraph: {
        title: "NounSwap",
        description: "Swap your Noun with the Nouns Treasury",
    },
    twitter: {
        card: "summary_large_image",
        title: "NounSwap",
        description: "Swap your Noun with the Nouns Treasury",
    },
    keywords: ["crypto", "cryptocurrency", "ethereum", "nft", "nouns", "nounsDOA", "paperclip", "labs"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <div className="flex flex-col min-h-screen justify-between w-full overflow-hidden">
                        <span className="bg-yellow-100 p-2 w-full text-center">
                            DEV VERSION!!! - NounSwap is currently in beta on Goerli testnet. To try it out, get a{" "}
                            <Link
                                href="https://nouns-webapp-nu.vercel.app"
                                className="inline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Goerli Noun here.
                            </Link>
                        </span>
                        {children}
                    </div>
                    <ToastContainer />
                </Providers>
                <Analytics />
            </body>
        </html>
    );
}
