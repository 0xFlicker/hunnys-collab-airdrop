import fs from "fs";
import { parse } from "csv-parse/sync";
import { Wallet, providers } from "ethers";
import { HunnysCollab__factory } from "../typechain";

interface IAirdropRow {
  holderAddress: string;
  tokenId: number;
  amount: number;
}

export default async function airdrop({
  csv,
  privateKey,
  contractAddress,
  fromAddress,
  rpcUrl,
  data = "",
  count: transactionCount,
}: {
  csv: string;
  privateKey: string;
  rpcUrl: string;
  contractAddress: string;
  fromAddress: string;
  data?: string;
  count?: number;
}) {
  // Read the CSV file
  const records = parse(fs.readFileSync(csv));
  const [_, ...rows] = records;
  const airdropRows: IAirdropRow[] = rows.map(
    ([holder, tokenId, amount]: string[]) => ({
      holderAddress: holder,
      tokenId: parseInt(tokenId),
      amount: parseInt(amount),
    })
  );

  // Connect to the network
  const wallet = new Wallet(privateKey);
  const provider = new providers.JsonRpcProvider(rpcUrl);
  const signer = wallet.connect(provider);

  // Create the contract instance
  const contract = HunnysCollab__factory.connect(contractAddress, signer);

  // Send the transactions
  let count = 0;
  for (const { holderAddress, tokenId, amount } of airdropRows) {
    console.log(`Sending ${amount} of token ${tokenId} to ${holderAddress}`);
    try {
      await contract.safeTransferFrom(
        fromAddress,
        holderAddress,
        tokenId,
        amount,
        data
      );
      count++;
    } catch (e) {
      console.error(e);
    }
    if (transactionCount && count >= transactionCount) {
      break;
    }
  }
  console.log("Done!");
}
