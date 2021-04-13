import web3 from "./web3";

const lottery_json = require("./contracts/Lottereum.json");

const abi = lottery_json["abi"];
const address = lottery_json["networks"]["5777"]["address"];
// let address;
// try {
//   address = web3.eth.getAccounts()[0];
// } catch (e) {
//   console.log(e);
// }
// const address = "0xC905E25f5C7bd4BcEe3Aa7ec196158907b7cA2bC";
console.log(address);
export default new web3.eth.Contract(abi, address);
