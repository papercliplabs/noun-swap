import HowItWorksModal from "../../../components/HowItWorks";
import LinkRetainParams from "../../../components/LinkRetainParams";

export default async function Layout({ children }: { children: React.ReactElement }) {
    return (
        <div className="flex flex-col w-full grow">
            <div className=" bg-gray-200">
                <div className="flex flex-row justify-between px-6 md:px-10 py-5">
                    <LinkRetainParams href="/">
                        <button className="btn-secondary">Back</button>
                    </LinkRetainParams>
                    <HowItWorksModal />
                </div>
                <div className="flex flex-col justify-center items-center pb-10 px-6 md:px-10">
                    <h1>Create a Swap</h1>
                    <div>Choose the Noun you want to swap for the Treasury Noun. </div>
                </div>
            </div>
            {children}
        </div>
    );
}
