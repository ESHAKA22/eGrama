import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Button, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import { 
  FaUser, FaEnvelope, FaIdCard, FaPhone, FaBirthdayCake, 
  FaVenusMars, FaGlobe, FaHome, FaFileAlt, FaDownload, 
  FaSignOutAlt, FaInfoCircle, FaExclamationTriangle, 
  FaCheckCircle, FaTimesCircle, FaRedo, FaPrint, FaEye 
} from 'react-icons/fa';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';

const CertificateTemplate = ({ user }) => {
  return (
    <div style={{
      fontFamily: "'Garamond', 'Times New Roman', serif",
      width: '210mm',
      minHeight: '297mm',
      margin: '0 auto',
      padding: '40px',
      backgroundColor: '#fff',
      border: '3px double #333',
      boxShadow: '0 0 20px rgba(0,0,0,0.15)',
      position: 'relative',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M50 50 L60 60 L50 70 L40 60 Z\' fill=\'%23f0f0f0\' transform=\'scale(2)\' opacity=\'0.3\'/%3E%3C/svg%3E")',
      backgroundRepeat: 'repeat',
    }}>
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        width: '120px', 
        height: '120px', 
        border: '1px dashed #999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '12px'
      }}>
        Official Seal
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '30px', 
          fontWeight: 'bold', 
          marginBottom: '15px',
          color: '#1a3c64',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          borderBottom: '2px solid #1a3c64',
          paddingBottom: '10px',
        }}>
          OFFICIAL CHARACTER CERTIFICATE
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#666',
          fontStyle: 'italic',
          letterSpacing: '1px',
        }}>Issued by the Village Management System</p>
      </div>

      <div style={{ margin: '30px 0', lineHeight: '1.8' }}>
        <p style={{ 
          textAlign: 'justify', 
          textIndent: '50px',
          fontSize: '16px',
        }}>
          This is to certify that <strong style={{ color: '#1a3c64' }}>{user.firstName} {user.lastName}</strong>, 
          holder of National Identification Card No. <strong style={{ color: '#1a3c64' }}>{user.identificationNumber}</strong>, 
          residing at <strong style={{ color: '#1a3c64' }}>{user.villageAddress}</strong>, is a bonafide resident of our village 
          and is known to be a respectable and law-abiding citizen.
        </p>

        <div style={{ 
          margin: '30px 0 30px 50px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          backgroundColor: 'rgba(250, 250, 250, 0.7)',
        }}>
          <p style={{ margin: '10px 0' }}>
            <strong style={{ width: '200px', display: 'inline-block', color: '#555' }}>Date of Birth:</strong> 
            <span style={{ color: '#333' }}>{new Date(user.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
          <p style={{ margin: '10px 0' }}>
            <strong style={{ width: '200px', display: 'inline-block', color: '#555' }}>Marital Status:</strong> 
            <span style={{ color: '#333' }}>{user.maritalStatus}</span>
          </p>
          <p style={{ margin: '10px 0' }}>
            <strong style={{ width: '200px', display: 'inline-block', color: '#555' }}>Community Participation:</strong> 
            <span style={{ color: '#333' }}>{user.behavior?.villageContribution || "Active and cooperative"}</span>
          </p>
          <p style={{ margin: '10px 0' }}>
            <strong style={{ width: '200px', display: 'inline-block', color: '#555' }}>Living Conditions:</strong> 
            <span style={{ color: '#333' }}>{user.behavior?.livingConditions || "Satisfactory"}</span>
          </p>
          <p style={{ margin: '10px 0' }}>
            <strong style={{ width: '200px', display: 'inline-block', color: '#555' }}>Criminal Record:</strong> 
            <span style={{ color: user.criminalRecord?.hasRecord ? '#d32f2f' : '#2e7d32' }}>{user.criminalRecord?.hasRecord ? "Yes" : "No"}</span>
          </p>
          {user.criminalRecord?.hasRecord && (
            <p style={{ margin: '10px 0 10px 200px', color: '#666' }}>
              <strong>Details:</strong> {user.criminalRecord.details || "N/A"}
            </p>
          )}
        </div>

        <p style={{ 
          textAlign: 'justify', 
          textIndent: '50px',
          fontSize: '16px',
        }}>
          This certificate is issued upon request for official purposes and confirms that the above-named 
          individual has maintained good standing within our community during their period of residence.
        </p>
      </div>

      <div style={{ marginTop: '60px' }}>
        <div style={{ 
          float: 'right', 
          textAlign: 'center', 
          width: '300px',
        }}>
          <div style={{ 
            borderTop: '1px solid #333', 
            width: '200px', 
            margin: '0 auto', 
            paddingTop: '10px',
          }}>
            <strong style={{ fontSize: '16px' }}>Gramaniladhari Officer</strong><br />
            <span style={{ fontSize: '14px', color: '#555' }}>Village Management System</span>
          </div>
        </div>

        <div style={{ clear: 'both' }}></div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          padding: '15px', 
          border: '1px solid #eee',
          borderRadius: '5px',
          backgroundColor: 'rgba(245, 245, 245, 0.7)',
        }}>
          <p style={{ fontStyle: 'italic', color: '#666', margin: '0' }}>
            Issued on: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px', 
          fontSize: '12px', 
          color: '#777',
          borderTop: '1px dashed #ccc',
          paddingTop: '15px',
        }}>
          <p style={{ margin: '5px 0' }}>Certificate ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          <p style={{ margin: '5px 0' }}>This document is valid only with the official seal and signature</p>
          <p style={{ fontSize: '10px', marginTop: '15px', color: '#999' }}>
            Verify authenticity at: www.villagemanagement.gov/verify
          </p>
        </div>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [requestReason, setRequestReason] = useState("");
  const navigate = useNavigate();
  const certificateRef = useRef();

  useEffect(() => {
    if (user?.token) {
      fetchUserDetails();
    }
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUserDetails(response.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setStatusMessage("Unable to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintCertificate = useReactToPrint({
    content: () => certificateRef.current,
    pageStyle: `
      @page { size: A4; margin: 0; }
      @media print { 
        body { -webkit-print-color-adjust: exact; } 
      }
    `,
  });

  const handleRequestCertificate = async () => {
    try {
      const response = await api.post(
        "/users/request-certificate",
        {
          requestReason,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setUserDetails((prev) => ({
        ...prev,
        certificateRequested: true,
        certificateApproved: null,
        certificateRequestedAt: new Date().toISOString(),
        requestReason: requestReason,
      }));

      setStatusMessage("Certificate request submitted successfully!");
      setShowRequestModal(false);
      setRequestReason("");

      navigate("/admin", {
        state: {
          notificationType:
            userDetails?.certificateApproved === false
              ? "Reapplied"
              : "New Request",
          userName: `${userDetails.firstName} ${userDetails.lastName}`,
        },
      });
    } catch (err) {
      const message =
        err.response?.data?.message || "Error submitting certificate request.";
      setStatusMessage(message);
    }
  };

  const handleCancelRequest = async () => {
    try {
      await api.post(
        "/users/cancel-certificate-request",
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setUserDetails((prev) => ({
        ...prev,
        certificateRequested: false,
        certificateApproved: null,
        certificateRequestedAt: new Date().toISOString(),
      }));

      setStatusMessage("Certificate request cancelled.");
      navigate("/admin", {
        state: {
          notificationType: "Canceled",
          userName: `${userDetails.firstName} ${userDetails.lastName}`,
        },
      });
    } catch (err) {
      console.error("Cancel failed:", err);
      setStatusMessage("Error cancelling certificate request.");
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const response = await api.get(`/admin/certificate/${userDetails._id}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CharacterCertificate_${userDetails.firstName}_${userDetails.lastName}.pdf`;
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading certificate:", error);
      setStatusMessage("Error downloading certificate.");
    }
  };

  const canReapply = () => {
    if (
      !userDetails?.certificateRequested &&
      userDetails?.certificateApproved === false &&
      userDetails?.certificateRequestedAt
    ) {
      const lastRequest = moment(userDetails.certificateRequestedAt);
      const now = moment();
      return now.diff(lastRequest, "days") >= 7;
    }
    return true;
  };

  const renderStatus = () => {
    if (
      userDetails?.certificateRequested &&
      userDetails?.certificateApproved === null
    ) {
      return (
        <Badge
          bg="warning"
          className="ms-2"
          style={{ fontSize: "12px", padding: "6px 10px" }}
        >
          <FaInfoCircle className="me-1" /> Pending Approval
        </Badge>
      );
    }
    if (userDetails?.certificateApproved === true) {
      return (
        <Badge
          bg="success"
          className="ms-2"
          style={{ fontSize: "12px", padding: "6px 10px" }}
        >
          <FaCheckCircle className="me-1" /> Approved
        </Badge>
      );
    }
    if (
      userDetails?.certificateApproved === false &&
      userDetails?.certificateRequested
    ) {
      return (
        <Badge
          bg="warning"
          className="ms-2"
          style={{ fontSize: "12px", padding: "6px 10px" }}
        >
          <FaInfoCircle className="me-1" /> Pending Approval
        </Badge>
      );
    }
    if (userDetails?.certificateApproved === false) {
      return (
        <Badge
          bg="danger"
          className="ms-2"
          style={{ fontSize: "12px", padding: "6px 10px" }}
        >
          <FaTimesCircle className="me-1" /> Rejected
        </Badge>
      );
    }
    return (
      <Badge
        bg="secondary"
        className="ms-2"
        style={{ fontSize: "12px", padding: "6px 10px" }}
      >
        Not Requested
      </Badge>
    );
  };

  const renderRequestDate = () => {
    if (!userDetails?.certificateRequestedAt) return null;

    return (
      <div className="mb-3">
        <p
          className="text-muted small mb-1"
          style={{ fontSize: "13px", fontWeight: "500" }}
        >
          <strong>Requested:</strong>{" "}
          {moment(userDetails.certificateRequestedAt).format(
            "DD/MM/YYYY hh:mm A"
          )}
        </p>
        {userDetails.certificateApproved === false &&
          userDetails.rejectionReason && (
            <div
              style={{
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                border: "1px solid rgba(244, 67, 54, 0.3)",
                borderRadius: "6px",
                padding: "12px 16px",
                marginTop: "10px",
                fontSize: "13px",
                color: "#d32f2f",
                fontWeight: "500",
              }}
            >
              <FaExclamationTriangle className="me-2" />
              <strong>Rejection Reason:</strong> {userDetails.rejectionReason}
            </div>
          )}
        {userDetails.requestReason && (
          <div
            style={{
              backgroundColor: "rgba(3, 169, 244, 0.1)",
              border: "1px solid rgba(3, 169, 244, 0.3)",
              borderRadius: "6px",
              padding: "12px 16px",
              marginTop: "10px",
              fontSize: "13px",
              color: "#0277bd",
              fontWeight: "500",
            }}
          >
            <FaInfoCircle className="me-2" />
            <strong>Your Request Reason:</strong> {userDetails.requestReason}
          </div>
        )}
      </div>
    );
  };

  const renderActions = () => {
    const { certificateRequested, certificateApproved } = userDetails;
    const canReapplyNow = canReapply();

    if (!certificateRequested) {
      if (certificateApproved === false && !canReapplyNow) {
        const reapplyDate = moment(userDetails.certificateRequestedAt).add(
          7,
          "days"
        );
        return (
          <div
            style={{
              backgroundColor: "rgba(255, 152, 0, 0.1)",
              border: "1px solid rgba(255, 152, 0, 0.3)",
              borderRadius: "6px",
              padding: "15px",
              marginTop: "15px",
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              color: "#e65100",
              fontWeight: "500",
            }}
          >
            <FaExclamationTriangle
              className="me-2"
              style={{ fontSize: "16px" }}
            />
            You can reapply after {reapplyDate.format("DD/MM/YYYY")} (7 days
            cooldown period)
          </div>
        );
      }

      return (
        <div className="d-flex flex-column gap-2 mt-3">
          <Button
            onClick={() => setShowRequestModal(true)}
            variant="primary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 20px",
              borderRadius: "6px",
              fontWeight: "600",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#1976d2",
              border: "none",
              transition: "all 0.2s ease",
            }}
          >
            <FaFileAlt className="me-2" />
            {certificateApproved === false
              ? "Reapply for Certificate"
              : "Request Certificate"}
          </Button>
        </div>
      );
    }

    if (certificateRequested && certificateApproved === null) {
      return (
        <div className="d-flex flex-column gap-2 mt-3">
          <div
            style={{
              backgroundColor: "rgba(3, 169, 244, 0.1)",
              border: "1px solid rgba(3, 169, 244, 0.3)",
              borderRadius: "6px",
              padding: "15px",
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              color: "#0277bd",
              fontWeight: "500",
            }}
          >
            <FaInfoCircle className="me-2" style={{ fontSize: "16px" }} />
            Your request is pending approval
          </div>
          <div className="d-flex gap-2 mt-3">
            <Button
              variant="outline-danger"
              onClick={handleCancelRequest}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                borderRadius: "6px",
                fontWeight: "500",
                color: "#d32f2f",
                borderColor: "#d32f2f",
              }}
            >
              <FaTimesCircle className="me-2" />
              Cancel Request
            </Button>
            <Button
              disabled
              variant="outline-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                borderRadius: "6px",
                fontWeight: "500",
                opacity: "0.6",
              }}
            >
              <FaDownload className="me-2" />
              Download (Pending)
            </Button>
          </div>
        </div>
      );
    }

    if (certificateApproved === true) {
      return (
        <div className="d-flex flex-column gap-2 mt-3">
          <div
            style={{
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              border: "1px solid rgba(76, 175, 80, 0.3)",
              borderRadius: "6px",
              padding: "15px",
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              color: "#2e7d32",
              fontWeight: "500",
            }}
          >
            <FaCheckCircle className="me-2" style={{ fontSize: "16px" }} />
            Your certificate has been approved!
          </div>
          <div className="d-flex gap-2 mt-3">
            <Button
              variant="success"
              onClick={() => setShowCertificateModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                borderRadius: "6px",
                fontWeight: "600",
                backgroundColor: "#2e7d32",
                border: "none",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <FaEye className="me-2" />
              View Certificate
            </Button>
            <Button
              variant="primary"
              onClick={handleDownloadCertificate}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                borderRadius: "6px",
                fontWeight: "600",
                backgroundColor: "#1976d2",
                border: "none",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <FaDownload className="me-2" />
              Download PDF
            </Button>
          </div>
        </div>
      );
    }

    if (certificateApproved === false) {
      return (
        <div className="d-flex flex-column gap-2 mt-3">
          <div
            style={{
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              border: "1px solid rgba(244, 67, 54, 0.3)",
              borderRadius: "6px",
              padding: "15px",
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              color: "#d32f2f",
              fontWeight: "500",
            }}
          >
            <FaTimesCircle className="me-2" style={{ fontSize: "16px" }} />
            Your request was rejected
          </div>
          <div className="d-flex gap-2 mt-3">
            <Button
              variant="outline-danger"
              onClick={handleCancelRequest}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                borderRadius: "6px",
                fontWeight: "500",
                color: "#d32f2f",
                borderColor: "#d32f2f",
              }}
            >
              <FaTimesCircle className="me-2" />
              Cancel Request
            </Button>
            {canReapply() && (
              <Button
                variant="primary"
                onClick={() => setShowRequestModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  backgroundColor: "#1976d2",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <FaRedo className="me-2" />
                Reapply for Certificate
              </Button>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* Certificate Preview Modal */}
      <Modal
        show={showCertificateModal}
        onHide={() => setShowCertificateModal(false)}
        size="xl"
        fullscreen="lg-down"
        style={{ zIndex: 1050 }}
      >
        <Modal.Header
          closeButton
          style={{
            borderBottom: "none",
            padding: "20px 24px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <Modal.Title
            style={{ fontSize: "20px", fontWeight: "600", color: "#1a3c64" }}
          >
            Certificate Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            overflowY: "auto",
            padding: "0 24px 20px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div
            ref={certificateRef}
            style={{
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <CertificateTemplate user={userDetails} />
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{
            borderTop: "none",
            padding: "0 24px 24px",
            backgroundColor: "#f8f9fa",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button
            variant="secondary"
            onClick={() => setShowCertificateModal(false)}
            style={{
              borderRadius: "6px",
              padding: "8px 16px",
              fontWeight: "500",
              backgroundColor: "#6c757d",
              border: "none",
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handlePrintCertificate}
            style={{
              borderRadius: "6px",
              padding: "8px 16px",
              fontWeight: "500",
              backgroundColor: "#1976d2",
              border: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaPrint className="me-2" />
            Print Certificate
          </Button>
          <Button
            variant="success"
            onClick={handleDownloadCertificate}
            style={{
              borderRadius: "6px",
              padding: "8px 16px",
              fontWeight: "500",
              backgroundColor: "#2e7d32",
              border: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaDownload className="me-2" />
            Download PDF
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Request Certificate Modal */}
      <Modal
        show={showRequestModal}
        onHide={() => setShowRequestModal(false)}
        centered
        style={{ zIndex: 1050 }}
      >
        <Modal.Header
          closeButton
          className="border-0"
          style={{
            padding: "24px 24px 0",
          }}
        >
          <Modal.Title
            style={{
              fontWeight: "600",
              fontSize: "20px",
              color: "#1a3c64",
            }}
          >
            {userDetails?.certificateApproved === false ? (
              <>
                <FaRedo className="me-2" style={{ color: "#1976d2" }} />
                Reapply for Certificate
              </>
            ) : (
              <>
                <FaFileAlt className="me-2" style={{ color: "#1976d2" }} />
                Request Certificate
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            padding: "20px 24px",
          }}
        >
          <div className="mb-3">
            <label
              htmlFor="requestReason"
              style={{
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
                fontSize: "15px",
                color: "#444",
              }}
            >
              Reason for request (optional):
            </label>
            <textarea
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "6px",
                border: "1px solid #ced4da",
                fontSize: "15px",
                minHeight: "120px",
                resize: "vertical",
                transition: "border-color 0.15s ease-in-out",
                outline: "none",
              }}
              id="requestReason"
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder="Explain why you need this certificate..."
            />
          </div>
        </Modal.Body>
        <Modal.Footer
          className="border-0"
          style={{
            padding: "0 24px 24px",
            display: "flex",
            gap: "12px",
          }}
        >
          <Button
            variant="light"
            onClick={() => setShowRequestModal(false)}
            style={{
              borderRadius: "6px",
              padding: "10px 16px",
              fontWeight: "500",
              backgroundColor: "#f8f9fa",
              border: "1px solid #ddd",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRequestCertificate}
            style={{
              borderRadius: "6px",
              padding: "10px 16px",
              fontWeight: "600",
              backgroundColor: "#1976d2",
              border: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Submit Request
          </Button>
        </Modal.Footer>
      </Modal>

      <div
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          backgroundColor: "#fff",
          border: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "#1976d2",
            padding: "20px 24px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              margin: "0",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaUser style={{ marginRight: "10px" }} />
            User Profile
          </h2>
        </div>

        <div style={{ padding: "0" }}>
          {statusMessage && (
            <div
              style={{
                backgroundColor: statusMessage.includes("success")
                  ? "rgba(76, 175, 80, 0.1)"
                  : "rgba(244, 67, 54, 0.1)",
                border: statusMessage.includes("success")
                  ? "1px solid rgba(76, 175, 80, 0.3)"
                  : "1px solid rgba(244, 67, 54, 0.3)",
                borderRadius: "6px",
                padding: "15px",
                margin: "20px 24px 0",
                fontSize: "14px",
                color: statusMessage.includes("success")
                  ? "#2e7d32"
                  : "#d32f2f",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
              }}
            >
              {statusMessage.includes("success") ? (
                <FaCheckCircle className="me-2" />
              ) : (
                <FaExclamationTriangle className="me-2" />
              )}
              {statusMessage}
            </div>
          )}

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3" style={{ color: "#666" }}>
                Loading profile information...
              </p>
            </div>
          ) : userDetails ? (
            <div style={{ padding: "24px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    padding: "20px",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "20px",
                      color: "#1a3c64",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaIdCard className="me-2" />
                    Personal Information
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: "24px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        <FaUser className="me-2" style={{ color: "#1976d2" }} />
                        Full Name
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: "500" }}>
                        {userDetails.firstName} {userDetails.lastName}
                      </p>
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        <FaEnvelope
                          className="me-2"
                          style={{ color: "#1976d2" }}
                        />
                        Email
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: "500" }}>
                        {userDetails.email}
                      </p>
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        <FaPhone
                          className="me-2"
                          style={{ color: "#1976d2" }}
                        />
                        Phone
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: "500" }}>
                        {userDetails.phone || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        <FaIdCard
                          className="me-2"
                          style={{ color: "#1976d2" }}
                        />
                        ID Number
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: "500" }}>
                        {userDetails.identificationNumber || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        <FaBirthdayCake
                          className="me-2"
                          style={{ color: "#1976d2" }}
                        />
                        Date of Birth
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: "500" }}>
                        {userDetails.dateOfBirth
                          ? new Date(
                              userDetails.dateOfBirth
                            ).toLocaleDateString()
                          : "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        <FaVenusMars
                          className="me-2"
                          style={{ color: "#1976d2" }}
                        />
                        Gender
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: "500" }}>
                        {userDetails.gender || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "20px",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "20px",
                      color: "#1a3c64",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaHome className="me-2" />
                    Residence Information
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: "24px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        <FaGlobe
                          className="me-2"
                          style={{ color: "#1976d2" }}
                        />
                        Village
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: "500" }}>
                        {userDetails.villageName || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        <FaHome className="me-2" style={{ color: "#1976d2" }} />
                        Address
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: "500" }}>
                        {userDetails.villageAddress || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        <FaInfoCircle
                          className="me-2"
                          style={{ color: "#1976d2" }}
                        />
                        Residence Status
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: "500" }}>
                        {userDetails.residenceStatus || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "20px",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "5px",
                      color: "#1a3c64",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaFileAlt className="me-2" />
                    Character Certificate Status
                    {renderStatus()}
                  </h3>

                  {renderRequestDate()}
                  {renderActions()}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ color: "#666" }}>
                Unable to load profile information. Please try again later.
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px 24px",
            borderTop: "1px solid #dee2e6",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outline-danger"
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: "6px",
              fontWeight: "500",
              color: "#d32f2f",
              borderColor: "#d32f2f",
            }}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;