import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  CardBody,
  CardTitle,
  CardText,
} from "reactstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Don't forget to import the skeleton styles
import "./Home.css";
import CommissionChart from "../Charts/Commision";
import MembersChart from "../Charts/Member";
import TransactionChart from "../Charts/Transaction";
import {
  DashboardApi,
  GetCommisionByMonthApi,
  GetMemberByMonthApi,
  GetTransactionByMonthApi,
} from "../../Api/Dashboard";
import MetaMaskApp from "../metamask";

const Home = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalActiveMembers, setTotalActiveMembers] = useState(0);
  const [totalInactiveMembers, setTotalInactiveMembers] = useState(0);
  const [totalpaidamount, setToalPaid] = useState(0);
  const [totaltransfer,setTransfer]=useState(0)
  const [loading, setLoading] = useState(true);
  const [membermonth, setMembermonth] = useState([]);
  const [commisionmonth, setCommisionMonth] = useState([]);
  const [transactionmonth, setTransactionMonth] = useState([]);

  useEffect(() => {
    GetDashboardCount();
    MemberBymonth();
    TransactionBymonth();
    CommisionBymonth();
  }, []);

  const GetDashboardCount = async () => {
    try {
      let res = await DashboardApi();
      if (res.status) {
        setTotalActiveMembers(res?.data?.totalActive || 0);
        setTotalInactiveMembers(res?.data?.totalInactive || 0);
        setTotalMembers(res?.data?.totalMembers || 0);
        setTotalCommission(res?.data?.totalCommision[0]?.totalAmount || 0);
        setTotalAmount(res?.data?.totalTransaction[0]?.totalAmount || 0);
        setToalPaid(res?.data?.totalPaid[0]?.totalAmount || 0);
        setTransfer(res?.data?.totaltransfer[0]?.totalAmount || 0)
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const MemberBymonth = async () => {
    try {
      let res = await GetMemberByMonthApi();
      if (res.status) {
        setMembermonth(res.data);
      } else {
        setMembermonth([]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const TransactionBymonth = async () => {
    try {
      let res = await GetTransactionByMonthApi();
      if (res.status) {
        setTransactionMonth(res.data);
      } else {
        setTransactionMonth([]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const CommisionBymonth = async () => {
    try {
      let res = await GetCommisionByMonthApi();
      if (res.status) {
        setCommisionMonth(res.data);
      } else {
        setCommisionMonth([]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="mt-4 mt-sm-2 mt-md-4" fluid style={{ width: "95%" }}>
      <MetaMaskApp></MetaMaskApp>
      <Row className="mt-4">
        <Col md={4}>
          <Card className="info-card mt-2 mt-sm-3 mt-md-4">
            <CardBody>
              <CardTitle>Total Transaction</CardTitle>
              {loading ? (
                <Skeleton height={20} width="60%" />
              ) : (
                <CardText>{totalAmount}</CardText>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="info-card mt-2 mt-sm-3 mt-md-4">
            <CardBody>
              <CardTitle>Total Commission</CardTitle>
              {loading ? (
                <Skeleton height={20} width="60%" />
              ) : (
                <CardText>{totalCommission}</CardText>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="info-card mt-2 mt-sm-3 mt-md-4">
            <CardBody>
              <CardTitle>Total Due Amount</CardTitle>
              {loading ? (
                <Skeleton height={20} width="60%" />
              ) : (
                <CardText>{totalpaidamount?.toFixed(2)}</CardText>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4}>
          <Card className="info-card mt-2 mt-sm-3 mt-md-4">
            <CardBody>
              <CardTitle>Total Paid Amount</CardTitle>
              {loading ? (
                <Skeleton height={20} width="60%" />
              ) : (
                <CardText>{totaltransfer?.toFixed(2)}</CardText>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="info-card mt-2 mt-sm-3 mt-md-4">
            <CardBody>
              <CardTitle>Total Members</CardTitle>
              {loading ? (
                <Skeleton height={20} width="60%" />
              ) : (
                <CardText>{totalMembers}</CardText>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="info-card mt-2 mt-sm-3 mt-md-4">
            <CardBody>
              <CardTitle>Total Active Members</CardTitle>
              {loading ? (
                <Skeleton height={20} width="60%" />
              ) : (
                <CardText>{totalActiveMembers}</CardText>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={6}>
          <Card>
            {loading ? (
              <Skeleton height={300} />
            ) : (
              <CommissionChart data={commisionmonth} />
            )}
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            {loading ? (
              <Skeleton height={300} />
            ) : (
              <MembersChart data={membermonth} />
            )}
          </Card>
        </Col>

        <Col md={12} className="mt-5" style={{ marginBottom: 80 }}>
          <Card>
            {loading ? (
              <Skeleton height={300} />
            ) : (
              <TransactionChart data={transactionmonth} />
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
