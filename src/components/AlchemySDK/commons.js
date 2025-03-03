import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";

export const ALCHEMY_REFRESH_INTERVAL =
  process.env.NEXT_PUBLIC_ALCHEMY_API_REFRESH_INERVAL;

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
export const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

export const SECRETKEY = process.env.SECRET_KEY;

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
export const alchemy = new Alchemy(settings);

const MAX_ITEMS_PRE_PAGE = process.env.NEXT_PUBLIC_MAX_ITEMS_PER_PAGE;

// --

export const getBlock = async (_blockNumber) =>
  await alchemy.core.getBlock(_blockNumber);

export const getBlockWithTransactions = async (_blockNumber) =>
  await alchemy.core.getBlockWithTransactions(_blockNumber);

export const getLatestBlockNumber = async () =>
  await alchemy.core.getBlockNumber();

/**
 * Return the result of adding up transact.getTransaction and core.getTransactionReceipt
 * @param {*} transaction hash
 * @returns
 */
export const getTransactionReceipt = async (transaction) => {
  try {
    // Attempt to get the transaction details
    const transactionDetails = await alchemy.transact.getTransaction(
      transaction
    );

    // Attempt to get the transaction receipt
    const transactionReceipt = await alchemy.core.getTransactionReceipt(
      transaction
    );

    // Combine both transaction details and receipt
    return {
      ...transactionDetails,
      ...transactionReceipt,
    };
  } catch (error) {
    // Log the error and return a message indicating failure
    console.error("Error fetching transaction or receipt:", error);
    return {
      error: "Failed to fetch transaction or receipt",
      details: error.message,
    };
  }
};

// -- Address

export const getAddressBalance = async (_address) => {
  try {
    // console.log("Fetching balance for address:", _address);
    const formattedAddress = _address.toLowerCase();

    // Check if the address is valid
    if (
      !formattedAddress ||
      !formattedAddress.startsWith("0x") ||
      formattedAddress.length !== 42
    ) {
      throw new Error("Invalid Ethereum address");
    }

    const balance = await alchemy.core.getBalance(formattedAddress);
    return { balance: balance.toString() }; // Convert balance to string if it's a BigNumber
  } catch (error) {
    console.error("Error fetching balance:", error);
    return { balance: null, error: error.message };
  }
};

export const getAddressTokens = async (_address) => {
  try {
    // Ensure the address is in lowercase format
    const formattedAddress = _address.toLowerCase();

    // Check if the address is valid
    if (
      !formattedAddress ||
      !formattedAddress.startsWith("0x") ||
      formattedAddress.length !== 42
    ) {
      throw new Error("Invalid Ethereum address");
    }

    // Fetch token balances for the given address
    let tokenBalances = await alchemy.core.getTokenBalances(formattedAddress);

    if (tokenBalances && tokenBalances.tokenBalances) {
      tokenBalances = tokenBalances.tokenBalances
        .filter((token) => {
          // Filter out tokens with zero balance (address is all zeroes)
          return (
            token.tokenBalance !==
            "0x0000000000000000000000000000000000000000000000000000000000000000"
          );
        })
        .slice(0, MAX_ITEMS_PRE_PAGE); // Limit the number of tokens per page

      // Loop through all tokens with non-zero balance
      for (let token of tokenBalances) {
        // Get balance of token
        let balance = token.tokenBalance;

        // Get metadata of token
        const metadata = await alchemy.core.getTokenMetadata(
          token.contractAddress
        );

        // Compute token balance in human-readable format
        const decimals = metadata.decimals || 18; // Default to 18 if decimals not available
        balance = balance / Math.pow(10, decimals); // Normalize the balance based on the token's decimals
        balance = balance.toFixed(2); // Format the balance to two decimal places

        token.normalizedBalance = balance; // Attach normalized balance to token object

        // Merge metadata into token object
        Object.assign(token, metadata);
      }
    } else {
      tokenBalances = []; // If no token balances are found, return an empty array
    }

    return {
      tokenBalances,
      // Uncomment below if you want to add contract storage data
      //...await alchemy.core.getStorageAt(formattedAddress, slot position in hex, "latest")
    };
  } catch (error) {
    console.error("Error fetching tokens for address:", error);
    return { tokenBalances: [], error: error.message };
  }
};

export const getAddressTransactions = async (
  _address,
  _fromBlock = "0x0",
  _categories = ["external", "internal", "erc20", "erc721", "erc1155"]
) => {
  try {
    // Ensure the address is in lowercase format
    const formattedAddress = _address.toLowerCase();

    // Check if the address is valid
    if (
      !formattedAddress ||
      !formattedAddress.startsWith("0x") ||
      formattedAddress.length !== 42
    ) {
      throw new Error("Invalid Ethereum address");
    }

    // Fetch transactions for the given address
    const transactions = await alchemy.core.getAssetTransfers({
      fromBlock: _fromBlock,
      toAddress: formattedAddress,
      category: _categories,
      maxCount: MAX_ITEMS_PRE_PAGE, // Limit the number of items per page
    });

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions for address:", error);
    return { transactions: [], error: error.message };
  }
};

export const getTransactionStatus = async (transactionHash) => {
  let retryCount = 0;
  const maxRetries = 5; // Max retries before giving up
  const retryDelay = 2000; // Delay in milliseconds (2 seconds)

  while (retryCount < maxRetries) {
    try {
      // Fetch the transaction receipt
      const transactionReceipt = await alchemy.core.getTransactionReceipt(
        transactionHash
      );

      if (transactionReceipt) {
        // If receipt is found, check its status
        console.log(transactionReceipt);
        const status = transactionReceipt.status === 1 ? "Success" : "Failed";
        return { status, transactionReceipt };
      } else {
        // If no receipt, it might still be pending, so wait and retry
        console.log("Receipt not found, retrying...");
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Wait before retrying
      }
    } catch (error) {
      console.error("Error fetching transaction status:", error);
      return { status: "error", error };
    }
  }

  // If the transaction status is still pending after retries
  return { status: "Pending", message: "Transaction still pending" };
};

// Alchemy RPC URLs for supported networks (You should replace 'your-api-key' with your actual Alchemy API key)

export const getProvider = (chainId) => {
  const rpcUrl = alchemyRpcUrls[chainId];
  console.log(rpcUrl);
  if (!rpcUrl) {
    throw new Error(`No RPC URL found for chain ID ${chainId}`);
  }
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return provider;
};

export async function getTransactionStatusnew(txHash, chainId) {
  const provider = getProvider(chainId);

  try {
    // Fetch transaction receipt
    const receipt = await provider.getTransactionReceipt(txHash);
    if (receipt) {
      console.log("Transaction receipt:", receipt);
      // You can now inspect the `receipt` and determine the status
      return receipt.status === 1 ? "Success" : "Failed";
    } else {
      return "Pending"; // If receipt is not found, the transaction is still pending
    }
  } catch (error) {
    console.error("Error fetching transaction receipt:", error);
    return "Error"; // If there's an error, return an error message
  }
}
const alchemyRpcUrls = {
  1: `https://rpc.ankr.com/eth`,
  10: "https://rpc.ankr.com/optimism/",
  14: "https://rpc.ankr.com/flare/",
  25: "https://evm.cronos.org",
  40: "https://mainnet.telos.net/evm",
  56: "https://binance.llamarpc.com",
  61: "https://etc.nownodes.io/f9db9625-4fef-4283-927d-71d4c35d6d3a",
  137: "https://polygon.llamarpc.com",
  250: "https://rpcapi.fantom.network",
  1030: "https://evm.confluxrpc.com",
  1284: "https://moonbeam.public.blastapi.io",
  1285: "https://moonriver.public.blastapi.io",
  4689: "https://babel-api.mainnet.iotex.io",
  9001: "https://evm-rpc.evmos.silentvalidator.com",
  10001: "https://mainnet.ethereumpow.org",
  32659: "https://mainnet.fusionnetwork.io",
  42161: "https://arb1.arbitrum.io/rpc",
  42220: "https://forno.celo.org",
  43114: "https://rpc.ankr.com/avalanche_fuji",
  1313161554: "https://mainnet.aurora.dev",
  1116: "https://rpc.coredao.orgs",
  88888: "https://rpc.ankr.com/chiliz ",
  8453: "https://mainnet.base.org",
  81457: "https://rpc.blast.io",
  361: "https://eth-rpc-api.thetatoken.org/rpc",
  534353: "https://rpc.scroll.io",
  5000: "https://rpc.mantle.xyz",
  66: "https://exchainrpc.okex.org",
  16718: "https://network.ambrosus.io",
  6001: "https://fullnode-mainnet.bouncebitapi.com",
  234: "https://mainnet.era.zksync.io",
};
export const getTransactionStatusRPC = async (txHash, chainId) => {
  const rpcUrl = alchemyRpcUrls[chainId]; // Custom RPC URL for Arbitrum
  let provider = null;
  try {
    provider = new ethers.JsonRpcProvider(rpcUrl);
  } catch (error) {
    console.log(error);
  }
  // Using JsonRpcProvider to connect to Arbitrum network
  if (provider) {
    // try {
    //   // Create a provider instance
    //   const p = new ethers.JsonRpcProvider("https://mainnet.era.zksync.io");
    //   // Test the connection by getting the latest block number
    //   const blockNumber = await p.getBlockNumber();
    //   console.log("RPC URL is valid. Latest block number:", blockNumber);
    //   return true;
    // } catch (error) {
    //   console.error("Failed to connect to the RPC URL:", error);
    //   return false;
    // }

    try {
      // Fetch transaction receipt
      console.log(provider);
      const receipt = await provider.getTransactionReceipt(txHash);
      if (receipt) {
        // Check if the receipt's status indicates success or failure
        console.log(receipt);
        return receipt.status === 1 ? "Success" : "Failed";
      } else {
        // If receipt is not found, the transaction is still pending
        return "Pending";
      }
    } catch (error) {
      console.error("Error fetching transaction receipt:", error);
      return "Error"; // Return error if any issues fetching the transaction
    }
  }
};
