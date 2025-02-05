import React from "react";
import { Card, Col, Container, Row } from "reactstrap";
import { FaBell } from "react-icons/fa"; // Example icon
import "./Home.css"

const Home = () => {
  return (
    <Container className="mt-4" fluid style={{width:"95%"}}>
      <Row>
        {/* Left Column */}
        <Col md={8}>
          <Card className="skeleton-card">
            <div className="skeleton-content" style={{ height: "200px" }}></div>
            <div className="skeleton-content" style={{ height: "40px" }}></div>
            <div className="skeleton-content" style={{ height: "40px" }}></div>
          </Card>
        </Col>

        {/* Right Column */}
        <Col md={4}>
          <Card className="skeleton-card">
            <div className="skeleton-content" style={{ height: "200px" }}></div>
            <div className="skeleton-content" style={{ height: "40px" }}></div>
            <div className="skeleton-content" style={{ height: "40px" }}></div>
          </Card>
        </Col>
      </Row>

      {/* Additional Row for other sections */}
      <Row className="mt-4" classNamemt="4">
        <Col md={4}>
          <Card className="skeleton-card">
            <div className="skeleton-content" style={{ height: "100px" }}></div>
            <div className="skeleton-content" style={{ height: "30px" }}></div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="skeleton-card">
            <div className="skeleton-content" style={{ height: "100px" }}></div>
            <div className="skeleton-content" style={{ height: "30px" }}></div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="skeleton-card">
            <div className="skeleton-content" style={{ height: "100px" }}></div>
            <div className="skeleton-content" style={{ height: "30px" }}></div>
          </Card>
        </Col>
        
      </Row>

      <Row  className="mt-4">
        {/* Left Column */}
        <Col md={8}>
          <Card className="skeleton-card">
            <div className="skeleton-content" style={{ height: "200px" }}></div>
            <div className="skeleton-content" style={{ height: "40px" }}></div>
            <div className="skeleton-content" style={{ height: "40px" }}></div>
          </Card>
        </Col>

        {/* Right Column */}
        <Col md={4}>
          <Card className="skeleton-card">
            <div className="skeleton-content" style={{ height: "200px" }}></div>
            <div className="skeleton-content" style={{ height: "40px" }}></div>
            <div className="skeleton-content" style={{ height: "40px" }}></div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
