import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei, parseEther } from "viem";

describe("FrameLicense", function () {
    async function deployFrameLicenseFixture() {
        const [owner, otherAccount] = await hre.viem.getWalletClients();
        const frameLicense = await hre.viem.deployContract("FrameLicense", [], {});
        const publicClient = await hre.viem.getPublicClient();

        return {
            frameLicense,
            owner,
            otherAccount,
            publicClient,
        };
    }

    async function deployFrameLicenseWithFrameFixture() {
        const [owner, otherAccount] = await hre.viem.getWalletClients();
        const frameLicense = await hre.viem.deployContract("FrameLicense", [], {});
        const publicClient = await hre.viem.getPublicClient();
        await frameLicense.write.registerNewFrame({ value: parseEther("0.01") });
        var frameRegisteredEvent = await frameLicense.getEvents.FrameRegistered();
        var frameId = frameRegisteredEvent[0].args.frameId!;
        return {
            frameLicense,
            owner,
            otherAccount,
            publicClient,
            frameId,
        };
    }

    it("Should deploy with the right owner and price", async function () {
        const { frameLicense, owner, otherAccount, publicClient } = await loadFixture(deployFrameLicenseFixture);

        // assert there is no eth in contract
        expect(
            await publicClient.getBalance({
                address: frameLicense.address,
            })
        ).to.equal(parseEther("0"));

        await frameLicense.write.registerNewFrame({ value: parseEther("0.01") });
        // get events
        var frameRegisteredEvent = await frameLicense.getEvents.FrameRegistered();
        // get the withdrawal events in the latest block
        expect(frameRegisteredEvent).to.have.lengthOf(1);
        expect(frameRegisteredEvent[0].args.frameId).to.not.equal(undefined);
        var frameId = frameRegisteredEvent[0].args.frameId;

        var frame = await frameLicense.read.frames([frameId ? frameId : BigInt(0)]);
        expect(frame[0]).to.equal(getAddress(owner.account.address));

        // assert there is fee eth in contract
        expect(
            await publicClient.getBalance({
                address: frameLicense.address,
            })
        ).to.equal(parseEther("0.01"));

    });

    it("should give license to owner", async function () {
        const { frameLicense, owner, otherAccount, publicClient, frameId } = await loadFixture(deployFrameLicenseWithFrameFixture);

        // owner has license
        var hasLicense = await frameLicense.read.hasLicense([frameId]);
        expect(hasLicense).to.equal(true);
    });
    it("should not give license to other account", async function () {
        const { frameLicense, owner, otherAccount, publicClient, frameId } = await loadFixture(deployFrameLicenseWithFrameFixture);

        const hasLicense = await frameLicense.read.hasLicense([frameId], { account: otherAccount.account });
        expect(hasLicense).to.equal(false);
    }); it("should give license to other account after paying", async function () {
        const { frameLicense, owner, otherAccount, publicClient, frameId } = await loadFixture(deployFrameLicenseWithFrameFixture);

        await frameLicense.write.licenseFrame([frameId], { value: parseEther("0.01"), account: otherAccount.account });

        const hasLicense = await frameLicense.read.hasLicense([frameId], { account: otherAccount.account });
        expect(hasLicense).to.equal(true);
    });
});