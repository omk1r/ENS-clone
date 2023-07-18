import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";
import contractABI from "./contractABI.json";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

function App() {
  const provider = typeof window !== "undefined" && window.ethereum;

  const [contract, setContract] = useState();
  const [user, setUser] = useState("");
  const [connected, setConnected] = useState(false);
  const [domain, setDomain] = useState("");
  const [checkDomain, setCheckDomain] = useState("");
  const [Transferdomain, setTransferDomain] = useState("");
  const [TransferdomainAddress, setTransferDomainAddress] = useState("");

  const contractAddress = "0x26722b522B68557F6467bd481323EC3ba1372eF9";

  const connect = async () => {
    try {
      if (!provider) return alert("Please install metamask");
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length) {
        setUser(accounts[0]);
        setConnected(true);
      }
    } catch (error) {}
  };

  const web3 = new Web3(provider);

  const getContract = async () => {
    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      setContract(contract);
    } catch (error) {
      alert(error);
    }
  };

  const registerDomain = async () => {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const amountInWei = "100000000000000000"; // 0.1 ether in wei

      await contract.methods.registerDomain(domain).send({
        from: user,
        value: amountInWei,
        gasPrice: gasPrice,
      });
    } catch (error) {
      alert(error);
    }
  };

  const transferDomain = async () => {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      await contract.methods
        .transferDomain(Transferdomain, TransferdomainAddress)
        .send({
          from: user,
          gasPrice: gasPrice,
        });
    } catch (error) {
      alert(error);
    }
  };

  const getDomain = async () => {
    try {
      if (checkDomain) {
        const gasPrice = await web3.eth.getGasPrice();
        const address = await contract.methods.getDomain(checkDomain).call({
          from: user,
          gasPrice: gasPrice,
        });
        alert("address : " + address);
        setCheckDomain("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getContract();
  }, []);

  return (
    <>
      <Container>
        <h1 className="textCentre">ENS</h1>
        <div className="connect-button">
          <Button onClick={() => connect()}>
            {connected ? user.slice(0, 4) + "..." + user.slice(38) : "Connect"}
          </Button>
        </div>
        {connected ? (
          <div className="form-container">
            <Form>
              <Form.Group>
                <Form.Label>Get Domain</Form.Label>
                <Form.Control
                  type="text"
                  value={checkDomain}
                  onChange={(e) => setCheckDomain(e.target.value)}
                  required
                  placeholder="Domain"
                ></Form.Control>
                <Button
                  variant="primary"
                  className="submitbtn"
                  onClick={() => getDomain()}
                >
                  Check Domain
                </Button>
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>Register Domain</Form.Label>
                <Form.Control
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                  placeholder="Domain"
                ></Form.Control>
                <Button
                  variant="primary"
                  className="submitbtn"
                  onClick={() => registerDomain()}
                >
                  Register
                </Button>
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>Transfer Domain</Form.Label>
                <Form.Control
                  type="text"
                  value={Transferdomain}
                  onChange={(e) => setTransferDomain(e.target.value)}
                  required
                  placeholder="Domain"
                ></Form.Control>
                <Form.Control
                  type="text"
                  value={TransferdomainAddress}
                  onChange={(e) => setTransferDomainAddress(e.target.value)}
                  required
                  placeholder="Address"
                ></Form.Control>
                <Button
                  variant="primary"
                  className="submitbtn"
                  onClick={() => transferDomain()}
                >
                  Transfer
                </Button>
              </Form.Group>
            </Form>
          </div>
        ) : (
          <h3>Please connect your wallet</h3>
        )}
      </Container>
    </>
  );
}

export default App;
