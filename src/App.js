import React, { useEffect, useState } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
// test

const App = () => {
  const [lotteryIDs, setLotteryIDs] = useState("");
  const [datetime, setDatetime] = useState("");
  const [lotteryCount, setLotteryCount] = useState("");
  const [currDeposit, setCurrDeposit] = useState("");
  const [waitingTime, setWaitingTime] = useState("");
  const [isActive, setIsActive] = useState("");
  const [lotteryID, setLotteryID] = useState("");
  const [bet, setBet] = useState("");
  const [userInput, setUserInput] = useState("");
  const [winner, setWinner] = useState("");
  const [winnings, setWinnings] = useState("");
  const [account, setAccount] = useState("");

  const [lotteries, setLotteries] = useState({});

  const ethereum = window.ethereum;
  const updateState = () => {
    console.log("UPDATING STATE");
    // console.log(web3);
    lottery.methods
      .showLotteryCount()
      .call()
      .then((res) => setLotteryCount(parseInt(res)))
      .catch((err) => console.log(err));
    lotteryCount > 0
      ? lottery.methods
          .lotteryIDs(lotteryCount - 1)
          .call()
          .then((res) => setLotteryIDs(parseInt(res)))
          .catch((err) => console.log(err))
      : lottery.methods
          .lotteryIDs(0)
          .call()
          .then((res) => setLotteryIDs(res))
          .catch((err) => console.log(err));
    lottery.methods
      .currDeposit()
      .call()
      .then((res) => setCurrDeposit(parseInt(res)))
      .catch((err) => console.log(err));
    lottery.methods
      .waitingTime()
      .call()
      .then((res) => setWaitingTime(parseInt(res)))
      .catch((err) => console.log(err));
    lottery.methods
      .isActive()
      .call()
      .then((res) => setIsActive(res))
      .catch((err) => console.log(err));
    // const t = new Date(parseInt(lotteryIDs));
    // setDatetime(t.format("dd.mm.yyyy hh:MM:ss"));
    console.log(lotteryIDs);

    // setDatetime(new Date(lotteryIDs * 1000));
    console.log(lotteryCount);
    console.log(currDeposit);
    console.log(waitingTime);
    console.log(isActive);
    console.log(datetime);
  };

  useEffect(() => {
    updateState();
    setInterval(() => {
      updateState();
    }, 5000);
  });

  const onStartGameSubmit = async (e) => {
    e.preventDefault();
    const accounts = await ethereum.request({ method: "eth_accounts" });
    await lottery.methods.startLottery().send({
      from: accounts[0],
      gas: 4000000,
    });
  };

  const onBuyTicketSubmit = async (e) => {
    e.preventDefault();
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const bytesInput = web3.utils.fromAscii(userInput);
    console.log(bytesInput);
    await lottery.methods.buyTicket(lotteryID, bytesInput).send({
      from: accounts[0],
      value: bet,
      gas: 4000000,
    });
  };

  const onResolveGameSubmit = async (e) => {
    e.preventDefault();
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const bytesInput = web3.utils.fromAscii(userInput);
    await lottery.methods.resolveLottery(lotteryID, bytesInput).send({
      from: accounts[0],
      gas: 4000000,
    });
  };

  const onGetPayoutSubmit = async (e) => {
    e.preventDefault();
    const accounts = await ethereum.request({ method: "eth_accounts" });
    await lottery.methods.getPayout(lotteryID).send({
      from: accounts[0],
      gas: 4000000,
    });
    let logWinner = lottery.methods.LogWinner;
    logWinner.watch((err, result) => {
      if (!err) {
        setWinner(logWinner._address);
        setWinnings(logWinner._winnings);
      } else {
        console.error(err);
      }
    });
  };
  const loginMetaMask = async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    console.log(accounts);
    setAccount(account);
  };

  return typeof ethereum !== "undefined" ? (
    <>
      <Button onClick={loginMetaMask}>Enable Ethereum</Button>
      <h2>Account: {account}</h2>
      <div className="auth-wrapper auth-inner">
        <h2>Lottereum</h2>
        <p>Latest Game ID: {lotteryIDs}</p>
        {/* <p>Date/Time Created: {datetime}</p> */}
        <p>Running Games: {lotteryCount}</p>
        <p>Current Honesty Deposit: {currDeposit}</p>
        <p>Game Length: {waitingTime} seconds</p>
        <p>Lottery Active: {isActive.toString()}</p>
        <hr />
        <div>
          <p>Winner: {winner}</p>
          <p>Winnings: {winnings}</p>
        </div>
        <hr />
        <div>
          <p>Game ID: {lotteryID}</p>
          <p>Bet: {bet}</p>
          <p>Secret: {userInput}</p>
        </div>
        <div>
          <div>
            <label>Game ID</label>
            <input
              placeholder="0123456789"
              value={lotteryID}
              onChange={(e) => setLotteryID(e.target.value)}
            />
          </div>
          <div>
            <label>Bet</label>
            <input
              placeholder={currDeposit}
              value={bet}
              onChange={(e) => setBet(e.target.value)}
            />
          </div>
          <div>
            <label>Secret Bytes</label>
            <input
              placeholder="0xdeadbeef"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Button onClick={onStartGameSubmit}>Start Game</Button>
          <Button onClick={onBuyTicketSubmit}>Buy Ticket</Button>
          <Button onClick={onResolveGameSubmit}>Resolve Game</Button>
          <Button onClick={onGetPayoutSubmit}>Get Payout</Button>
        </div>
      </div>
    </>
  ) : (
    <div>
      <h2>Install MetaMask!</h2>
    </div>
  );
};

export default App;
