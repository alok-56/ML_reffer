import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Button,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Container,
    Row,
    Col,
    Label,
    Form,
    FormGroup
} from "reactstrap";
import Swal from "sweetalert2";

// Mock function for getting ETH to USD exchange rate
const getEthToUsdRate = async () => {
    const rate = 1500; // Assume 1 ETH = 1500 USD for now
    return rate;
};

function MetaMaskApp({ publicAddress, chanepublic, amount, isvisible, onClose }) {
    const [data, setData] = useState({
        address: "",
        balance: null,
    });
    const [isConnecting, setIsConnecting] = useState(false);
    const [ethAmount, setEthAmount] = useState("");

    const btnHandler = async () => {
        if (window.ethereum) {
            try {
                setIsConnecting(true);
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                accountChangeHandler(accounts[0]);
            } catch (err) {
                Swal.fire("INFO!", err.message, "danger");
            } finally {
                setIsConnecting(false);
            }
        } else {
            Swal.fire("INFO!", "Please install MetaMask extension!", "danger");
        }
    };

    const getBalance = (address) => {
        window.ethereum
            .request({
                method: "eth_getBalance",
                params: [address, "latest"],
            })
            .then((balance) => {
                setData({
                    address: address,
                    balance: ethers.utils.formatEther(balance),
                });
            })
            .catch((err) => {
                console.error("Error getting balance:", err);
            });
    };

    const accountChangeHandler = (account) => {
        setData({
            address: account,
        });
        getBalance(account);
    };

    // Convert USD to ETH
    const convertUsdToEth = async (usdAmount) => {
        const ethToUsdRate = await getEthToUsdRate();
        const ethAmount = usdAmount / ethToUsdRate;
        setEthAmount(ethAmount.toFixed(5));
    };

    const sendTransaction = async () => {
        if (!window.ethereum) {
            Swal.fire("INFO!", "MetaMask is not installed!", "info");
            return;
        }

        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            const senderAddress = accounts[0];

            if (data.address !== senderAddress) {
                Swal.fire("Error!", "Sender address does not match the connected MetaMask account", "error");
                return;
            }

            const value = ethers.utils.parseEther(amount);

            const tx = {
                from: data.address,
                to: publicAddress,
                value: value.toHexString(),
                gasPrice: "0x5208",
                gasLimit: "0x5208",
            };

            
            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [tx],
            });

            Swal.fire("Success!", `Transaction sent! Hash: ${txHash}`, "success");
        } catch (error) {
            console.error("Transaction failed", error);
            Swal.fire("Error!", "Transaction failed: " + error.message, "error");
        }
    };


    const disconnectWallet = () => {
        setData({
            address: "",
            balance: null,
        });
    };

    useEffect(() => {
        if (publicAddress) {
            setData({
                address: publicAddress,
            });
            getBalance(publicAddress);
        }
    }, [publicAddress]);

    useEffect(() => {
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            convertUsdToEth(amount);
        }
    }, [amount]);

    return (
        <>
            <Modal
                isOpen={isvisible}
                toggle={() => onClose()}
                className="modal-dialog-centered"
            >
                <ModalHeader>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <p style={{ margin: 0 }}>Metamask Connection</p>
                        {
                            !data.address ? <Button
                                style={{ marginLeft: 100 }}
                                disabled={isConnecting}
                                color="primary"
                                onClick={btnHandler}
                            >
                                {isConnecting ? "Connecting..." : "Connect to Wallet"}
                            </Button> : <Button style={{ marginLeft: 100 }} color="primary" onClick={disconnectWallet}>
                                Disconnect Wallet
                            </Button>
                        }

                    </div>
                </ModalHeader>

                <ModalBody>
                    <Container>
                        <Row>
                            <Col className="text-center">
                                <div>
                                    <strong>Address: </strong>
                                    {data.address ? data.address : "Not connected"}
                                </div>
                                <div>
                                    <strong>Balance: </strong>
                                    {data.balance ? `${data.balance} ETH` : "Not available"}
                                </div>
                                <br />

                                {data.address && (
                                    <>
                                        <Form>
                                            <FormGroup row>
                                                <Label for="ethAmount" sm={4} className="text-left">Amount in ETH</Label>
                                                <Col sm={8}>
                                                    <Input
                                                        disabled
                                                        id="ethAmount"
                                                        type="text"
                                                        value={ethAmount}
                                                        className="mt-2"
                                                    />
                                                </Col>
                                            </FormGroup>

                                            <FormGroup row>
                                                <Label for="usdAmount" sm={4} className="text-left">Amount in USD</Label>
                                                <Col sm={8}>
                                                    <Input
                                                        id="usdAmount"
                                                        type="text"
                                                        placeholder="Enter amount in USD"
                                                        value={amount}
                                                        disabled
                                                        className="mt-2"
                                                    />
                                                </Col>
                                            </FormGroup>

                                            <FormGroup row>
                                                <Label for="publicAddress" sm={4} className="text-left">Public Address</Label>
                                                <Col sm={8}>
                                                    <Input
                                                        id="publicAddress"
                                                        type="textarea"
                                                        value={publicAddress}
                                                        className="mt-2"
                                                        onChange={chanepublic}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                    </>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={sendTransaction}>
                        Send Transaction
                    </Button>
                    <Button color="secondary" onClick={() => onClose()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default MetaMaskApp;
