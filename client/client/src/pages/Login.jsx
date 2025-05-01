import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserShield, FaLock, FaArrowRight, FaQuestion } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (storedUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGNOfficerAccess = () => {
    navigate('/admin');
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    alert('Password reset functionality will be implemented soon.');
  };

  return (
    <div style={styles.container}>
      {/* Enhanced Background Elements */}
      <div style={styles.background}>
        <div style={styles.gradientOverlay}></div>
        <div style={styles.gridPattern}></div>
        <div style={styles.floatingShape1}></div>
        <div style={styles.floatingShape2}></div>
        <div style={styles.floatingShape3}></div>
        <div style={styles.floatingCircle1}></div>
        <div style={styles.floatingCircle2}></div>
      </div>
      
      {/* Login Card */}
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <FaUserShield size={32} color="#5D3FD3" />
          </div>
          <h2 style={styles.title}>Village Management System</h2>
          <p style={styles.subtitle}>Sign in to access your dashboard</p>
        </div>

        {error && (
          <div style={styles.alert}>
            <svg style={styles.alertIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaUserShield style={styles.icon} />
              Email Address
            </label>
            <div style={{
              ...styles.inputWrapper,
              borderColor: isFocused.email ? '#5D3FD3' : '#e2e8f0',
              boxShadow: isFocused.email ? '0 0 0 3px rgba(93, 63, 211, 0.1)' : 'none',
            }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your email"
                onFocus={() => setIsFocused({...isFocused, email: true})}
                onBlur={() => setIsFocused({...isFocused, email: false})}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>
                <FaLock style={styles.icon} />
                Password
              </label>
              <button 
                type="button" 
                onClick={handleForgotPassword}
                style={styles.forgotPassword}
              >
                Forgot password?
              </button>
            </div>
            <div style={{
              ...styles.inputWrapper,
              borderColor: isFocused.password ? '#5D3FD3' : '#e2e8f0',
              boxShadow: isFocused.password ? '0 0 0 3px rgba(93, 63, 211, 0.1)' : 'none',
            }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your password"
                onFocus={() => setIsFocused({...isFocused, password: true})}
                onBlur={() => setIsFocused({...isFocused, password: false})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            style={styles.loginButton}
            disabled={isLoading}
            className="hover-effect"
          >
            {isLoading ? (
              <span style={styles.spinner}></span>
            ) : (
              <FaArrowRight style={{ marginRight: '8px' }} />
            )}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.divider}>
          <hr style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <hr style={styles.dividerLine} />
        </div>

        <button
          onClick={handleGNOfficerAccess}
          style={styles.adminButton}
          className="hover-effect"
        >
          GN Officer Access
        </button>

        <div style={styles.needHelp}>
          <FaQuestion size={16} style={{ marginRight: '8px', color: '#718096' }} />
          <span>Need help? <a href="#" style={styles.helpLink}>Contact support</a></span>
        </div>
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          © {new Date().getFullYear()} Village Management System | All Rights Reserved
        </p>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>Privacy Policy</a>
          <span style={styles.footerDivider}>•</span>
          <a href="#" style={styles.footerLink}>Terms of Service</a>
        </div>
      </div>

      {/* Global styles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 0.6; }
          100% { opacity: 0.4; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .hover-effect {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px -4px rgba(93, 63, 211, 0.2);
        }
        
        .hover-effect:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.05) 0%, rgba(168, 230, 207, 0.05) 100%)',
  },
  gridPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: 'radial-gradient(rgba(93, 63, 211, 0.06) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
  },
  floatingShape1: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
    background: 'linear-gradient(45deg, rgba(93, 63, 211, 0.08), rgba(93, 63, 211, 0.02))',
    top: '10%',
    left: '5%',
    filter: 'blur(40px)',
    animation: 'float 15s ease-in-out infinite',
  },
  floatingShape2: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
    background: 'linear-gradient(135deg, rgba(118, 222, 206, 0.08), rgba(118, 222, 206, 0.02))',
    bottom: '5%',
    right: '5%',
    filter: 'blur(50px)',
    animation: 'float 18s ease-in-out infinite alternate-reverse',
  },
  floatingShape3: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50% 50% 50% 50% / 40% 60% 40% 60%',
    background: 'linear-gradient(225deg, rgba(255, 184, 108, 0.06), rgba(255, 184, 108, 0.01))',
    top: '40%',
    right: '15%',
    filter: 'blur(35px)',
    animation: 'float 22s ease-in-out infinite',
  },
  floatingCircle1: {
    position: 'absolute',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(93, 63, 211, 0.06)',
    top: '20%',
    right: '25%',
    animation: 'pulse 4s ease-in-out infinite',
  },
  floatingCircle2: {
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: 'rgba(118, 222, 206, 0.06)',
    bottom: '25%',
    left: '20%',
    animation: 'pulse 6s ease-in-out infinite',
  },
  card: {
    position: 'relative',
    zIndex: 10,
    width: '90%',
    maxWidth: '460px',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '24px',
    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.02)',
    padding: '40px 48px',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transform: 'translateY(0)',
    transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
  },
  header: {
    textAlign: 'center',
    marginBottom: '36px',
  },
  logo: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#f0e6ff',
    boxShadow: '0 12px 24px -8px rgba(93, 63, 211, 0.25)',
    marginBottom: '20px',
    transition: 'transform 0.3s ease',
  },
  title: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#2d3748',
    marginBottom: '10px',
    letterSpacing: '-0.01em',
  },
  subtitle: {
    fontSize: '15px',
    color: '#718096',
    margin: 0,
    letterSpacing: '0.01em',
  },
  alert: {
    borderRadius: '12px',
    marginBottom: '24px',
    backgroundColor: '#fff5f5',
    color: '#e53e3e',
    padding: '14px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px -2px rgba(229, 62, 62, 0.1)',
    border: '1px solid rgba(229, 62, 62, 0.2)',
  },
  alertIcon: {
    width: '16px',
    height: '16px',
    marginRight: '8px',
    strokeWidth: 2,
  },
  form: {
    marginBottom: '24px',
  },
  formGroup: {
    marginBottom: '24px',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 600,
    color: '#4a5568',
    marginBottom: '8px',
    letterSpacing: '0.01em',
  },
  icon: {
    marginRight: '8px',
    color: '#5D3FD3',
  },
  inputWrapper: {
    position: 'relative',
    borderRadius: '12px',
    border: '1.5px solid #e2e8f0',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: 'transparent',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'background-color 0.2s',
  },
  forgotPassword: {
    background: 'none',
    border: 'none',
    fontSize: '13px',
    color: '#5D3FD3',
    cursor: 'pointer',
    fontWeight: 500,
    padding: 0,
    transition: 'color 0.2s',
    textDecoration: 'none',
  },
  loginButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 600,
    backgroundColor: '#5D3FD3',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    marginTop: '16px',
    letterSpacing: '0.01em',
    boxShadow: '0 4px 12px rgba(93, 63, 211, 0.25)',
  },
  spinner: {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 0.8s ease-in-out infinite',
    marginRight: '10px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '28px 0',
    color: '#a0aec0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e2e8f0',
    border: 'none',
  },
  dividerText: {
    padding: '0 16px',
    fontSize: '14px',
    color: '#a0aec0',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    fontWeight: 500,
  },
  adminButton: {
    width: '100%',
    padding: '14px',
    fontSize: '15px',
    fontWeight: 600,
    backgroundColor: '#ffffff',
    border: '1.5px solid #5D3FD3',
    borderRadius: '12px',
    color: '#5D3FD3',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    letterSpacing: '0.01em',
  },
  needHelp: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '28px',
    fontSize: '14px',
    color: '#718096',
  },
  helpLink: {
    color: '#5D3FD3',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  footer: {
    position: 'absolute',
    bottom: '20px',
    zIndex: 10,
    textAlign: 'center',
    width: '100%',
  },
  footerText: {
    fontSize: '12.5px',
    color: '#718096',
    margin: '0 0 6px 0',
    letterSpacing: '0.02em',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  },
  footerLink: {
    fontSize: '12px',
    color: '#5D3FD3',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  footerDivider: {
    color: '#a0aec0',
    fontSize: '10px',
  }
};

export default Login;