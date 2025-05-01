import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Modal, Button, Badge, Alert, Spinner, Toast, ToastContainer, Form, InputGroup } from 'react-bootstrap';
import moment from 'moment';
import RegistrationForm from './RegistrationForm';
import EditUserForm from './EditUserForm';
import { FaEye, FaTrashAlt, FaEdit, FaCheck, FaTimes, FaPlus, FaSearch, FaUserShield, 
         FaFileAlt, FaDownload, FaFilter, FaBell, FaThList } from 'react-icons/fa';
import { BsClockHistory, BsArrowRepeat, BsFilterSquare } from 'react-icons/bs';
import { CSVLink } from 'react-csv';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentRejectUserId, setCurrentRejectUserId] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserSuccess, setNewUserSuccess] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // Data fetching
  useEffect(() => {
    fetchUsers();
  }, []);

  // Notification handling
  useEffect(() => {
    if (location.state?.notificationType && location.state?.userName) {
      const notif = {
        type: location.state.notificationType,
        userName: location.state.userName,
        userId: location.state.userId,
        timestamp: new Date(),
      };
      setNotification(notif);
      setShowToast(true);

      // Clear the state after using it
      navigate(location.pathname, { replace: true, state: {} });

      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // User actions
  const handleEditUser = (userId) => {
    const user = users.find((user) => user._id === userId);
    setUserToEdit(user);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    fetchUsers();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewUser = (userId) => {
    const user = users.find((u) => u._id === userId);
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleApprove = async (userId) => {
    try {
      await api.post(`/admin/approve/${userId}`, { status: true });
      fetchUsers();
      showNotification("Certificate approved successfully", "success");
    } catch (error) {
      console.error("Error approving certificate:", error);
      showNotification("Failed to approve certificate", "error");
    }
  };

  const handleRejectClick = (userId) => {
    setCurrentRejectUserId(userId);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    try {
      if (!rejectReason.trim()) {
        showNotification("Please enter a rejection reason", "warning");
        return;
      }

      await api.post(`/admin/approve/${currentRejectUserId}`, {
        status: false,
        rejectionReason: rejectReason,
      });

      setShowRejectModal(false);
      setRejectReason("");
      fetchUsers();
      showNotification("Certificate rejected successfully", "success");
    } catch (error) {
      console.error("Error rejecting certificate:", error);
      showNotification("Failed to reject certificate", "error");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
        showNotification("User deleted successfully", "success");
      } catch (error) {
        console.error("Error deleting user:", error);
        showNotification("Failed to delete user", "error");
      }
    }
  };

  const handleAddUserSuccess = () => {
    setNewUserSuccess(true);
    setShowAddUserModal(false);
    fetchUsers();
    setTimeout(() => setNewUserSuccess(false), 3000);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  // Helper functions
  const showNotification = (message, type) => {
    setNotification({
      message,
      type,
      timestamp: new Date(),
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const renderCertificateStatus = (user) => {
    if (!user.certificateRequested)
      return (
        <Badge bg="light" text="dark" className="border">
          <FaFileAlt className="me-1" /> Not Requested
        </Badge>
      );
    if (user.certificateApproved === true)
      return (
        <Badge bg="success" className="d-flex align-items-center">
          <FaCheck className="me-1" /> Approved
        </Badge>
      );
    if (user.certificateApproved === false)
      return (
        <Badge bg="danger" className="d-flex align-items-center">
          <FaTimes className="me-1" /> Rejected
        </Badge>
      );
    return (
      <Badge bg="warning" text="dark" className="d-flex align-items-center">
        <BsClockHistory className="me-1" /> Pending
      </Badge>
    );
  };

  const renderRequestStatus = (user) => {
    if (!user.certificateRequestedAt) return null;

    const now = moment();
    const requestedAt = moment(user.certificateRequestedAt);
    const hoursDiff = now.diff(requestedAt, "hours");

    if (hoursDiff > 24) return null;

    if (user.certificateRequested && user.certificateApproved === null) {
      return (
        <Badge bg="info" className="ms-2 d-flex align-items-center">
          <BsClockHistory className="me-1" /> New Request
        </Badge>
      );
    }

    if (user.certificateRequested && user.certificateApproved === false) {
      return (
        <Badge bg="warning" className="ms-2 d-flex align-items-center">
          <BsArrowRepeat className="me-1" /> Reapplied
        </Badge>
      );
    }

    if (!user.certificateRequested && user.certificateApproved === null) {
      return (
        <Badge bg="dark" className="ms-2 d-flex align-items-center">
          <FaTimes className="me-1" /> Cancelled
        </Badge>
      );
    }

    return null;
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    // Search term filter
    const matchesSearch =
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.identificationNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    let matchesStatus = true;

    if (filterStatus === "pending") {
      matchesStatus =
        user.certificateRequested && user.certificateApproved === null;
    } else if (filterStatus === "approved") {
      matchesStatus = user.certificateApproved === true;
    } else if (filterStatus === "rejected") {
      matchesStatus = user.certificateApproved === false;
    } else if (filterStatus === "notRequested") {
      matchesStatus = !user.certificateRequested;
    }

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const newRequestsCount = users.filter(
    (u) =>
      u.certificateRequested &&
      u.certificateApproved === null &&
      moment().diff(moment(u.certificateRequestedAt), "hours") < 24
  ).length;

  const reappliedCount = users.filter(
    (u) =>
      u.certificateRequested &&
      u.certificateApproved === false &&
      moment().diff(moment(u.certificateRequestedAt), "hours") < 24
  ).length;

  const canceledCount = users.filter(
    (u) =>
      !u.certificateRequested &&
      u.certificateApproved === null &&
      u.certificateRequestedAt &&
      moment().diff(moment(u.certificateRequestedAt), "hours") < 24
  ).length;

  // Prepare CSV data for download
  const csvData = [
    [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "NIC",
      "Certificate Status",
      "Role",
    ],
    ...filteredUsers.map((user) => [
      user.firstName,
      user.lastName,
      user.email,
      user.phoneNumber || "N/A",
      user.identificationNumber,
      !user.certificateRequested
        ? "Not Requested"
        : user.certificateApproved === true
        ? "Approved"
        : user.certificateApproved === false
        ? "Rejected"
        : "Pending",
      user.role,
    ]),
  ];

  return (
    <div className="admin-dashboard">
      {/* Toast Notification */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1100 }}
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={5000}
          autohide
          className={`border-0 shadow-lg text-white bg-${
            notification?.type === "error"
              ? "danger"
              : notification?.type === "warning"
              ? "warning"
              : "success"
          }`}
        >
          <Toast.Header className="bg-white">
            <FaBell className="me-2 text-primary" />
            <strong className="me-auto">Notification</strong>
            <small className="text-muted">
              {moment(notification?.timestamp).fromNow()}
            </small>
          </Toast.Header>
          <Toast.Body>
            {notification?.type === "New Request" && (
              <span>
                New certificate request from{" "}
                <strong>{notification.userName}</strong>
              </span>
            )}
            {notification?.type === "Canceled" && (
              <span>
                Certificate request canceled by{" "}
                <strong>{notification.userName}</strong>
              </span>
            )}
            {notification?.type === "Reapplied" && (
              <span>
                <strong>{notification.userName}</strong> has reapplied for
                certificate
              </span>
            )}
            {notification?.message && notification.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Dashboard Header */}
      <div className="dashboard-header bg-primary text-white p-4 rounded-top shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-1 fw-bold">
              <FaUserShield className="me-2" />
              Admin Dashboard
            </h1>
            <p className="mb-0 small opacity-75">
              Manage users and certificate requests
            </p>
          </div>
          <div className="d-flex gap-2">
            <CSVLink
              data={csvData}
              filename={"user-list.csv"}
              className="btn btn-outline-light d-flex align-items-center"
              target="_blank"
            >
              <FaDownload className="me-2" />
              Export Users
            </CSVLink>
            <Button
              variant="light"
              onClick={() => setShowAddUserModal(true)}
              className="d-flex align-items-center"
            >
              <FaPlus className="me-2" />
              Add New User
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content bg-white p-4 rounded-bottom shadow">
        {/* Search and Stats Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="search-box" style={{ width: "350px" }}>
            <InputGroup className="shadow-sm">
              <InputGroup.Text className="bg-white border-end-0">
                <FaSearch className="text-primary" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search users by name, email or NIC..."
                value={searchTerm}
                onChange={handleSearch}
                className="border-start-0 py-2"
              />
              {searchTerm && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchTerm("")}
                  className="border-start-0"
                >
                  Clear
                </Button>
              )}
            </InputGroup>
          </div>

          <div className="filter-dropdown d-flex align-items-center">
            <div className="me-2 text-muted small">Filter:</div>
            <div className="btn-group">
              <Button
                variant={filterStatus === "all" ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => handleFilterChange("all")}
              >
                All
              </Button>
              <Button
                variant={
                  filterStatus === "pending" ? "primary" : "outline-primary"
                }
                size="sm"
                onClick={() => handleFilterChange("pending")}
              >
                Pending
              </Button>
              <Button
                variant={
                  filterStatus === "approved" ? "primary" : "outline-primary"
                }
                size="sm"
                onClick={() => handleFilterChange("approved")}
              >
                Approved
              </Button>
              <Button
                variant={
                  filterStatus === "rejected" ? "primary" : "outline-primary"
                }
                size="sm"
                onClick={() => handleFilterChange("rejected")}
              >
                Rejected
              </Button>
              <Button
                variant={
                  filterStatus === "notRequested"
                    ? "primary"
                    : "outline-primary"
                }
                size="sm"
                onClick={() => handleFilterChange("notRequested")}
              >
                Not Requested
              </Button>
            </div>
          </div>

          <div className="d-flex gap-3">
            <div className="stat-card bg-info bg-opacity-10 p-2 px-3 rounded shadow-sm d-flex align-items-center">
              <BsClockHistory className="text-info me-2" />
              <div>
                <div className="small text-muted">New Requests</div>
                <div className="fw-bold">{newRequestsCount}</div>
              </div>
            </div>
            <div className="stat-card bg-warning bg-opacity-10 p-2 px-3 rounded shadow-sm d-flex align-items-center">
              <BsArrowRepeat className="text-warning me-2" />
              <div>
                <div className="small text-muted">Reapplied</div>
                <div className="fw-bold">{reappliedCount}</div>
              </div>
            </div>
            <div className="stat-card bg-dark bg-opacity-10 p-2 px-3 rounded shadow-sm d-flex align-items-center">
              <FaTimes className="text-dark me-2" />
              <div>
                <div className="small text-muted">Canceled</div>
                <div className="fw-bold">{canceledCount}</div>
              </div>
            </div>
            <div className="stat-card bg-primary bg-opacity-10 p-2 px-3 rounded shadow-sm d-flex align-items-center">
              <FaUserShield className="text-primary me-2" />
              <div>
                <div className="small text-muted">Total Users</div>
                <div className="fw-bold">{users.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            variant="danger"
            className="d-flex align-items-center shadow-sm"
          >
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        {newUserSuccess && (
          <Alert
            variant="success"
            className="d-flex align-items-center shadow-sm animate__animated animate__fadeIn"
          >
            <FaCheck className="me-2" />
            User added successfully!
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="text-center">
              <Spinner animation="border" variant="primary" className="mb-2" />
              <p className="text-muted">Loading users...</p>
            </div>
          </div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaThList className="me-2 text-primary" />
                User Management
              </h5>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={fetchUsers}
                  className="d-flex align-items-center"
                >
                  <BsArrowRepeat className="me-2" />
                  Refresh Data
                </Button>
                <CSVLink
                  data={csvData}
                  filename={"filtered-users.csv"}
                  className="btn btn-outline-success btn-sm d-flex align-items-center"
                  target="_blank"
                >
                  <FaDownload className="me-2" />
                  Download List
                </CSVLink>          
              </div>
            </div>

            

            {/* Users Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "50px" }}>#</th>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th style={{ width: "180px" }}>Certificate Status</th>
                    <th style={{ width: "280px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className={
                          user.certificateRequested &&
                          user.certificateApproved === null
                            ? "table-info bg-opacity-25"
                            : ""
                        }
                      >
                        <td className="text-muted">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <span className="fw-bold text-primary">
                                {user.firstName.charAt(0)}
                                {user.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="fw-bold">
                                {user.firstName} {user.lastName}
                              </div>
                              <small className="text-muted">
                                {user.identificationNumber}
                              </small>
                              {renderRequestStatus(user)}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div>
                              <a
                                href={`mailto:${user.email}`}
                                className="text-decoration-none"
                              >
                                {user.email}
                              </a>
                            </div>
                            <small className="text-muted">
                              {user.phoneNumber || "No phone"}
                            </small>
                          </div>
                        </td>
                        <td>
                          <Badge
                            bg={user.role === "admin" ? "primary" : "secondary"}
                            className="px-3 py-1 rounded-pill"
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td>{renderCertificateStatus(user)}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-2">
                            {user.certificateRequested && (
                              <>
                                <Button
                                  variant={
                                    user.certificateApproved === true
                                      ? "outline-success"
                                      : "success"
                                  }
                                  size="sm"
                                  onClick={() => handleApprove(user._id)}
                                  disabled={user.certificateApproved === true}
                                  className="d-flex align-items-center shadow-sm"
                                >
                                  <FaCheck className="me-1" /> Approve
                                </Button>
                                <Button
                                  variant={
                                    user.certificateApproved === false
                                      ? "outline-danger"
                                      : "danger"
                                  }
                                  size="sm"
                                  onClick={() => handleRejectClick(user._id)}
                                  disabled={user.certificateApproved === false}
                                  className="d-flex align-items-center shadow-sm"
                                >
                                  <FaTimes className="me-1" /> Reject
                                </Button>
                              </>
                            )}
                            <Button
                              variant="info"
                              size="sm"
                              className="text-white d-flex align-items-center shadow-sm"
                              onClick={() => handleViewUser(user._id)}
                            >
                              <FaEye className="me-1" /> View
                            </Button>
                            <Button
                              onClick={() => handleEditUser(user._id)}
                              variant="warning"
                              size="sm"
                              className="text-white d-flex align-items-center shadow-sm"
                            >
                              <FaEdit className="me-1" /> Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(user._id)}
                              className="d-flex align-items-center shadow-sm"
                            >
                              <FaTrashAlt className="me-1" /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center">
                          <div
                            className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3"
                            style={{ width: "60px", height: "60px" }}
                          >
                            <FaUserShield className="text-muted fs-3" />
                          </div>
                          <h5 className="text-muted mb-2">No users found</h5>
                          <p className="text-muted small mb-3">
                            {searchTerm || filterStatus !== "all"
                              ? "Try different search criteria or filters"
                              : "No users in the system yet"}
                          </p>
                          {searchTerm || filterStatus !== "all" ? (
                            <div className="d-flex gap-2">
                              {searchTerm && (
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => setSearchTerm("")}
                                >
                                  Clear search
                                </Button>
                              )}
                              {filterStatus !== "all" && (
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => setFilterStatus("all")}
                                >
                                  Reset filters
                                </Button>
                              )}
                            </div>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setShowAddUserModal(true)}
                            >
                              <FaPlus className="me-1" /> Add New User
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
              <div className="text-muted small">
                Showing {filteredUsers.length} of {users.length} users
                {filterStatus !== "all" && ` (filtered by ${filterStatus})`}
                {searchTerm && ` (search: "${searchTerm}")`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      <Modal
        show={showRejectModal}
        onHide={() => setShowRejectModal(false)}
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-danger d-flex align-items-center">
            <FaTimes className="me-2" />
            Reject Certificate Request
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Please provide a reason for rejection:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="This reason will be visible to the user..."
              className="mb-3 shadow-sm"
            />
          </Form.Group>
          <Alert variant="info" className="d-flex align-items-center shadow-sm">
            <i className="bi bi-info-circle-fill me-2"></i>
            This feedback helps users understand why their request was rejected.
          </Alert>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="outline-secondary"
            onClick={() => setShowRejectModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleRejectConfirm}
            className="d-flex align-items-center"
          >
            <FaTimes className="me-1" />
            Confirm Rejection
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add User Modal */}
      <Modal
        show={showAddUserModal}
        onHide={() => setShowAddUserModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="h5 d-flex align-items-center">
            <FaPlus className="me-2 text-primary" />
            Add New User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegistrationForm onSuccess={handleAddUserSuccess} />
        </Modal.Body>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        size="xl"
        scrollable
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="h5 d-flex align-items-center">
            <FaEdit className="me-2 text-warning" />
            Edit User: {userToEdit?.firstName} {userToEdit?.lastName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToEdit && (
            <EditUserForm
              userId={userToEdit._id}
              onSuccess={handleCloseEditModal}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* View User Modal */}
      {selectedUser && (
        <Modal
          show={showUserModal}
          onHide={() => setShowUserModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="h5 d-flex align-items-center">
              <FaUserShield className="me-2 text-primary" />
              User Profile: {selectedUser.firstName} {selectedUser.lastName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6 mb-4 mb-md-0">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-header bg-light d-flex align-items-center">
                    <i className="bi bi-person-lines-fill me-2"></i>
                    <h5 className="mb-0">Personal Information</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <div className="small text-muted">Full Name</div>
                        <div className="fw-bold">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </div>
                      </li>
                      <li className="mb-3">
                        <div className="small text-muted">Email</div>
                        <div className="fw-bold">{selectedUser.email}</div>
                      </li>
                      <li className="mb-3">
                        <div className="small text-muted">NIC</div>
                        <div className="fw-bold">
                          {selectedUser.identificationNumber}
                        </div>
                      </li>
                      <li className="mb-3">
                        <div className="small text-muted">Phone</div>
                        <div className="fw-bold">
                          {selectedUser.phoneNumber || "Not provided"}
                        </div>
                      </li>
                      <li className="mb-3">
                        <div className="small text-muted">Role</div>
                        <div className="fw-bold">
                          <Badge
                            bg={
                              selectedUser.role === "admin"
                                ? "primary"
                                : "secondary"
                            }
                            className="px-3 py-1 rounded-pill"
                          >
                            {selectedUser.role}
                          </Badge>
                        </div>
                      </li>
                      <li>
                        <div className="small text-muted">Registered On</div>
                        <div className="fw-bold">
                          {moment(selectedUser.createdAt).format(
                            "MMMM DD, YYYY"
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-header bg-light d-flex align-items-center">
                    <i className="bi bi-clipboard-check me-2"></i>
                    <h5 className="mb-0">Certificate Status</h5>
                  </div>
                  <div className="card-body">
                    <div className="text-center my-3">
                      {renderCertificateStatus(selectedUser)}
                    </div>

                    {selectedUser.certificateRequested ? (
                      <ul className="list-unstyled mt-4">
                        <li className="mb-3">
                          <div className="small text-muted">Requested Date</div>
                          <div className="fw-bold">
                            {moment(selectedUser.certificateRequestedAt).format(
                              "MMMM DD, YYYY (h:mm A)"
                            )}
                          </div>
                        </li>
                        {selectedUser.certificateApprovedAt && (
                          <li className="mb-3">
                            <div className="small text-muted">
                              Response Date
                            </div>
                            <div className="fw-bold">
                              {moment(
                                selectedUser.certificateApprovedAt
                              ).format("MMMM DD, YYYY (h:mm A)")}
                            </div>
                          </li>
                        )}
                        {selectedUser.certificateApproved === false &&
                          selectedUser.rejectionReason && (
                            <li className="mb-3">
                              <div className="small text-muted">
                                Rejection Reason
                              </div>
                              <div className="p-2 bg-light rounded mt-1">
                                {selectedUser.rejectionReason}
                              </div>
                            </li>
                          )}

                        {/* Certificate Actions */}
                        {selectedUser.certificateApproved === null && (
                          <div className="mt-4 d-flex gap-2">
                            <Button
                              variant="success"
                              className="w-50 d-flex align-items-center justify-content-center"
                              onClick={() => {
                                handleApprove(selectedUser._id);
                                setShowUserModal(false);
                              }}
                            >
                              <FaCheck className="me-1" /> Approve
                            </Button>
                            <Button
                              variant="danger"
                              className="w-50 d-flex align-items-center justify-content-center"
                              onClick={() => {
                                setCurrentRejectUserId(selectedUser._id);
                                setShowUserModal(false);
                                setShowRejectModal(true);
                              }}
                            >
                              <FaTimes className="me-1" /> Reject
                            </Button>
                          </div>
                        )}
                      </ul>
                    ) : (
                      <div className="text-center py-4">
                        <div
                          className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <FaFileAlt className="text-muted fs-3" />
                        </div>
                        <h6 className="text-muted mb-1">
                          No Certificate Requested
                        </h6>
                        <p className="text-muted small">
                          This user has not requested a certificate yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            

            {/* Additional Information Section */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-light d-flex align-items-center">
                    <i className="bi bi-info-circle me-2"></i>
                    <h5 className="mb-0">Additional Information</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <ul className="list-unstyled">
                          <li className="mb-3">
                            <div className="small text-muted">Address</div>
                            <div className="fw-bold">
                              {selectedUser.address || "Not provided"}
                            </div>
                          </li>
                          <li className="mb-3">
                            <div className="small text-muted">City</div>
                            <div className="fw-bold">
                              {selectedUser.city || "Not provided"}
                            </div>
                          </li>
                          <li>
                            <div className="small text-muted">
                              State/Province
                            </div>
                            <div className="fw-bold">
                              {selectedUser.state || "Not provided"}
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="list-unstyled">
                          <li className="mb-3">
                            <div className="small text-muted">Postal Code</div>
                            <div className="fw-bold">
                              {selectedUser.postalCode || "Not provided"}
                            </div>
                          </li>
                          <li className="mb-3">
                            <div className="small text-muted">Country</div>
                            <div className="fw-bold">
                              {selectedUser.country || "Not provided"}
                            </div>
                          </li>
                          <li>
                            <div className="small text-muted">Last Updated</div>
                            <div className="fw-bold">
                              {selectedUser.updatedAt
                                ? moment(selectedUser.updatedAt).format(
                                    "MMMM DD, YYYY"
                                  )
                                : "N/A"}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button
              variant="outline-secondary"
              onClick={() => setShowUserModal(false)}
            >
              Close
            </Button>
            <Button
              variant="warning"
              className="text-white d-flex align-items-center"
              onClick={() => {
                setShowUserModal(false);
                handleEditUser(selectedUser._id);
              }}
            >
              <FaEdit className="me-1" /> Edit User
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;