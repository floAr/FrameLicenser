import { STORAGE_REGISTRY_ADDRESS } from "@farcaster/core";
import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";
import {
    Abi,
    createPublicClient,
    createWalletClient,
    encodeFunctionData,
    getContract,
    http,
    custom
} from "viem";
import { baseSepolia } from "viem/chains";
import { frameLicenseAbi } from "../contracts/frameLicenser";

export async function POST(
    req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
    const json = await req.json();
    console.log("hey");
    const frameMessage = await getFrameMessage(json);

    if (!frameMessage) {
        throw new Error("No frame message");
    }


    const calldata = encodeFunctionData({
        abi: frameLicenseAbi,
        functionName: "registerNewFrame",
        args: undefined
    });

    const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(),
    });





    const frameLicenser = getContract({
        abi: frameLicenseAbi as Abi,
        address: "0x4618ad2D09363dB42A8d165c7262358B656A9F78",
        publicClient,
    });


    var hasLicense = false;
    // store frameid as uint256
    try {
        hasLicense = await frameLicenser.read.hasLicense(["64926579729573357917075808397973142163473499830288424366107952811585235496367"]) as boolean;
    }
    catch (error) { }

    console.log(hasLicense);

    return NextResponse.json({
        chainId: "eip155:" + baseSepolia.id, // OP Mainnet 10
        method: "eth_sendTransaction",
        params: {
            abi: frameLicenseAbi as Abi,
            to: "0x4618ad2D09363dB42A8d165c7262358B656A9F78",
            data: calldata,
            value: "100000",
        },
    });;
}

