const ContractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "m",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "gn",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "pm",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "s",
				"type": "address"
			},
			{
				"internalType": "uint256[2]",
				"name": "cs",
				"type": "uint256[2]"
			},
			{
				"internalType": "uint256",
				"name": "e",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"stateMutability": "nonpayable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "countAvailables",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endDate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "giveAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "slpId",
				"type": "bytes32"
			}
		],
		"name": "isSlpClaimed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "i",
				"type": "uint8"
			},
			{
				"internalType": "bytes",
				"name": "code",
				"type": "bytes"
			}
		],
		"name": "redeem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "i",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "c",
				"type": "uint256"
			}
		],
		"name": "setCountAvailable",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "e",
				"type": "uint256"
			}
		],
		"name": "setEndDate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "gn",
				"type": "address"
			}
		],
		"name": "setGivenName",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "pm",
				"type": "address"
			}
		],
		"name": "setPreviousMinter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "s",
				"type": "address"
			}
		],
		"name": "setSigner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "takeAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
