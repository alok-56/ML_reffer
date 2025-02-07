import React, { useEffect, useState } from "react";
import TableComponent from "../../../Components/Table/TableComponents";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Spinner,
  Alert,
} from "reactstrap";

const SupplierDatabase = () => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: "",
    rank: "",
    publicKey: "",
  });

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [isAddingFunds, setIsAddingFunds] = useState(false);

  // New state for handling search input and user selection
  const [searchReferralCode, setSearchReferralCode] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await fetch(
        "https://wallet-seven-fawn.vercel.app/api/v1/users/alluser",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }

      const data = await response.json();
      const transformedData = data.data.map((user) => ({
        id: user._id,
        name: user.Name,
        email: user.Email,
        password: user.Password,
        referralCode: user.referralCode,
        reward: user.rewards,
        status: user.active ? "Active" : "Inactive",
        rank: user.Rank,
      }));

      setRowData(transformedData);
      setColumnDefs([
        { headerName: "Name", field: "name", flex: 1 },
        { headerName: "Email", field: "email", flex: 1 },
        { headerName: "Password", field: "password", flex: 1 },
        { headerName: "Referral Code", field: "referralCode", flex: 1 },
        { headerName: "Reward", field: "reward", flex: 1 },
        { headerName: "Status", field: "status", flex: 1 },
        { headerName: "Rank", field: "rank", flex: 1 },
      ]);
    } catch (error) {
      setError("Error fetching user data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Referral Code Search
  const handleReferralCodeSearch = (e) => {
    setSearchReferralCode(e.target.value);
    const filtered = rowData.filter((user) =>
      user.referralCode.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Select user from the search result
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setNewUser((prevState) => ({
      ...prevState,
      referralCode: user.referralCode,
    }));
    setSearchReferralCode(""); // Reset the search input once a user is selected
    setFilteredUsers([]); // Clear search results
  };

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      setIsDeletingUser(true);
      let token = localStorage.getItem("token");
      let response = await fetch(
        `https://wallet-seven-fawn.vercel.app/api/v1/users/blockuser/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        setLoading(false);
        throw new Error("Failed to delete user");
      }
      const data = await response.json();
      if (data.status) {
        alert("Successfully deleted");
        fetchData();
        setLoading(false);
      } else {
        alert(data.message);
        setLoading(false);
      }
    } catch (error) {
      setError("Error deleting user: " + error.message);
      setLoading(false);
    } finally {
      setIsDeletingUser(false);
      setLoading(false);
    }
  };

  const handleAddFunds = async (userId, amount) => {
    try {
      setLoading(true);
      setIsAddingFunds(true);
      let token = localStorage.getItem("token");
      let response = await fetch(
        "https://wallet-seven-fawn.vercel.app/api/v1/transaction/addfund/admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            UserId: userId,
            amount: amount,
          }),
        }
      );

      const data = await response.json();
      if (data.status) {
        alert("Successfully added funds");
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (error) {
      setError("Error adding funds: " + error.message);
    } finally {
      setIsAddingFunds(false);
      setLoading(false);
    }
  };

  const openAddUserModal = () => {
    setModalOpen(true);
  };

  const closeAddUserModal = () => {
    setModalOpen(false);
    setNewUser({
      name: "",
      email: "",
      password: "",
      referralCode: "",
      rank: "",
      publicKey: "",
    });
    setSelectedUser(null); // Reset selected user
  };

  const handleAddUser = async () => {
    try {
      setIsAddingUser(true);
      const { name, email, password, referralCode, rank, publicKey } = newUser;

      if (!name || !email || !password || !referralCode || !rank || !publicKey) {
        alert("All fields are required!");
        return;
      }

      let token = localStorage.getItem("token");
      const response = await fetch(
        "https://wallet-seven-fawn.vercel.app/api/v1/admin/add/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            Name: name,
            Email: email,
            Password: password,
            referralCode: referralCode,
            PublicKey: publicKey,
            Rank: rank,
          }),
        }
      );

      const data = await response.json();

      if (data.status) {
        alert("User added successfully!");
        fetchData();
        closeAddUserModal();
      } else {
        alert(data.message);
      }
    } catch (error) {
      setError("Error adding user: " + error.message);
    } finally {
      setIsAddingUser(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={12} className="mt-4">
          <Card className="p-4">
            <CardHeader
              style={{
                width: "97%",
                display: "flex",
                alignSelf: "center",
                borderRadius: 5,
              }}
            >
              <h1
                className="card-title"
                style={{
                  fontSize: "20px",
                  marginTop: 10,
                  fontFamily: "monospace",
                }}
              >
                User Database
              </h1>
              <Button
                style={{ marginLeft: 20, height: 40 }}
                color="primary"
                onClick={openAddUserModal}
                className="ml-3"
              >
                Add New User
              </Button>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="text-center">
                  <Spinner color="primary" /> Loading...
                </div>
              ) : error ? (
                <Alert color="danger">{error}</Alert>
              ) : (
                <TableComponent
                  columnDefs={columnDefs}
                  rowData={rowData}
                  paginationPageSize={10}
                  enableSearch={false}
                  onDeleteUser={handleDeleteUser}
                  onAddFunds={handleAddFunds}
                  isDeletingUser={isDeletingUser}
                  isAddingFunds={isAddingFunds}
                  isAddingUser={isAddingUser}
                />
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={modalOpen} toggle={closeAddUserModal}>
        <ModalHeader toggle={closeAddUserModal}>Add New User</ModalHeader>
        <ModalBody>
          <div>
            <label>Name</label>
            <Input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Enter Name"
            />
          </div>
          <div>
            <label>Email</label>
            <Input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              placeholder="Enter Email"
            />
          </div>
          <div>
            <label>Password</label>
            <Input
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              placeholder="Enter Password"
            />
          </div>
          {/* Referral Code Search */}
          <div>
            <label>Search Referral Code</label>
            <Input
              type="text"
              value={searchReferralCode}
              onChange={handleReferralCodeSearch}
              placeholder="Search Referral Code"
            />
            {filteredUsers.length > 0 && (
              <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {filteredUsers.map((user) => (
                    <li
                      key={user.id}
                      style={{
                        cursor: "pointer",
                        padding: "5px",
                        backgroundColor: "#f1f1f1",
                        marginBottom: "5px",
                      }}
                      onClick={() => handleSelectUser(user)}
                    >
                     {user.name} {user.email} {user.referralCode}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Referral Code (disabled once a user is selected) */}
          <div>
            <label>Referral Code</label>
            <Input
              type="text"
              value={newUser.referralCode}
              onChange={(e) =>
                setNewUser({ ...newUser, referralCode: e.target.value })
              }
              placeholder="Enter Referral Code"
              disabled={selectedUser !== null}
            />
          </div>
          <div>
            <label>Public Key</label>
            <Input
              type="text"
              value={newUser.publicKey}
              onChange={(e) =>
                setNewUser({ ...newUser, publicKey: e.target.value })
              }
              placeholder="Enter Public Key"
            />
          </div>
          <div>
            <label>Rank</label>
            <Input
              type="number"
              value={newUser.rank}
              onChange={(e) => setNewUser({ ...newUser, rank: e.target.value })}
              placeholder="Enter Rank"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeAddUserModal}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleAddUser}
            disabled={isAddingUser}
          >
            {isAddingUser ? <Spinner size="sm" /> : "Add User"}
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default SupplierDatabase;
