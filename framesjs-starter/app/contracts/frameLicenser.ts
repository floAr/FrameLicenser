
export const frameLicenseAbi = [
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'frameId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: true,
            },
            {
                name: 'owner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'price',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'FrameRegistered',
    },
    {
        type: 'function',
        inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        name: 'frames',
        outputs: [
            { name: 'owner', internalType: 'address', type: 'address' },
            { name: 'uniqueId', internalType: 'uint256', type: 'uint256' },
            { name: 'price', internalType: 'uint256', type: 'uint256' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '_uniqueId', internalType: 'uint256', type: 'uint256' },
            { name: '_user', internalType: 'address', type: 'address' },
        ],
        name: 'grantAccess',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: '_uniqueId', internalType: 'uint256', type: 'uint256' }],
        name: 'hasLicense',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '_uniqueId', internalType: 'uint256', type: 'uint256' },
            { name: 'requester', internalType: 'address', type: 'address' },
        ],
        name: 'hasLicense',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '_uniqueId', internalType: 'uint256', type: 'uint256' },
            { name: 'receiver', internalType: 'address', type: 'address' },
        ],
        name: 'licenseFrame',
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        inputs: [{ name: '_uniqueId', internalType: 'uint256', type: 'uint256' }],
        name: 'licenseFrame',
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'registerNewFrame',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
    },
] as const


export const baseAddress = "0xbce0ee56C2106Fef6F15f335A4eE4b81a39dE5d0"

export const demoFrame = "88900373580631094725251837711266559446473490807736568313095740607570808922102"