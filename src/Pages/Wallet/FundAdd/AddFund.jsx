import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Input,
  Label,
  FormGroup,
  Button,
  CardBody,
} from "reactstrap";
import Select from "react-select";
import { GetAllUsers } from "../../../Api/Auth";
import { AddFundApi } from "../../../Api/Wallet";
import Swal from "sweetalert2";
import Loader from "../../../Components/Loading/Loading";

const AddFund = () => {
  const [amount, setAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    FetchUsers();
  }, []);

  const FetchUsers = async () => {
    try {
      let res = await GetAllUsers();
      if (res.status) {
        let newdata = res.data.map((item) => ({
          value: item?._id,
          label: `${item?.Name} - ${item?.referralCode || "N/A"}`,
          referralCode: item?.referralCode,
        }));
        setUsers(newdata);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const options = [
    { value: "ADD", label: "ADD FUND" },
    { value: "DEDUCT", label: "DEDUCT FUND" },
  ];

  const filterOption = (inputValue, option) => {
    return (
      inputValue.data.label.includes(option) ||
      inputValue.data.referralCode.includes(option)
    );
  };

  const HandleSubmit = async () => {
    if (!amount) {
      Swal.fire("ERROR!", "Amount is required", "error");
      return;
    } else if (!selectedUser) {
      Swal.fire("ERROR!", "User is required", "error");
      return;
    } else if (!selectedOption) {
      Swal.fire("ERROR!", "Action (Add/Deduct) is required", "error");
      return;
    }

    setLoading(true);
    try {
      let res = await AddFundApi({
        amount: amount,
        UserId: selectedUser.value
      });
      
      if (res.status) {
        Swal.fire("SUCCESS!", "Fund Updated Successfully", "success");
        setAmount("");
        setSelectedUser(null);
        setSelectedOption("");
      } else {
        Swal.fire("ERROR!", res.message, "error");
      }
    } catch (error) {
        Swal.fire("ERROR!", error.message, "error");
    } finally {
        setLoading(false);
    }
};


  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ marginTop: 100 }}
    >
      {loading && <Loader></Loader>}
      <Row className="w-100">
        <Col lg={5} md={7} sm={10} className="mx-auto">
          <Card className="p-4 shadow border-0 rounded-3">
            <CardBody>
              <h3 className="mb-4 text-center text-primary">Add/Deduct Fund</h3>

              {/* Select Add/Deduct */}
              <FormGroup>
                <Label className="fw-bold">Select Add/Deduct</Label>
                <Input
                  type="select"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="p-2 fs-10"
                >
                  <option value="">Choose...</option>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Input>
              </FormGroup>

              {/* Select User */}
              <FormGroup>
                <Label className="fw-bold">
                  Select User (Search by Name or Code)
                </Label>
                <Select
                  options={users}
                  value={selectedUser}
                  onChange={(option) => setSelectedUser(option)}
                  placeholder="Search by name or code..."
                  className="fs-10"
                  filterOption={filterOption}
                  styles={{
                    control: (base) => ({
                      ...base,
                      padding: "10px",
                      borderRadius: "5px",
                      fontSize: "1rem",
                      width: "100%",
                    }),
                  }}
                />
              </FormGroup>

              {/* Amount Input */}
              <FormGroup>
                <Label className="fw-bold">Amount</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="p-2 fs-10"
                />
              </FormGroup>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                onClick={HandleSubmit}
                  color="primary"
                  className="mt-3 w-100 fs-5 py-2 shadow-sm"
                >
                  Submit
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddFund;
