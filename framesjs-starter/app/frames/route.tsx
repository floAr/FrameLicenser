/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { createFrames } from "frames.js/next";
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


const frames = createFrames({
  basePath: "/",
});

// different states
enum State {
  INITIAL,
  STOLEN,
  GOOD,
}


const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const frameLicenser = getContract({
  abi: frameLicenseAbi as Abi,
  address: "0x4618ad2D09363dB42A8d165c7262358B656A9F78",
  publicClient,
});

const handleRequest = frames(async (ctx) => {
  getFrameMessage(ctx);
  console.log(JSON.stringify(ctx));
  if (ctx.message?.transactionId) {
    return {
      image: (
        <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
          Transaction submitted! {ctx.message.transactionId}
        </div>
      ),
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

  return {
    image: (
      <div tw="bg-purple-800 text-white w-full h-full justify-center items-center">
        Rent farcaster storage
      </div>
    ),
    imageOptions: {
      aspectRatio: "1:1",
    },
    buttons: [
      <Button action="tx" target="/registerFrame" post_url="/frames">
        Buy a unit
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;