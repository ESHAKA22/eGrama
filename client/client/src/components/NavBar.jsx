import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/egrama.png";

const NavBar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  // Modified color scheme with purple accents but not overwhelming
  const colors = {
    primary: "#2d1b69", // Dark purple-blue for main navbar
    secondary: "#5e35b1", // Mid-purple for highlights
    accent: "#9575cd", // Light purple for accents
    light: "#f9fafb",
    white: "#ffffff",
    lightGray: "#f3f4f6",
    darkText: "#111827",
    mediumText: "#374151",
  };

  // Custom CSS for the navbar
  const navbarStyle = {
    backgroundColor: colors.primary,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    borderBottom: `2px solid ${colors.accent}`,
    padding: "0.75rem 1rem",
  };

  const brandStyle = {
    color: colors.white,
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
  };

  const logoStyle = {
    width: "40px",
    height: "40px",
    objectFit: "contain",
    marginRight: "15px",
    border: `2px solid ${colors.accent}`,
    borderRadius: "10%",
    padding: "2px",
    backgroundColor: colors.white,
  };

  const titleStyle = {
    fontSize: "24px",
    color: colors.white,
    fontWeight: "700",
  };

  const navLinkStyle = {
    color: colors.lightGray,
    margin: "0 8px",
    padding: "8px 15px",
    borderRadius: "4px",
    transition: "all 0.3s ease",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
  };

  const buttonStyle = {
    backgroundColor: colors.secondary,
    color: colors.white,
    border: "none",
    padding: "8px 20px",
    borderRadius: "4px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    marginLeft: "10px",
  };

  const searchBarStyle = {
    backgroundColor: colors.lightGray,
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
    marginRight: "10px",
    width: searchVisible ? "200px" : "0px",
    opacity: searchVisible ? "1" : "0",
    transition: "all 0.3s ease",
  };

  const searchButtonStyle = {
    backgroundColor: "transparent",
    color: colors.lightGray,
    border: "none",
    cursor: "pointer",
    margin: "0 10px",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    right: "0",
    backgroundColor: colors.primary,
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    borderRadius: "4px",
    padding: "8px 0",
    minWidth: "200px",
    zIndex: "1000",
    display: dropdownOpen ? "block" : "none",
  };

  const dropdownItemStyle = {
    padding: "10px 15px",
    color: colors.lightGray,
    display: "block",
    textDecoration: "none",
    transition: "all 0.2s ease",
  };

  const notificationBadgeStyle = {
    position: "absolute",
    top: "0",
    right: "0",
    backgroundColor: "#e040fb", // Purple notification badge
    color: colors.white,
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "bold",
  };

  const hoverStyles = {
    navLinkHover: {
      backgroundColor: colors.secondary,
      color: colors.white,
      borderColor: colors.light,
    },
    buttonHover: {
      backgroundColor: "#7e57c2", // Lighter purple on hover
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    dropdownItemHover: {
      backgroundColor: colors.secondary,
      color: colors.white,
    },
  };

  return (
    <nav className="navbar navbar-expand-lg" style={navbarStyle}>
      <div className="container">
        {/* Logo and Brand Name */}
        <Link className="navbar-brand" to="/" style={brandStyle}>
          <img src={logo} alt="e-Grama System Logo" style={logoStyle} />
          <span style={titleStyle}>e-Grama System</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            borderColor: colors.light,
            padding: "0.25rem 0.5rem",
          }}
        >
          <span
            className="navbar-toggler-icon"
            style={{ filter: "invert(1)" }}
          ></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Search Bar */}
          <div className="d-flex ms-auto me-2">
            <input type="text" placeholder="Search..." style={searchBarStyle} />
            <button
              style={searchButtonStyle}
              onClick={() => setSearchVisible(!searchVisible)}
            >
              <i className="bi bi-search"></i>
            </button>
          </div>

          <ul className="navbar-nav ms-auto align-items-center">
            {/* Services Menu */}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/services"
                style={navLinkStyle}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, hoverStyles.navLinkHover)
                }
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.color = colors.lightGray;
                }}
              >
                <i className="bi bi-grid-3x3-gap-fill me-1"></i> Services
              </Link>
            </li>

            {/* Notifications */}
            <li className="nav-item position-relative">
              <Link
                className="nav-link"
                to="/notifications"
                style={navLinkStyle}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, hoverStyles.navLinkHover)
                }
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.color = colors.lightGray;
                }}
              >
                <i className="bi bi-bell me-1"></i> Notifications
                <span style={notificationBadgeStyle}>2</span>
              </Link>
            </li>

            {/* Help Center */}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/help"
                style={navLinkStyle}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, hoverStyles.navLinkHover)
                }
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.color = colors.lightGray;
                }}
              >
                <i className="bi bi-question-circle me-1"></i> Help
              </Link>
            </li>

            {!user ? (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/login"
                  style={navLinkStyle}
                  onMouseEnter={(e) =>
                    Object.assign(
                      e.currentTarget.style,
                      hoverStyles.navLinkHover
                    )
                  }
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.color = colors.lightGray;
                  }}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
              </li>
            ) : (
              <>
                {/* User Profile Dropdown */}
                <li className="nav-item position-relative">
                  <div
                    className="nav-link"
                    style={navLinkStyle}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.cursor = "pointer";
                      Object.assign(
                        e.currentTarget.style,
                        hoverStyles.navLinkHover
                      );
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.color = colors.lightGray;
                    }}
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user.name || "User"}{" "}
                    <i className="bi bi-chevron-down ms-1"></i>
                  </div>

                  {/* Dropdown Menu */}
                  <div style={dropdownStyle}>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        style={dropdownItemStyle}
                        onMouseEnter={(e) =>
                          Object.assign(
                            e.currentTarget.style,
                            hoverStyles.dropdownItemHover
                          )
                        }
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = colors.lightGray;
                        }}
                      >
                        <i className="bi bi-speedometer2 me-2"></i> Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      style={dropdownItemStyle}
                      onMouseEnter={(e) =>
                        Object.assign(
                          e.currentTarget.style,
                          hoverStyles.dropdownItemHover
                        )
                      }
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = colors.lightGray;
                      }}
                    >
                      <i className="bi bi-person me-2"></i> My Profile
                    </Link>

                    <Link
                      to="/applications"
                      style={dropdownItemStyle}
                      onMouseEnter={(e) =>
                        Object.assign(
                          e.currentTarget.style,
                          hoverStyles.dropdownItemHover
                        )
                      }
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = colors.lightGray;
                      }}
                    >
                      <i className="bi bi-file-earmark-text me-2"></i> My
                      Applications
                    </Link>

                    <Link
                      to="/settings"
                      style={dropdownItemStyle}
                      onMouseEnter={(e) =>
                        Object.assign(
                          e.currentTarget.style,
                          hoverStyles.dropdownItemHover
                        )
                      }
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = colors.lightGray;
                      }}
                    >
                      <i className="bi bi-gear me-2"></i> Settings
                    </Link>

                    <hr
                      style={{
                        margin: "8px 15px",
                        borderColor: colors.mediumText,
                      }}
                    />

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) =>
                        Object.assign(
                          e.currentTarget.style,
                          hoverStyles.dropdownItemHover
                        )
                      }
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = colors.lightGray;
                      }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </a>
                  </div>
                </li>
              </>
            )}

            {/* Language Selector */}
            <li className="nav-item">
              <button
                className="btn"
                style={buttonStyle}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, hoverStyles.buttonHover)
                }
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.secondary;
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <i className="bi bi-globe me-1"></i> EN
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default NavBar;
