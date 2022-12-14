# CryptoInsight (Blockchain/Text->SQL)


NOTE: The code may not work, and we take no responsibility for the code and its effects in any way. 

<p align="center">
    <a href="https://www.loom.com/share/b5400afcb0e049e8a74dc6a473f0ad7d"><img src="https://img.shields.io/badge/Loom-Demo-red"></a>
    <a href="https://www.llmhub.com/2/functions/23/share"><img src="https://img.shields.io/badge/LLMHub%20-%E2%AD%90%EF%B8%8F-brightgreen" alt="LLMHub"></a>
</p>

## Overview

Bitcoin is ~400 GB of data, and Ethereum is at 1 Terabyte. If the number of transactions on the blockchain starts to match that on VISA, we’re looking at ~350GB PER DAY. At these scales, it doesn’t matter if we’ve built “open databases”, for all intents and purposes these will be closed off for most people. We’ve built theoretically open finance, but not practically open.

But, we’ve noticed this problem already with the scales of data that exist even today. A web3 company that we shared office space with had the exact same problem.

So, in October, @sidroopdaska and I (@vatsalaggarwal) sat down and built out a hacky MVP over the weekend. We called it the “Webflow for web3 dashboards”. The idea was to make creating web3 dashboards like https://info.uniswap.org/#/ or https://dune.com/anngel/XDAO-Statistics as “no-code” as possible. This meant: i) easy UI to create charts and place them, ii) for each component/chart, being able to populate the data using “natural language” (we used large language models to convert text-to-SQL).

You can find a demo at: https://www.loom.com/share/b5400afcb0e049e8a74dc6a473f0ad7d. This code opensources this demo.

On the way, we realised the problem was much deeper than that - we ran into the following: i) data availability: time to “access data” from the most recent block created on the chain, ii) data quality: how well is the data structured to be able to do something meaningful with it (usually the result of doing ETL on raw data to create “tables” that relate to certain tasks downstream users might want to perform), iii) intelligence/BI: how easy is it to get answers to specific questions someone has.

We completely ignored data availability.

On the data quality front, we learnt that Dune is the market-leader. Their structured tables are the best out there, but it is not possible to access them via a SDK. So you’re locked into running queries on Dune, and with the tools they provide. We explored alternatives, and were dumbfounded - our main options were Google BigQuery, and ShroomDK by Flipside Crypto. ShroomDK was exciting to get started with, but we quickly ran into issues - some very simple queries took 1 day to return! Google BigQuery is possible, but they only have a few tables - practically this means that your SQL needs to do a lot of work on top!

On BI, we found users mainly forked existing Dune queries, and tried to edit them. Alternatively, they might use Messari or existing platforms, which were basically forms of “pre-populated dashboards”. If users wanted to make edits beyond what these platforms allowed, they would go to Dune. But there was not much else.

So, there is loads to solve here, and loads of users that are underserved. We need to significantly reduce the time it takes for someone to get answers to questions they might have about data on the blockchain, and we need to do this in the “right” way. 

In summary,
- Make good data available
- Make it possible to run queries that return “current” results (i.e. not outdated)
- Reduce the friction for non-technical users to convert their thoughts/questions into computer-executable queries.
- Not lock users in - build open interfaces, but keep solving downstream painpoints they’ve in an open way, so there is no need for them to leave!

If you’re solving any of these problems, I hope this helps you.
## Usage

```bash
python server/main.py &
npm start
```

### Installing

EC2:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install --lts
```

After this, run `make setup`. Note due to error in activate conda environments via scripts, each
step would have to be done manually at the moment.


## References

### Data ETL
1. Flipside
    - https://docs.flipsidecrypto.com/shroomdk-sdk/python
    - https://sdk.flipsidecrypto.xyz/shroomdk/apikeys
    - https://flipsidecrypto.github.io/ethereum-models/#!/overview
    - https://flipsidecrypto.github.io/ethereum-models/#!/model/model.ethereum_models.core__fact_transactions
    - https://flipsidecrypto.github.io/ethereum-models/#!/model/model.ethereum_models.core__ez_nft_transfers
