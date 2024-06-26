import Link from "next/link";

import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";
import { currentURL, vercelURL } from "./utils";
import { createDebugUrl } from "./debug";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "New api example",
    description: "This is a new api example",
    other: {
      ...(await fetchMetadata(
        new URL(
          "/frames",
          vercelURL() || "http://localhost:3000"
        )
      )),
    },
  };
}

export default async function Home() {
  const url = currentURL("/");

  return (
    <div>
      Rent farcaster storage example{" "}
      <Link href={createDebugUrl(url)} className="underline">
        Debug
      </Link>
    </div>
  );
}