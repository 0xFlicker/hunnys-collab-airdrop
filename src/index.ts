import { Command } from "commander";
import {
  create as createIpfsHttpClient,
  IPFSHTTPClient,
} from "ipfs-http-client";
import { extractMetadata } from "./commands/extractMetadata";
import airdropCommand from "./commands/airdrop";
import { providers } from "ethers";
import { IERC721A__factory } from "./typechain";
import { ownersOfTrait } from "./commands/ownersOfTrait";
import { downloadMetadata } from "./commands/opensea";

const program = new Command();
program.name("hunnys-cli");
program
  .command("airdrop <csv>")
  .option(
    "-p, --private-key <privateKey>",
    "Private key of the account to send from"
  )
  .option("-r, --rpc <rpcUrl>", "The RPC URL to connect to")
  .option("-c, --contract <contractAddress>", "The contract address to send to")
  .option("-f, --from <fromAddress>", "The from address to send from")
  .option("-d, --data <data>", "The optional data to send with the transaction")
  .option("--count <count>", "The number of transactions to send")
  .action(async (csv, { privateKey, rpc, contract, from, data, count }) => {
    await airdropCommand({
      csv,
      privateKey,
      rpcUrl: rpc,
      contractAddress: contract,
      fromAddress: from,
      data,
      count: Number(count),
    });
  });

program
  .command("metadata")
  .option("-c, --contract <contract>", "contract address")
  .option("--ipfs <ipfs>", "ipfs url")
  .option(
    "--infura-ipfs-project-id <infura-ipfs-project-id>",
    "ipfs project id"
  )
  .option("--infura-ipfs-secret <infura-ipfs-secret>", "ipfs secret")
  .option("-r, --rpc <rpc-url>", "node url")
  .action(
    async ({
      contract: contractAddress,
      ipfs,
      infuraIpfsProjectId,
      infuraIpfsSecret,
      rpc: rpcUrl,
    }) => {
      let ipfsBasicAuth: string | null = null;
      if (infuraIpfsProjectId && infuraIpfsSecret) {
        ipfsBasicAuth = `Basic ${Buffer.from(
          `${infuraIpfsProjectId}:${infuraIpfsSecret}`
        ).toString("base64")}`;
      }
      const ipfsClient = createIpfsHttpClient({
        host: ipfs || "ipfs.infura.io:5001",
        protocol: "https",
        ...(ipfsBasicAuth ? { headers: { authorization: ipfsBasicAuth } } : {}),
      });
      const provider = new providers.JsonRpcProvider(rpcUrl);
      const contract = IERC721A__factory.connect(contractAddress, provider);
      await extractMetadata({
        contract,
        ipfsClient,
      });
    }
  );

program
  .command("owners-of")
  .option("-c, --contract-name <contract>", "contract name")
  .option("-t, --trait-name <trait>", "trait name")
  .option("-v, --trait-value <value>", "trait value")
  .option("-o, --output <output>", "output file")
  .option("-r, --rpc <rpc-url>", "node url")
  .option("-a, --contract <contract>", "contract address")
  .action(
    async ({
      contract: contractAddress,
      rpc: rpcUrl,
      contractName,
      traitName,
      traitValue,
      output,
    }) => {
      const provider = new providers.JsonRpcProvider(rpcUrl);
      const contract = IERC721A__factory.connect(contractAddress, provider);

      await ownersOfTrait({
        tokenName: contractName,
        traitName,
        traitValue,
        contract,
        output,
      });
    }
  );

const openseaCommand = program.command("opensea");

openseaCommand
  .command("metadata")
  .option("-s, --slug <slug>", "collection slug")
  .option("-k, --key <key>", "opensea api key")
  .action(async ({ slug, key }) => {
    await downloadMetadata({ collectionSlug: slug, apiKey: key });
  });

program.parse(process.argv);
