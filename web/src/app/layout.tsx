import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Analytics } from "@vercel/analytics/react";
import { Londrina_Solid } from "next/font/google";
import localFont from "next/font/local";

import Providers from "@/providers/providers";
import ToastContainer from "@/components/ToastContainer";
import BetaBanner from "@/components/BetaBanner";

const ptRootUiFont = localFont({
    src: "./pt-root-ui_vf.woff2",
    display: "swap",
    variable: "--font-pt-root-ui",
});

const londrinaSolidFont = Londrina_Solid({
    weight: ["100", "300", "400", "900"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-londrina-solid",
});

export const metadata: Metadata = {
    title: "NounSwap",
    description: "Swap your Noun with the Nouns Treasury",
    metadataBase: new URL("https://www.nounswap.wtf"),
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
        <html lang="en" className={`${ptRootUiFont.variable} ${londrinaSolidFont.variable}`}>
            <body>
                <Providers>
                    <div className="flex flex-col min-h-screen justify-between w-full overflow-hidden border-primary">
                        <BetaBanner />
                        {children}
                    </div>
                    <ToastContainer />
                </Providers>
                <Analytics />
            </body>
        </html>
    );
}
