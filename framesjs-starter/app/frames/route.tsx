/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { createFrames } from "frames.js/next";
import { STORAGE_REGISTRY_ADDRESS } from "@farcaster/core";
import { TransactionTargetResponse, getAddressForFid, getUserDataForFid } from "frames.js";
import { getFrameMessage, getPreviousFrame } from "frames.js/next/server";
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
import { baseAddress, demoFrame, frameLicenseAbi } from "../contracts/frameLicenser";


type FrameState = "INITIAL" | "STOLEN" | "GOOD";

const frames = createFrames({
  basePath: "/",
  initialState: {
    state: "INITIAL" as FrameState,
    frameId: demoFrame,

  }
});




const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const frameLicenser = getContract({
  abi: frameLicenseAbi as Abi,
  address: baseAddress,
  publicClient,
});

interface OC {
  fid: number,
  name: string,
  address: string,
}

const handleRequest = frames(async (ctx) => {
  var oc = {} as OC;
  if (ctx.message?.castId) {
    oc.fid = ctx.message?.castId.fid;
    const userData = await getUserDataForFid({ fid: oc.fid });
    oc.name = userData?.username || userData?.displayName || "Unknown";
    oc.address = await getAddressForFid({
      fid: oc.fid,
      options: { fallbackToCustodyAddress: true }
    });
  }

  var frameState = "INITIAL" as FrameState;
  if (oc.address) {
    try {
      const hasLicense = await frameLicenser.read.hasLicense([ctx.state.frameId]) as boolean;
      frameState = hasLicense ? "GOOD" : "STOLEN";
    } catch (error) {
      console.error(error);
    }
  }

  if (frameState === "INITIAL") {
    return {
      image: "https://i.imgur.com/Xyo8Per.png",

      imageOptions: {
        aspectRatio: "1.91:1",
      },
      buttons: [
        <Button
          action="post"
        >
          ⏩
        </Button>,
      ],
    };
  }

  if (frameState === "STOLEN") {
    return {
      image: "https://i.imgur.com/aNcNUvs.gif",
      imageOptions: {
        aspectRatio: "1.91:1",
      },
      buttons: [
        <Button
          action="post"
          target="/frames"
          key="enter"
        >
          {`License for ${oc.name}`}
        </Button>,
        <Button
          action="post"
          target="/frames"
          key="enter"
        >
          {`License for myself`}
        </Button>,
      ],
    };
  }


  // if tx pending show waiting lobby
  if (ctx.message?.transactionId) {
    return {
      image: "https://i.imgur.com/aNcNUvs.gif",
      imageOptions: {
        aspectRatio: "1:1",
      },
      buttons: [
        <Button
          action="link"
          target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}
        >
          View on block explorer
        </Button>,
      ],
    };
  }
  // if state is initial
  return {
    // image: (

    //   <div tw="bg-gray-100 p-4 flex justify-center items-center w-full h-full justify-center items-center flex">
    //     <p tw="text-base text-gray-800">
    //       Licensing Frame ...
    //     </p>
    //   </div>
    // ),
    image: "https://i.imgur.com/aNcNUvs.gif",
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    buttons: [
      <Button
        action="post"
        target="/frames"
        key="enter"
      >
        ⏩
      </Button>,
    ],
  };
});

// if state is stolen

// if state is good



export const GET = handleRequest;
export const POST = handleRequest;