const connectbtn = document.getElementById("connectButton");
const fundbtn = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withDraw = document.getElementById("withdrawButton");
import { ethers } from "./ethers.js";
import { abi, contractAddress } from "./constant.js";
connectbtn.addEventListener("click", () => {
  connect();
});
fundbtn.addEventListener("click", () => {
  fund();
});
balanceButton.addEventListener("click", () => {
  getBalance();
});
withDraw.addEventListener("click", () => {
  withDra();
});

async function connect() {
  if (typeof window.ethereum != "undefined") {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    document.getElementById("connectButton").innerHTML = "Connected!";
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please install MetaMask";
  }
}
async function fund() {
  const eth_amount = document.getElementById("ethAmount").value;
  console.log(eth_amount);
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(eth_amount),
      });
      await listenForTransactionMine(transactionResponse, provider);
    } catch (e) {
      console.log(e);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  //13.23
  console.log("Mining " + transactionResponse.hash);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionRecipt) => {
      console.log(
        "Recieved with ",
        transactionRecipt.confirmations + "Confirmations"
      );
      resolve();
    });
  });
}

async function getBalance() {
  console.log("sj");
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function withDra() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
      // await transactionResponse.wait(1)
    } catch (error) {
      console.log(error);
    }
  }
}
