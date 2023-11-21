import WalletButton from "../../components/WalletButton";
import Nav from "../../components/Nav";
import Icon from "../../components/Icon";
import HowItWorksModal from "../../components/HowItWorks";
import LinkRetainParams from "../../components/LinkRetainParams";

const navInfo = [
    { name: "Explore", href: "/" },
    { name: "My Props", href: "/proposals" },
];

function Header() {
    return (
        <>
            <header className="flex flex-col justify-between items-center w-full border-b-2 border-gray-300 px-4 md:px-10 pt-4 pb-2 gap-4">
                <div className="flex flex-row justify-between w-full">
                    <div className="flex md:flex-1 items-center gap-6">
                        <div className="pr-6">
                            <LinkRetainParams
                                href="/"
                                className="text-gray-900  flex flex-row  gap-2 [&>svg]:hover:rotate-12 shrink grow-0 "
                            >
                                <Icon icon="repeat" size={28} className="transition-all ease-linear fill-gray-900" />
                                <h5 className="hidden md:flex">NounSwap</h5>
                            </LinkRetainParams>
                        </div>
                        {/* <span className="hidden md:flex">
                            <Nav navInfo={navInfo} />
                        </span> */}
                    </div>
                    <div className="flex-1 flex justify-end gap-6 text-gray-600 items-center">
                        <HowItWorksModal />
                        <WalletButton />
                    </div>
                </div>
                {/* <div className="flex md:hidden w-full justify-between bg-gray-200 rounded-2xl p-1">
                    <Nav navInfo={navInfo} />
                </div> */}
            </header>
        </>
    );
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="flex flex-col px-4 md:px-8 grow justify-start items-start pt-10 pb-4 md:pb-8 gap-10">
                {children}
            </main>
        </>
    );
}
