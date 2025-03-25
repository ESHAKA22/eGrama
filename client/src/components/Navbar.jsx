import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Import your logo image
import logo from '../assets/logo.png';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');  
    window.location.href = '/login';  
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg' 
          : 'bg-white/50 backdrop-blur-2xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Increased size and improved styling */}
          <div className="flex-shrink-0 flex items-center">
            <img src={logo} alt="e-Grama Logo" className="h-20 w-auto transition-all duration-300 hover:scale-105" />
            <h1 className="text-2xl font-bold ml-3 text-[var(--color-dark-gray)]">
              <span className="text-[var(--color-primary)]">e-</span>
              <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[var(--color-primary)]/20 after:rounded-full">Grama</span>
            </h1>
          </div>
          
          {/* Navbar Links - Desktop - Enhanced with better hover effects */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-sm font-medium text-[var(--color-dark-gray)] hover:text-[var(--color-primary)] relative group transition-colors duration-300 flex items-center py-2 px-3 hover:bg-[var(--color-primary)]/5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[var(--color-primary)] group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link to="/patients" className="text-sm font-medium text-[var(--color-dark-gray)] hover:text-[var(--color-primary)] relative group transition-colors duration-300 flex items-center py-2 px-3 hover:bg-[var(--color-primary)]/5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Patients
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[var(--color-primary)] group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link to="#" className="text-sm font-medium text-[var(--color-dark-gray)] hover:text-[var(--color-primary)] relative group transition-colors duration-300 flex items-center py-2 px-3 hover:bg-[var(--color-primary)]/5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Records
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[var(--color-primary)] group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link to="#" className="text-sm font-medium text-[var(--color-dark-gray)] hover:text-[var(--color-primary)] relative group transition-colors duration-300 flex items-center py-2 px-3 hover:bg-[var(--color-primary)]/5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[var(--color-primary)] group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
          </div>
          
          {/* Logout Button - Keeping original color but improving styling */}
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="ml-4 px-5 py-2.5 bg-[var(--color-button)]/90 hover:bg-[var(--color-primary)] text-white font-medium rounded-lg transition-all duration-300 flex items-center shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
          
          {/* Mobile Menu Button - Enhanced with better styling */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary)]/10 transition-colors duration-300"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu - Enhanced with better styling and animations */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-white/20 shadow-lg pt-3 pb-5 animate-fadeIn">
          <div className="px-4 space-y-2">
            <Link to="/dashboard" className="block py-3 px-4 text-base font-medium text-[var(--color-dark-gray)] hover:text-[var(--color-primary)] transition-colors duration-300 border-b border-[var(--color-gray-medium)]/20 flex items-center hover:bg-[var(--color-primary)]/5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </Link>
            <Link to="/#" className="block py-3 px-4 text-base font-medium text-[var(--color-dark-gray)] hover:text-[var(--color-primary)] transition-colors duration-300 border-b border-[var(--color-gray-medium)]/20 flex items-center hover:bg-[var(--color-primary)]/5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Services
            </Link>
            <Link to="/records" className="block py-3 px-4 text-base font-medium text-[var(--color-dark-gray)] hover:text-[var(--color-primary)] transition-colors duration-300 border-b border-[var(--color-gray-medium)]/20 flex items-center hover:bg-[var(--color-primary)]/5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Records
            </Link>
            <Link to="/settings" className="block py-3 px-4 text-base font-medium text-[var(--color-dark-gray)] hover:text-[var(--color-primary)] transition-colors duration-300 border-b border-[var(--color-gray-medium)]/20 flex items-center hover:bg-[var(--color-primary)]/5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full mt-6 px-4 py-3 bg-[var(--color-button)]/90 hover:bg-[var(--color-primary)] text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;