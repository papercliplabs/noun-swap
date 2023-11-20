export const nounSwapAbi = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "senderNounId",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "treasuryNounId",
                type: "uint256",
            },
        ],
        name: "swap",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;
