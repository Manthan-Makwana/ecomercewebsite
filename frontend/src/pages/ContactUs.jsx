import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import '../pageStyles/ContactUs.css';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call for form submission
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(null), 4000);
    }, 1000);
  };

  return (
    <>
      <PageTitle title="Contact Us | Select Dresses" />
      <Navbar />

      <div className="contact-page">
        <div className="contact-container">
          
          {/* Left Side: Contact Info */}
          <div className="contact-info-side">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you. Whether you have a question about our clothing, shipping, or need styling advice, our team is ready to answer all your questions.</p>
            
            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">
                  <LocationOnOutlinedIcon />
                </div>
                <div className="info-details">
                  <h3>Our Store</h3>
                  <p>123 Fashion Avenue</p>
                  <p>Mumbai, Maharashtra 400001</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <PhoneOutlinedIcon />
                </div>
                <div className="info-details">
                  <h3>Call Us</h3>
                  <p>+91 98765 43210</p>
                  <p>Mon - Sat, 10:00 AM - 7:00 PM</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <EmailOutlinedIcon />
                </div>
                <div className="info-details">
                  <h3>Email Us</h3>
                  <p>hello@selectdresses.com</p>
                  <p>support@selectdresses.com</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon"><InstagramIcon /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon"><FacebookIcon /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon"><TwitterIcon /></a>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="contact-form-side">
            <div className="contact-form">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we will get back to you within 24 hours.</p>

              {status === 'success' && (
                <div style={{ background: '#F0FFF4', color: '#276749', padding: '1rem', border: '1px solid #C6F6D5', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Thank you! Your message has been sent successfully. We will get back to you shortly.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group-contact">
                    <label>Your Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                  </div>
                  <div className="form-group-contact">
                    <label>Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                  </div>
                </div>

                <div className="form-group-contact">
                  <label>Subject</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help you?" />
                </div>

                <div className="form-group-contact">
                  <label>Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Write your message here..."></textarea>
                </div>

                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default ContactUs;
