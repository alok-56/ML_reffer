import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Table,
} from "reactstrap";

const TableComponent = ({ rowData, onDeleteUser, onAddFunds }) => {
  const [modalOpen, setModalOpen] = useState(false); // Modal visibility for adding funds
  const [selectedUserId, setSelectedUserId] = useState(null); // User to add funds to
  const [amount, setAmount] = useState(""); // Amount to add

  // Open the modal for adding funds
  const openAddFundsModal = (userId) => {
    setSelectedUserId(userId); // Set selected user
    setModalOpen(true); // Open modal
  };

  // Close the modal
  const closeAddFundsModal = () => {
    setModalOpen(false); // Close modal
    setAmount(""); // Clear input field
  };

  const handleAddFunds = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    onAddFunds(selectedUserId, parseFloat(amount)); // Add funds for the selected user
    closeAddFundsModal(); // Close the modal
  };

  // Column definitions
  const columns = [
    { headerName: "Name", field: "name", flex: 1 },
    { headerName: "Email", field: "email", flex: 1 },
    { headerName: "Password", field: "password", flex: 1 },
    { headerName: "Referral Code", field: "referralCode", flex: 1 },
    { headerName: "Reward", field: "reward", flex: 1 },
    { headerName: "Status", field: "status", flex: 1 },
    { headerName: "Rank", field: "rank", flex: 1 },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.headerName}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rowData.map((user, index) => (
            <tr key={user.id}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{user[col.field]}</td>
              ))}
              <td>
                <Button
                  color="danger"
                  onClick={() => onDeleteUser(user.id)}
                  size="sm"
                  className="mr-2"
                >
                  Delete
                </Button>
                <Button
                style={{marginLeft:10}}
                  color="success"
                  onClick={() => openAddFundsModal(user.id)}
                  size="sm"
                >
                  Add Funds
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add Funds */}
      <Modal isOpen={modalOpen} toggle={closeAddFundsModal}>
        <ModalHeader toggle={closeAddFundsModal}>Add Funds</ModalHeader>
        <ModalBody>
          <div>
            <label htmlFor="amount">Enter Amount to Add</label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeAddFundsModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleAddFunds}>
            Add Funds
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TableComponent;
