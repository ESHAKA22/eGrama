import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
} from "react-bootstrap";
import {
  FaUser,
  FaFileAlt,
  FaHospital,
  FaComments,
  FaArrowRight,
  FaBell,
} from "react-icons/fa";

const EgramaHomepage = () => {
  return (
    <div className="egrama-app">
      {/* Navbar */}
      

      {/* Hero Section */}
      <div
        className="hero-section py-5"
        style={{
          background: "linear-gradient(135deg, #6610f2 0%, #7952b3 100%)",
          color: "white",
        }}
      >
        <Container className="text-center py-5">
          <h1 className="display-4 fw-bold mb-3">
            Your One-Stop Digital Village Services Platform
          </h1>
          <p className="lead mb-5">
            Access government services, apply for loans, manage your profile,
            and connect with healthcare facilities - all in one place.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="light" size="lg" className="px-4">
              Register Now
            </Button>
            <Button variant="outline-light" size="lg" className="px-4">
              Learn More
            </Button>
          </div>
        </Container>
      </div>

      {/* Services Section */}
      <Container className="my-5">
        <h2 className="text-center fw-bold mb-5">Our Services</h2>
        <Row className="g-4">
          {/* Profile Management */}
          <Col md={6} lg={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div
                  className="icon-circle mb-3 mx-auto"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "#f0e7fe",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FaUser size={24} color="#6610f2" />
                </div>
                <Card.Title className="fw-bold">Profile Management</Card.Title>
                <Card.Text className="text-muted">
                  Update your personal information, documents, and manage your
                  digital identity.
                </Card.Text>
                <Button
                  variant="link"
                  className="text-decoration-none text-primary mt-2"
                  style={{ color: "#6610f2" }}
                >
                  Access Profile <FaArrowRight size={12} className="ms-1" />
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Loan Applications */}
          <Col md={6} lg={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div
                  className="icon-circle mb-3 mx-auto"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "#f0e7fe",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FaFileAlt size={24} color="#6610f2" />
                </div>
                <Card.Title className="fw-bold">Loan Applications</Card.Title>
                <Card.Text className="text-muted">
                  Apply for various government and private loans with simplified
                  procedures.
                </Card.Text>
                <Button
                  variant="link"
                  className="text-decoration-none text-primary mt-2"
                  style={{ color: "#6610f2" }}
                >
                  Explore Loans <FaArrowRight size={12} className="ms-1" />
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Hospital Services */}
          <Col md={6} lg={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div
                  className="icon-circle mb-3 mx-auto"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "#f0e7fe",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FaHospital size={24} color="#6610f2" />
                </div>
                <Card.Title className="fw-bold">Hospital Services</Card.Title>
                <Card.Text className="text-muted">
                  Book appointments, access medical records, and find out more
                  information about healthcare facilities.
                </Card.Text>
                <Button
                  variant="link"
                  className="text-decoration-none text-primary mt-2"
                  style={{ color: "#6610f2" }}
                >
                  Healthcare Portal <FaArrowRight size={12} className="ms-1" />
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Chats */}
          <Col md={6} lg={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div
                  className="icon-circle mb-3 mx-auto"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "#f0e7fe",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FaComments size={24} color="#6610f2" />
                </div>
                <Card.Title className="fw-bold">Chats</Card.Title>
                <Card.Text className="text-muted">
                  Chat with GN officer or your friends and family to get the
                  latest updates and information.
                </Card.Text>
                <Button
                  variant="link"
                  className="text-decoration-none text-primary mt-2"
                  style={{ color: "#6610f2" }}
                >
                  E-connect <FaArrowRight size={12} className="ms-1" />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Features Section */}
      <div className="py-5 mt-4" style={{ backgroundColor: "#f8f9fa" }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h2 className="fw-bold mb-4">Why Choose e-Grama?</h2>
              <div className="d-flex mb-4">
                <div className="flex-shrink-0" style={{ color: "#6610f2" }}>
                  <div
                    className="rounded-circle bg-white shadow-sm p-3 d-inline-flex justify-content-center align-items-center"
                    style={{ width: 50, height: 50 }}
                  >
                    <span className="fw-bold">1</span>
                  </div>
                </div>
                <div className="ms-4">
                  <h5 className="fw-bold">Simplified Processes</h5>
                  <p className="text-muted">
                    Complete government procedures online without multiple
                    visits to offices.
                  </p>
                </div>
              </div>
              <div className="d-flex mb-4">
                <div className="flex-shrink-0" style={{ color: "#6610f2" }}>
                  <div
                    className="rounded-circle bg-white shadow-sm p-3 d-inline-flex justify-content-center align-items-center"
                    style={{ width: 50, height: 50 }}
                  >
                    <span className="fw-bold">2</span>
                  </div>
                </div>
                <div className="ms-4">
                  <h5 className="fw-bold">Secure Management</h5>
                  <p className="text-muted">
                    Your data is encrypted and securely stored with the highest
                    privacy standards.
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div className="flex-shrink-0" style={{ color: "#6610f2" }}>
                  <div
                    className="rounded-circle bg-white shadow-sm p-3 d-inline-flex justify-content-center align-items-center"
                    style={{ width: 50, height: 50 }}
                  >
                    <span className="fw-bold">3</span>
                  </div>
                </div>
                <div className="ms-4">
                  <h5 className="fw-bold">24/7 Availability</h5>
                  <p className="text-muted">
                    Access services anytime, anywhere - no more waiting in long
                    queues.
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <img
                src="src/assets/images/egrama.png"
                alt="e-Grama features"
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action */}
      <div
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #6610f2 0%, #7952b3 100%)",
          color: "white",
        }}
      >
        <Container className="text-center py-4">
          <h2 className="fw-bold mb-4">Ready to Get Started?</h2>
          <p className="lead mb-4">
            Join thousands of citizens who are already enjoying the benefits of
            e-Grama services.
          </p>
          <Button
            variant="light"
            size="lg"
            className="px-5 py-3 fw-bold"
            style={{ borderRadius: "30px" }}
          >
            Register Now
          </Button>
        </Container>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <Container>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="logo-box me-2"
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#6610f2",
                    borderRadius: 8,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    e
                  </span>
                </div>
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                  }}
                >
                  e-Grama System
                </span>
              </div>
              <p className="text-muted">
                Your one-stop solution for all digital village services and
                government procedures.
              </p>
            </Col>
            <Col md={2} className="mb-4 mb-md-0">
              <h5 className="mb-4">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Home
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    About Us
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Services
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Contact
                  </a>
                </li>
              </ul>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <h5 className="mb-4">Services</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Profile Management
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Loan Applications
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Hospital Services
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Government Forms
                  </a>
                </li>
              </ul>
            </Col>
            <Col md={3}>
              <h5 className="mb-4">Contact Us</h5>
              <p className="text-muted mb-2">Email: support@egrama.gov</p>
              <p className="text-muted mb-2">Phone: +94 11 2345678</p>
              <p className="text-muted">Hotline: 1919</p>
            </Col>
          </Row>
          <hr className="my-4" />
          <div className="text-center text-muted">
            <small>&copy; 2025 e-Grama System. All rights reserved.</small>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default EgramaHomepage;
