export const CONTRACT_ADDRESS = "0x6976A3396feBd3A90570a37e7114b5d0C053043B";

export const ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "productId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "batchHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "ProductUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_productId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_batchHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			}
		],
		"name": "addProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_productId",
				"type": "string"
			}
		],
		"name": "getProductHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "productId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "batchHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct ProductTracker.Product[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
