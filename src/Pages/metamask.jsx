import React, { useState, useEffect } from "react";
import { formatEther } from "ethers";  // Only importing necessary utilities
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
    FormGroup,
    Form
} from "reactstrap";
import Swal from "sweetalert2";

function MetaMaskApp({ publicAddress, HandleUpdate, chanepublic, amount, isvisible, onClose }) {
    const [data, setData] = useState({
        address: "",
        balance: null,
    });
    const [isConnecting, setIsConnecting] = useState(false);
    const [ethAmount, setEthAmount] = useState("");

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: "eth_accounts" })
                .then((accounts) => {
                    if (accounts.length > 0) {
                        accountChangeHandler(accounts[0]);
                    }
                })
                .catch(err => Swal.fire("Error", err.message, "error"));
        }
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                setIsConnecting(true);
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                accountChangeHandler(accounts[0]);
                Swal.fire("Success!", "Connected to MetaMask", "success");
            } catch (err) {
                Swal.fire("Error!", err.message, "error");
            } finally {
                setIsConnecting(false);
            }
        } else {
            Swal.fire("Info", "Please install MetaMask extension!", "info");
        }
    };

    const accountChangeHandler = (account) => {
        setData({ address: account });
        getBalance(account);
    };


    const getBalance = async (address) => {
        if (!window.ethereum) {
            Swal.fire("Info", "Ethereum provider not found. Install MetaMask.", "info");
            return;
        }
        try {
            const balance = await window.ethereum.request({
                method: "eth_getBalance",
                params: [address, "latest"],
            });

            const formattedBalance = formatEther(balance);
            setData(prevData => ({
                ...prevData,
                balance: formattedBalance,
            }));
        } catch (err) {
            Swal.fire("Error", "Failed to fetch balance: " + err.message, "error");
        }
    };

    const disconnectWallet = () => {
        setData({ address: "", balance: null });
        Swal.fire("Disconnected", "You have successfully disconnected from MetaMask.", "info");
    };

    // Send transaction
    const sendTransaction = async () => {

        if (window.ethereum && data.address) {

            if (!ethAmount) {
                Swal.fire('Error!', `Amount is required`, 'error');
                return
            }

            if (!publicAddress) {
                Swal.fire('Error!', `Sender Address is required`, 'error');
                return
            }

            if (publicAddress === data.address) {
                Swal.fire('Error!', `Sender Address and receiver address is same`, 'error');
                return
            }
            try {
                const value = (ethAmount * Math.pow(10, 18)).toString(16);
                const tx = {
                    from: data.address,
                    to: publicAddress,
                    value: value,
                    gasLimit: '0x5208',
                    gasPrice: '0x5208',
                };

                const txHash = await window.ethereum.request({
                    method: "eth_sendTransaction",
                    params: [tx],
                });
                getBalance(data.address)
                HandleUpdate(txHash)
                Swal.fire('Transaction Sent!', `Hash: ${txHash}`, 'success');
            } catch (error) {
                Swal.fire('Error!', `Transaction failed: ${error.message}`, 'error');
            }
        } else {
            Swal.fire('MetaMask is not connected!', 'Please connect to MetaMask first.', 'warning');
        }
    };


    useEffect(() => {
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            convertUsdToEth(amount);
        }
    }, [amount]);

    const convertUsdToEth = (usdAmount) => {
        const ethToUsdRate = 1500;
        const ethAmount = usdAmount / ethToUsdRate;
        setEthAmount(ethAmount.toFixed(5));
    };

    return (
        <>
            <Modal isOpen={isvisible} toggle={onClose} className="modal-dialog-centered">
                <ModalHeader>
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ margin: 0 }}>Metamask Connection</p>
                        {!data.address ? (
                            <Button style={{ marginLeft: 100 }} disabled={isConnecting} color="primary" onClick={connectWallet}>
                                {isConnecting ? "Connecting..." : "Connect to Wallet"}
                            </Button>
                        ) : (
                            <Button style={{ marginLeft: 100 }} color="primary" onClick={disconnectWallet}>
                                Disconnect Wallet
                            </Button>
                        )}
                    </div>
                </ModalHeader>

                <ModalBody>
                    <Container>
                        <Row>
                            <Col className="text-center">
                                <div><strong>Address: </strong>{data.address || "Not connected"}</div>
                                <div><strong>Balance: </strong>{data.balance ? `${data.balance} ETH` : "Not available"}</div>
                                <br />

                                {data.address && (
                                    <Form>
                                        <FormGroup row>
                                            <Label for="ethAmount" sm={4} className="text-left">Amount in ETH</Label>
                                            <Col sm={8}>
                                                <Input disabled id="ethAmount" type="text" value={ethAmount} className="mt-2" />
                                            </Col>
                                        </FormGroup>

                                        <FormGroup row>
                                            <Label for="usdAmount" sm={4} className="text-left">Amount in USD</Label>
                                            <Col sm={8}>
                                                <Input id="usdAmount" type="text" placeholder="Enter amount in USD" value={amount} disabled className="mt-2" />
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
                                )}
                            </Col>
                        </Row>
                    </Container>
                </ModalBody>

                <ModalFooter>
                    {data.address && (
                        <Button color="primary" onClick={sendTransaction}>
                            Send Transaction
                        </Button>
                    )}
                    <Button color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default MetaMaskApp;
