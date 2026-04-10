import React from "react";
import "../componentStyles/Footer.css";
import { Phone, Mail, ChevronRight } from "@mui/icons-material"; // Added ChevronRight
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand - More structured */}
        <div className="footer-col brand">
          <h2>SELECT <span>DRESSES</span></h2>
          <p>
            Premium fashion collections designed for modern lifestyle.
            Quality, comfort and timeless elegance.
          </p>
          {/* Added Trust Badge */}
          <div className="trust-badge">
            <span>★★★★★</span>
            <span>Trusted by 10k+ customers</span>
          </div>
        </div>

        {/* Shop - Added icons */}
        <div className="footer-col">
          <h4>SHOP</h4>
          <ul>
            <li><a href="#"><ChevronRight className="list-icon" /> New Arrivals</a></li>
            <li><a href="#"><ChevronRight className="list-icon" /> Women</a></li>
            <li><a href="#"><ChevronRight className="list-icon" /> Men</a></li>
            <li><a href="#"><ChevronRight className="list-icon" /> Accessories</a></li>
          </ul>
        </div>

        {/* Company - Added icons */}
        <div className="footer-col">
          <h4>COMPANY</h4>
          <ul>
            <li><a href="#"><ChevronRight className="list-icon" /> About Us</a></li>
            <li><a href="#"><ChevronRight className="list-icon" /> Careers</a></li>
            <li><a href="#"><ChevronRight className="list-icon" /> Contact</a></li>
            <li><a href="#"><ChevronRight className="list-icon" /> Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact - Enhanced */}
        <div className="footer-col">
          <h4>CONTACT</h4>
          <ul className="contact">
            <li>
              <div className="icon-wrapper">
                <Phone fontSize="small" />
              </div>
              <div className="contact-info">
                <span className="label">Call us</span>
                <span className="value">+91 1234567890</span>
              </div>
            </li>
            <li>
              <div className="icon-wrapper">
                <Mail fontSize="small" />
              </div>
              <div className="contact-info">
                <span className="label">Email us</span>
                <span className="value">support@selectdresses.com</span>
              </div>
            </li>
            <li>
              <div className="icon-wrapper">
                <span className="location-dot">📍</span>
              </div>
              <div className="contact-info">
                <span className="label">Visit us</span>
                <span className="value">Rajkot, Gujarat, India</span>
              </div>
            </li>
          </ul>

          {/* Social with labels */}
          <div className="social">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>

      </div>

      {/* Enhanced Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>© 2026 SELECT DRESSES. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Terms</a>
            <span>•</span>
            <a href="#">Privacy</a>
            <span>•</span>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;