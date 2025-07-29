import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-scroll";
import Logo from "../../assets/Logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: "Features", label: "Features" },
    { to: "Services", label: "Services" },
    { to: "Testimonials", label: "Testimonials" },
    { to: "AboutUs", label: "About Us" },
    { to: "ContactUs", label: "Contact Us" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              className="w-32 h-9 lg:w-36 lg:h-10"
              src={Logo}
              alt="Shankh Logo"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                smooth={true}
                duration={800}
                className="font-inter text-[#5F6C7B] hover:text-[#34856C] transition-colors duration-200 cursor-pointer text-sm font-medium"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <NavLink
              to={"/orgLogin"}
              className="font-poppins px-8 py-3 rounded-lg text-sm font-semibold text-white bg-[#34856C] hover:bg-[#2a6b57] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              onClick={closeMenu}
            >
              Get Started
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-[#5F6C7B] hover:text-[#34856C] transition-colors duration-200 p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out transform ${
            isMenuOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                smooth={true}
                duration={800}
                className="font-inter block px-3 py-2 text-[#5F6C7B] hover:text-[#34856C] hover:bg-gray-50 rounded-md text-base font-medium transition-colors duration-200"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <NavLink
              to={"/orgLogin"}
              className="font-poppins block px-3 py-3 mt-4 text-center text-sm font-semibold text-white bg-[#34856C] hover:bg-[#2a6b57] rounded-lg transition-colors duration-200"
              onClick={closeMenu}
            >
              Get Started
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
