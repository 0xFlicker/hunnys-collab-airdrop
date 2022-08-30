import { Command } from "commander";
import airdropCommand from "./commands/airdrop";

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

program.parse(process.argv);
