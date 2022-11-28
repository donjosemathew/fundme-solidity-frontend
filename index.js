const connectbtn = document.getElementById("connectButton");
const fundbtn = document.getElementById("fundButton");
import { ethers } from "./ethers.js";
import { abi, contractAddress } from "./constant.js";
connectbtn.addEventListener("click", () => {
  connect();
});
fundbtn.addEventListener("click", () => {
  fund();
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
async function fund(eth_amount) {
  console.log(eth_amount);
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(".1"),
      });
    } catch (e) {
      console.log(e);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {}
