# hunnys-collab-airdrop

Script to send Hunnys collab airdrops, with :heart:

# Prereqs

- IPFS endpoint (includes support for Infura auth)
- WEB3 RPC

For infura, sign up at https://infura.io/register. Create a "WEB3 API" and "IPFS" project. You will need the web3 rpc URL (e.g. https://mainnet.infura.io/v3/badbeef) as well as the IPFS project ID and secret.

# Installing

1. Install [NodeJS](https://nodejs.org/en/)
2. Open a NodeJS terminal
3. Install yarn globally:

```bash
npm i -g yarn
```

4. clone the repo:

```bash
git clone git@github.com:0xFlicker/hunnys-collab-airdrop.git
```

5. enter and install dependencies

```bash
cd hunnys-collab-airdrop
yarn
```

6. Get help:

```bash
yarn cli --help
```

# Usage

## Fetching metadata

To get holder information by metadata, you need all of the metadata. If you have it handy, great! Stick it in a folder called `metadata/{Collection Name}/*.json`

Otherwise, run:

```
yarn cli metadata --contract [contract address] --infura-ipfs-project-id [infura ipfs project id] --infura-ipfs-secret [infura ipfs secret] --rpc [web3 rpc]
```

_replace [contract address] with the contract address_
_replace [infura ipfs project id] with the Infura IPFS project ID_
_replace [infura ipfs secret] with the Infura IPFS secret_
_replace [web3 rpc] with the web3 RPC URL_

The metadata will download to `metadata/{Collection Name}/*.json`

## Fetching holders of a specific trait

Once metadata has been downloaded, owners for a specific trait can be extracted.

```
yarn cli owners-of --trait-name [trait name] --trait-value [trait value] --rpc [web3 rpc] --contract [contract address]
```

_replace [trait name] with the trait name_
_replace [trait value] with the trait value_
_replace [contract address] with the contract address_
_replace [web3 rpc] with the web3 RPC URL_

output will be a text file called `[trait name]-[trait value].txt`

e.g.

```
yarn cli owners-of  --trait-name Zodiac --trait-value Aquarius --rpc https://mainnet.infura.io/v3/your-project-id --contract 0xac9695369a51dad554d296885758c4af35f77e94
```

output will be a text file called `Zodiac-Aquarius.txt` with one address per line
