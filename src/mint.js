const fetch = require("node-fetch");
const path = require("path");
const basePath = process.cwd();
const fs = require("fs");

// const AUTH = "198adc16-5d25-450e-bf19-130b0880a38a";
const AUTH = "33f6df55-80b6-439b-9274-5ce39c7b5bef"
// const AUTH = process.env.NFTPORT_API_KEY;

let CONTRACT_ADDRESS;
const MINT_TO_ADDRESS = "0xc77327F1851255b9f4DA527CEDB91C54499123ef";
const CHAIN = "rinkeby";
const TIMEOUT = 1000;

if (!fs.existsSync(path.join(`${basePath}/build`, "/minted"))) {
  console.log("Creating minted directory");
  fs.mkdirSync(path.join(`${basePath}/build`, "minted"));
} else {
  console.log("DELETED");
  fs.rmdirSync(path.join(`${basePath}/build`, "minted"), { recursive: true });
}

async function mintNFT() {
  console.log("Checked the minited directory...........");

  let contractUrl = "https://api.nftport.xyz/v0/contracts";
  const NftInfo = {
    chain: CHAIN,
    name: "Customizable NFT",
    symbol: "CNF",
    owner_address: MINT_TO_ADDRESS,
  };

  let options1 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: AUTH,
    },
    body: JSON.stringify(NftInfo),
  };

  fetch(contractUrl, options1)
    .then(async (res) => {
      const status = res.status;
      if (status == 200) {
        return res.json();
      } else {
        console.log("Error: ", status);
        return;
      }
    })
    .then((json) => {
      console.log(">>>>>>>>>>", json);

      console.log(json.transaction_hash, "TRANSACTION HASHHHS");

      let getContracturl =
        "https://api.nftport.xyz/v0/contracts/" + json.transaction_hash;
      let options2 = {
        method: "GET",
        qs: { chain: CHAIN },
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH,
        },
      };

      console.log(getContracturl);
      console.log(options2);

      fetch(getContracturl, options2)
        .then((res2) => {
          const status = res2.status;
          if (status == 200) {
            return res2.json();
          } else {
            console.log("Error: ", status);
            return res2.json();
            // return;
          }
        })
        .then((json2) => {
          console.log(json2);
          // console.log("DEPLOYED CONTRACT Address", json2.contract_address);
          // CONTRACT_ADDRESS = json2.contract_address;
        })
        .catch((err) => {
          console.log("ERROR :))))))))))))", err);
        });
    });

  // const ipfsMetas = JSON.parse(
  //   fs.readFileSync(`${basePath}/build/ipfsMetas/_ipfsMetas.json`)
  // );

  // for (const meta of ipfsMetas) {
  //   const mintFile = `${basePath}/build/minted/${meta.custom_fields.edition}.json`;
  //   try {
  //     fs.accessSync(mintFile);
  //     const mintedFile = fs.readFileSync(mintFile);
  //     if (mintedFile.length > 0) {
  //       const mintedMeta = JSON.parse(mintedFile);
  //       if (mintedMeta.mintData.response !== "OK") throw "not minted";
  //     }
  //     console.log(`${meta.name} already minted`);
  //   } catch (err) {
  //     try {
  //       let mintData = await fetchWithRetry(meta);
  //       const combinedData = {
  //         metaData: meta,
  //         mintData: mintData,
  //       };
  //       writeMintData(meta.custom_fields.edition, combinedData);
  //       console.log(`Minted: ${meta.name}!`);
  //     } catch (err) {
  //       console.log(`Catch: ${err}`);
  //     }
  //   }
  // }
}

function timer(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchWithRetry(meta) {
  await timer(TIMEOUT);
  return new Promise((resolve, reject) => {
    const fetch_retry = (_meta) => {
      let url = "https://api.nftport.xyz/v0/mints/customizable";

      const mintInfo = {
        chain: CHAIN,
        contract_address: CONTRACT_ADDRESS,
        metadata_uri: _meta.metadata_uri,
        mint_to_address: MINT_TO_ADDRESS,
        token_id: _meta.custom_fields.edition,
      };

      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH,
        },
        body: JSON.stringify(mintInfo),
      };

      return fetch(url, options)
        .then(async (res) => {
          const status = res.status;

          if (status === 200) {
            return res.json();
          } else {
            console.error(`ERROR STATUS: ${status}`);
            console.log("Retrying");
            await timer(TIMEOUT);
            fetch_retry(_meta);
          }
        })
        .then(async (json) => {
          if (json.response === "OK") {
            return resolve(json);
          } else {
            console.error(`NOK: ${json.error}`);
            console.log("Retrying");
            await timer(TIMEOUT);
            fetch_retry(_meta);
          }
        })
        .catch(async (error) => {
          console.error(`CATCH ERROR: ${error}`);
          console.log("Retrying");
          await timer(TIMEOUT);
          fetch_retry(_meta);
        });
    };
    return fetch_retry(meta);
  });
}

const writeMintData = (_edition, _data) => {
  fs.writeFileSync(
    `${basePath}/build/minted/${_edition}.json`,
    JSON.stringify(_data, null, 2)
  );
};

module.exports = {
  mintNFT,
};

mintNFT();
