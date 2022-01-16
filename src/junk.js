// async function deployNFTContract(_mintToAddress) {
//   let url = "https://api.nftport.xyz/v0/contracts";
//   const NftInfo = {
//     chain: CHAIN,
//     name: "Customizable NFT",
//     symbol: "CNF",
//     owner_address: _mintToAddress,
//   };

//   let options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: AUTH,
//     },
//     body: JSON.stringify(NftInfo),
//   };

//   return fetch(url, options)
//     .then(async (res) => {
//       const status = res.status;
//       if (status == 200) {
//         return res.json();
//       } else {
//         console.log("Error: ", status);
//         return;
//       }
//     })
//     .then((json) => {
//       console.log(json);
//       getNFTContract(json.transaction_hash);
//     });
// }

// async function getNFTContract(transactionHash) {
//   let url = "https://api.nftport.xyz/v0/contracts/" + transactionHash;
//   let options = {
//     method: "GET",
//     qs: { chain: CHAIN },
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: AUTH,
//     },
//   };

//   return fetch(url, options)
//     .then(async (res) => {
//       const status = res.status;
//       if (status == 200) {
//         return res.json();
//       } else {
//         console.log("Error: ", status);
//         return;
//       }
//     })
//     .then((json) => {
//       console.log("DEPLOYED CONTRACT Address", json.contract_address);
//       // console.log(json);
//       CONTRACT_ADDRESS = json.contract_address;
//     });
// }

const fetch = require("node-fetch");

let url =
  "https://api.nftport.xyz/v0/contracts/0xbbf40dd81cc983df7a9f043e82b798abac4a8cdfd2ff4d2711343be947c99439";

let options = {
  method: "GET",
  qs: { chain: "rinkeby" },
  headers: {
    "Content-Type": "application/json",
    Authorization: "198adc16-5d25-450e-bf19-130b0880a38a",
  },
};

fetch(url, options)
  .then((res) => res.json())
  .then((json) => {
    console.log(json.detail);
    console.log("datattt", json.detail.loc[0]);
    console.log(json);
  })
  .catch((err) => console.error("error:" + err));

// NFTS <%= JSON.stringify(collections) %>

// <ul class="timeline">
//   <% for( let i = 0; i < collections.length; i++ ) { %> <% for( let j = 0; j
//   < collections[i].minted_nfts.length; j++ ) { %>

//   <li><%= collections[i].minted_nfts[j].chain %></li>

//   <li> <%= collections[i].contract_address %>  </li>

//   <% } %> <% } %>
// </ul>
