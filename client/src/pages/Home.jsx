import React from "react";
//import "../main.css"; // Keep the import for any remaining global styles

import {
  User,
  CreditCard,
  Building2,
  FileText,
  Phone,
  HelpCircle,
  ChevronRight,
  Search,
  Bell,
} from "lucide-react";

const EGramaHomepage = () => {
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 1.5rem",
    },
    header: {
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
    },
    headerInner: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 0",
    },
    logo: {
      display: "flex",
      alignItems: "center",
    },
    logoIcon: {
      width: "2.5rem",
      height: "2.5rem",
      backgroundColor: "#2563eb",
      borderRadius: "0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: "1.5rem",
      marginRight: "0.75rem",
    },
    logoText: {
      fontSize: "1.75rem",
      fontWeight: "600",
      color: "#1f2937",
    },
    nav: {
      display: "none",
      alignItems: "center",
      gap: "2rem",
      "@media (min-width: 768px)": {
        display: "flex",
      },
    },
    navLink: {
      color: "#4b5563",
      fontWeight: "500",
      textDecoration: "none",
      transition: "color 0.2s ease-in-out",
      ":hover": {
        color: "#2563eb",
      },
    },
    headerActions: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    iconButton: {
      padding: "0.5rem",
      color: "#6b7280",
      cursor: "pointer",
      borderRadius: "0.375rem",
      backgroundColor: "transparent",
      border: "none",
      transition: "color 0.3s ease",
      ":hover": {
        color: "#2563eb",
      },
    },
    notificationDot: {
      position: "absolute",
      top: "0.25rem",
      right: "0.25rem",
      width: "0.5rem",
      height: "0.5rem",
      backgroundColor: "#ef4444",
      borderRadius: "9999px",
    },
    buttonPrimary: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#2563eb",
      color: "#ffffff",
      fontWeight: "600",
      padding: "0.75rem 1.5rem",
      borderRadius: "0.5rem",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      border: "none",
      ":hover": {
        backgroundColor: "#1d4ed8",
      },
    },
    buttonSecondary: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      color: "#2563eb",
      fontWeight: "600",
      padding: "0.75rem 1.5rem",
      borderRadius: "0.5rem",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      border: "none",
      ":hover": {
        backgroundColor: "#f3f4f6",
      },
    },
    hero: {
      backgroundColor: "#2563eb",
      color: "#ffffff",
      padding: "6rem 2rem",
      textAlign: "center",
    },
    heroContent: {
      maxWidth: "48rem",
      margin: "0 auto",
    },
    heroTitle: {
      fontSize: "3rem",
      fontWeight: "700",
      marginBottom: "1.5rem",
      lineHeight: "1.3",
    },
    heroDescription: {
      fontSize: "1.25rem",
      marginBottom: "2rem",
      color: "#bfdbfe",
      lineHeight: "1.6",
    },
    heroButtons: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      "@media (min-width: 640px)": {
        flexDirection: "row",
        justifyContent: "center",
      },
    },
    sectionTitle: {
      fontSize: "2.25rem",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: "3rem",
      color: "#1f2937",
    },
    servicesGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "2rem",
      "@media (min-width: 768px)": {
        gridTemplateColumns: "repeat(2, 1fr)",
      },
      "@media (min-width: 1024px)": {
        gridTemplateColumns: "repeat(4, 1fr)",
      },
    },
    serviceCard: {
      backgroundColor: "#ffffff",
      padding: "1.5rem",
      borderRadius: "0.75rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transition: "box-shadow 0.3s ease",
      ":hover": {
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
    },
    serviceIcon: {
      width: "3rem",
      height: "3rem",
      backgroundColor: "#f3f4f6",
      borderRadius: "0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "1rem",
    },
    serviceTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "0.75rem",
      color: "#1f2937",
    },
    serviceDescription: {
      color: "#4b5563",
      marginBottom: "1.25rem",
      lineHeight: "1.5",
    },
    serviceLink: {
      color: "#2563eb",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      transition: "color 0.3s ease",
      ":hover": {
        color: "#1d4ed8",
      },
    },
    quickAccessSection: {
      backgroundColor: "#f3f4f6",
      padding: "6rem 2rem",
    },
    quickAccessGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "1.5rem",
      "@media (min-width: 768px)": {
        gridTemplateColumns: "repeat(4, 1fr)",
      },
      "@media (min-width: 1024px)": {
        gridTemplateColumns: "repeat(6, 1fr)",
      },
    },
    quickAccessButton: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      backgroundColor: "#ffffff",
      borderRadius: "0.75rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: "box-shadow 0.3s ease",
      ":hover": {
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
    },
    quickAccessIcon: {
      width: "2.5rem",
      height: "2.5rem",
      backgroundColor: "#2563eb",
      borderRadius: "9999px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "1rem",
    },
    quickAccessText: {
      color: "#374151",
      fontWeight: "500",
      fontSize: "1rem",
      textAlign: "center",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "2rem",
      "@media (min-width: 768px)": {
        gridTemplateColumns: "repeat(3, 1fr)",
      },
    },
    statCard: {
      textAlign: "center",
      padding: "1.5rem",
      backgroundColor: "#ffffff",
      borderRadius: "0.75rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    statNumber: {
      fontSize: "2.25rem",
      fontWeight: "700",
      color: "#2563eb",
      marginBottom: "0.5rem",
    },
    statLabel: {
      color: "#4b5563",
    },
    contactSection: {
      backgroundColor: "#f3f4f6",
      padding: "6rem 2rem",
    },
    contactCard: {
      backgroundColor: "#ffffff",
      borderRadius: "0.75rem",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    contactGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      "@media (min-width: 768px)": {
        gridTemplateColumns: "repeat(2, 1fr)",
      },
    },
    contactContent: {
      padding: "2.5rem",
    },
    contactTitle: {
      fontSize: "1.75rem",
      fontWeight: "600",
      marginBottom: "1.5rem",
      color: "#1f2937",
    },
    contactDescription: {
      color: "#4b5563",
      marginBottom: "2rem",
      lineHeight: "1.6",
    },
    contactInfo: {
      display: "flex",
      alignItems: "center",
      marginBottom: "1.5rem",
    },
    contactIconWrapper: {
      width: "2.5rem",
      height: "2.5rem",
      backgroundColor: "#dbeafe",
      borderRadius: "9999px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#2563eb",
      marginRight: "1rem",
    },
    appSection: {
      backgroundColor: "#2563eb",
      padding: "3rem",
      color: "#ffffff",
    },
    appTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "1.5rem",
    },
    appDescription: {
      marginBottom: "1.5rem",
      lineHeight: "1.6",
    },
    appButtons: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      "@media (min-width: 640px)": {
        flexDirection: "row",
        justifyContent: "center",
      },
    },
    footer: {
      backgroundColor: "#1f2937",
      color: "#ffffff",
      padding: "3rem 0",
    },
    footerGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "2rem",
      marginBottom: "2rem",
      "@media (min-width: 768px)": {
        gridTemplateColumns: "repeat(4, 1fr)",
      },
    },
    footerLogo: {
      display: "flex",
      alignItems: "center",
      marginBottom: "1rem",
    },
    footerLogoIcon: {
      width: "2.5rem",
      height: "2.5rem",
      backgroundColor: "#ffffff",
      borderRadius: "0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#2563eb",
      fontWeight: "bold",
      fontSize: "1.25rem",
      marginRight: "0.75rem",
    },
    footerLogoText: {
      fontSize: "1.5rem",
      fontWeight: "700",
    },
    footerDescription: {
      color: "#9ca3af",
      fontSize: "1rem",
    },
    footerHeading: {
      fontWeight: "700",
      fontSize: "1.125rem",
      marginBottom: "1rem",
    },
    footerLinks: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    footerLink: {
      color: "#9ca3af",
      textDecoration: "none",
      transition: "color 0.3s ease",
      ":hover": {
        color: "#ffffff",
      },
    },
    footerBottom: {
      borderTop: "1px solid #374151",
      paddingTop: "2rem",
      marginTop: "2rem",
      textAlign: "center",
      color: "#9ca3af",
      fontSize: "0.875rem",
    },
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.container}>
          <div style={styles.headerInner}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>e</div>
              <h1 style={styles.logoText}>e-Grama</h1>
            </div>

            <div style={styles.nav}>
              <a href="#" style={styles.navLink}>
                Home
              </a>
              <a href="#" style={styles.navLink}>
                Services
              </a>
              <a href="#" style={styles.navLink}>
                About
              </a>
              <a href="#" style={styles.navLink}>
                Contact
              </a>
            </div>

            <div style={styles.headerActions}>
              <button style={styles.iconButton}>
                <Search size={20} />
              </button>
              <button style={styles.iconButton}>
                <Bell size={20} />
                <span style={styles.notificationDot}></span>
              </button>
              <button style={styles.buttonPrimary}>Login</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h2 style={styles.heroTitle}>
            Your One-Stop Digital Village Services Platform
          </h2>
          <p style={styles.heroDescription}>
            Access government services, apply for loans, manage your profile,
            and connect with healthcare facilities - all in one place.
          </p>
          <div style={styles.heroButtons}>
            <button style={styles.buttonSecondary}>Register Now</button>
            <button style={styles.buttonPrimary}>Learn More</button>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section style={{ padding: "4rem 0" }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Our Services</h2>

          <div style={styles.servicesGrid}>
            {/* Service Cards */}
            <div style={styles.serviceCard}>
              <div style={styles.serviceIcon}>
                <User size={24} />
              </div>
              <h3 style={styles.serviceTitle}>Profile Management</h3>
              <p style={styles.serviceDescription}>
                Update your personal information, documents, and manage your
                digital identity.
              </p>
              <a href="#" style={styles.serviceLink}>
                Access Profile <ChevronRight size={16} />
              </a>
            </div>
            <div style={styles.serviceCard}>
              <div style={styles.serviceIcon}>
                <CreditCard size={24} />
              </div>
              <h3 style={styles.serviceTitle}>Loan Applications</h3>
              <p style={styles.serviceDescription}>
                Apply for various government and private loans with simplified
                procedures.
              </p>
              <a href="#" style={styles.serviceLink}>
                Explore Loans <ChevronRight size={16} />
              </a>
            </div>
            <div style={styles.serviceCard}>
              <div style={styles.serviceIcon}>
                <Building2 size={24} />
              </div>
              <h3 style={styles.serviceTitle}>PHM managment</h3>
              <p style={styles.serviceDescription}>
                access medical records, and find healthcare
                facilities.
              </p>
              <a href="/patient-dashboard" style={styles.serviceLink}>
                Healthcare Portal <ChevronRight size={16} />
              </a>
            </div>
            <div style={styles.serviceCard}>
              <div style={styles.serviceIcon}>
                <FileText size={24} />
              </div>
              <h3 style={styles.serviceTitle}>Documents</h3>
              <p style={styles.serviceDescription}>
                Apply for certificates, licenses and access other document
                services.
              </p>
              <a href="#" style={styles.serviceLink}>
                Document Center <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section style={{ padding: "4rem 0" }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Our Impact</h2>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>10,000+</div>
              <div style={styles.statLabel}>Registered Users</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>50,000+</div>
              <div style={styles.statLabel}>Services Delivered</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>95%</div>
              <div style={styles.statLabel}>Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={styles.contactSection}>
        <div style={styles.container}>
          <div style={styles.contactCard}>
            <div style={styles.contactGrid}>
              <div style={styles.contactContent}>
                <h3 style={styles.contactTitle}>Contact Us</h3>
                <p style={styles.contactDescription}>
                  Have questions or need assistance? Our team is here to help
                  you with any inquiries about our services.
                </p>

                <div style={styles.contactInfo}>
                  <div style={styles.contactIconWrapper}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: "600" }}>Call Us</div>
                    <div>+91 1234 567 890</div>
                  </div>
                </div>

                <div style={styles.contactInfo}>
                  <div style={styles.contactIconWrapper}>
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: "600" }}>Email Support</div>
                    <div>support@egrama.gov.in</div>
                  </div>
                </div>

                <button style={styles.buttonPrimary}>Contact Support</button>
              </div>

              <div style={styles.appSection}>
                <h3 style={styles.appTitle}>Download the e-Grama Mobile App</h3>
                <p style={styles.appDescription}>
                  Get faster access to all services right from your smartphone.
                  Available for both Android and iOS devices.
                </p>
                <div style={styles.appButtons}>
                  <button style={styles.buttonSecondary}>Android App</button>
                  <button style={styles.buttonSecondary}>iOS App</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerGrid}>
            <div>
              <div style={styles.footerLogo}>
                <div style={styles.footerLogoIcon}>e</div>
                <div style={styles.footerLogoText}>e-Grama</div>
              </div>
              <p style={styles.footerDescription}>
                Your one-stop platform for all village-level digital government
                services, designed to simplify citizen-government interaction.
              </p>
            </div>

            <div>
              <h4 style={styles.footerHeading}>Services</h4>
              <div style={styles.footerLinks}>
                <a href="#" style={styles.footerLink}>
                  Profile Management
                </a>
                <a href="#" style={styles.footerLink}>
                  Document Services
                </a>
                <a href="#" style={styles.footerLink}>
                  Healthcare
                </a>
                <a href="#" style={styles.footerLink}>
                  Loan Applications
                </a>
                <a href="#" style={styles.footerLink}>
                  Bill Payments
                </a>
              </div>
            </div>

            <div>
              <h4 style={styles.footerHeading}>Resources</h4>
              <div style={styles.footerLinks}>
                <a href="#" style={styles.footerLink}>
                  Help Center
                </a>
                <a href="#" style={styles.footerLink}>
                  User Guides
                </a>
                <a href="#" style={styles.footerLink}>
                  FAQs
                </a>
                <a href="#" style={styles.footerLink}>
                  Service Status
                </a>
                <a href="#" style={styles.footerLink}>
                  Contact Support
                </a>
              </div>
            </div>

            <div>
              <h4 style={styles.footerHeading}>Legal</h4>
              <div style={styles.footerLinks}>
                <a href="#" style={styles.footerLink}>
                  Terms of Service
                </a>
                <a href="#" style={styles.footerLink}>
                  Privacy Policy
                </a>
                <a href="#" style={styles.footerLink}>
                  Cookie Policy
                </a>
                <a href="#" style={styles.footerLink}>
                  Accessibility
                </a>
                <a href="#" style={styles.footerLink}>
                  Security
                </a>
              </div>
            </div>
          </div>

          <div style={styles.footerBottom}>
            &copy; {new Date().getFullYear()} e-Grama. All rights reserved. A
            Government of India Initiative.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EGramaHomepage;
