import React, { useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/users/login', { email, password });
      const { token, user } = response.data; // Get token and user details from response
      localStorage.setItem('token', token);

      // Check user role and redirect accordingly
      if (user.role === 'phm') {
        navigate('/dashboard'); // Redirect to PHM Dashboard
      } else if (user.role === 'patient') {
        navigate('/home'); // Redirect to Patient Dashboard
      } else {
        setError('Role not recognized.');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-light-gray)] via-white to-[var(--color-accent-light)]/30 relative overflow-hidden">
      {/* Enhanced background elements - more vibrant and visible */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {/* Main gradient background with more vibrant colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-white to-[var(--color-accent)]/20"></div>
        
        {/* Enlarged and more vibrant gradient orbs */}
        <div className="absolute -top-40 -left-40 w-120 h-120 rounded-full bg-gradient-to-r from-[var(--color-primary)]/40 to-[var(--color-primary-light)]/30 blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-gradient-to-l from-[var(--color-accent)]/50 to-[var(--color-accent-light)]/30 blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/4 w-120 h-120 rounded-full bg-gradient-to-t from-[var(--color-primary)]/35 to-[var(--color-primary-light)]/25 blur-3xl"></div>
        
        {/* Additional colored orbs for depth and visual interest */}
        <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full bg-[var(--color-accent)]/40 blur-2xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[var(--color-primary-light)]/35 blur-2xl animate-float-delayed"></div>
        <div className="absolute top-2/3 right-1/3 w-32 h-32 rounded-full bg-[var(--color-button)]/25 blur-2xl animate-pulse-slow"></div>
        
        {/* More dynamic gradient waves */}
        <div className="absolute top-1/2 left-0 w-full h-32 bg-gradient-to-r from-[var(--color-primary)]/20 via-transparent to-[var(--color-accent)]/20 blur-xl transform -rotate-1"></div>
        <div className="absolute top-2/3 left-0 w-full h-24 bg-gradient-to-r from-[var(--color-accent)]/15 via-transparent to-[var(--color-primary)]/15 blur-xl transform rotate-1"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-8"></div>
        
        {/* Enhanced light beam effects */}
        <div className="absolute -top-40 left-1/3 w-1/3 h-screen bg-white/30 rotate-12 blur-3xl transform"></div>
        <div className="absolute -bottom-20 right-1/4 w-1/4 h-screen bg-white/20 -rotate-12 blur-3xl transform"></div>
        
        {/* Dynamic spotlight effect */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-white/30 rounded-full blur-3xl animate-spotlight"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-xl overflow-hidden border border-white/50">
          {/* Logo/Brand Section */}
          <div className="pt-10 pb-2 px-8">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[var(--color-dark-gray)] ml-3">
                <span className="text-[var(--color-primary)]">e</span>-Grama
              </h1>
            </div>
            <p className="text-gray-500 text-center mt-4 text-sm">Your digital village, connecting communities</p>
          </div>

          <div className="w-full h-1 bg-[var(--color-primary)]"></div>

          {/* Welcome */}
          <div className="pt-6 pb-2 px-8">
            <h2 className="text-xl font-bold text-[var(--color-primary)] text-center">Welcome Back</h2>
            <p className="text-gray-500 text-center text-sm">Sign in to access your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-8 pb-8">
            {error && (
              <div className="mb-6 bg-red-50/80 backdrop-blur-sm border border-red-100 p-4 rounded-xl">
                <p className="text-red-600 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="email" className="block text-[var(--color-dark-gray)] text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-md"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block text-[var(--color-dark-gray)] text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-md"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <button 
                type="submit" 
                className="w-full bg-[var(--color-button)] text-white py-3 px-4 rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-button)] focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg shadow-[var(--color-button)]/20 flex items-center justify-center backdrop-blur-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-solid border-white rounded-full"></div>
                ) : (
                  <>
                    Sign In
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="/forgot-password" className="text-[var(--color-primary)] hover:text-[var(--color-primary-light)]">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                New to e-Grama? <a href="/register" className="text-[var(--color-primary)] hover:text-[var(--color-primary-light)] font-medium transition-colors">Create an account</a>
              </p>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs backdrop-blur-sm bg-white/30 inline-block px-4 py-2 rounded-full">
            © 2025 e-Grama. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;