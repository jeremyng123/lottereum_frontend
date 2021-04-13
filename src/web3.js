import Web3 from "web3";
const web3 = new Web3(
  Web3.givenProvider || new Web3.providers.HttpProvider("http://127.0.0.1:9545")
);
export default web3;
//
