import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Button,
    Form,
    Input,
    Label,
} from "reactstrap";
import avatar from "../Assests/avatar.png";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { ChangepasswordApi } from "../Api/Auth";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loading/Loading";

const Profile = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    let res = Cookies.get("data")
    res = JSON.parse(res)




    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!oldPassword) {
            Swal.fire({
                title: "Error!",
                text: "Old Password is Required",
                icon: "error",
            });
            return
        } else if (!newPassword) {
            Swal.fire({
                title: "Error!",
                text: "New Password is Required",
                icon: "error",
            });
            return
        } else if (newPassword !== confirmPassword) {
            Swal.fire({
                title: "Error!",
                text: "Passwords do not match",
                icon: "error",
            });
            return
        }
        setLoading(true)

        let res = await ChangepasswordApi({
            "oldpassword": oldPassword,
            "newpassword": newPassword
        })

        if (res.status) {
            setLoading(false)
            Swal.fire({
                title: "Success!",
                text: "Passwords Changes Successfully",
                icon: "success",
            });

            Cookies.remove("token")
            Cookies.remove("data")
            navigate('/login')
        } else {
            setLoading(false)
            Swal.fire({
                title: "Error!",
                text: res.message,
                icon: "error",
            });
        }

    };

    return (
        <React.Fragment>
            {
                loading && <Loader></Loader>
            }
            <Container fluid className="mt-4">
                <Row>
                    <Col lg="12">
                        <Card>
                            <CardBody>
                                <div className="d-flex">
                                    <div className="ms-3">
                                        <img
                                            style={{ height: 100, width: 100 }}
                                            src={avatar}
                                            alt=""
                                            className="avatar-md rounded-circle img-thumbnail"
                                        />
                                    </div>
                                    <div className="flex-grow-1 align-self-center ms-3">
                                        <div className="text-muted">
                                            <h5>{res?.Name}</h5>
                                            <p className="mb-1">{res?.Email}</p>

                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <h4 className="card-title mt-4 text-center">CHANGE USER PASSWORD</h4>

                <Card className="mt-3">
                    <CardBody>
                        <Form className="form-horizontal" onSubmit={handleSubmit}>
                            {/* Current Password */}
                            <div className="form-group">
                                <Label className="form-label">CURRENT PASSWORD</Label>
                                <Input
                                    name="oldpassword"
                                    className="form-control"
                                    placeholder="PLEASE ENTER CURRENT PASSWORD"
                                    type="text"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>

                            {/* New Password */}
                            <div className="form-group mt-2">
                                <Label className="form-label">NEW PASSWORD</Label>
                                <Input
                                    name="newpassword"
                                    className="form-control"
                                    placeholder="PLEASE ENTER NEW PASSWORD"
                                    type="text"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group mt-2">
                                <Label className="form-label">CONFIRM PASSWORD</Label>
                                <Input
                                    name="conformpassword"
                                    className="form-control"
                                    placeholder="PLEASE ENTER CONFIRM PASSWORD"
                                    type="text"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="text-center mt-4">
                                <Button type="submit" color="danger">
                                    UPDATE PASSWORD
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default Profile;
