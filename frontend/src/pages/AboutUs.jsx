import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import '../pageStyles/AboutUs.css';

function AboutUs() {
  return (
    <>
      <PageTitle title="About Us | Select Dresses" />
      <Navbar />

      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1 className="about-hero-title">Redefining Elegance</h1>
            <p className="about-hero-subtitle">
              At Select Dresses, we believe that modern luxury shouldn't be out of reach. 
              We craft exquisite, timeless pieces designed to make every occasion memorable.
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="about-content">
          <div className="about-section">
            <div className="about-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop" 
                alt="Our craftsmanship" 
                className="about-image" 
              />
            </div>
            <div className="about-text">
              <h2>Artisan Craftsmanship</h2>
              <p>
                Every garment at Select Dresses is a testament to the skill of our master tailors. 
                We source only the finest fabrics from sustainable mills around the world, ensuring 
                that each piece not only looks beautiful but feels luxurious against your skin.
              </p>
              <p>
                From intricate hand-embroidery to precision cutting, we pay attention to the smallest 
                details because we know that true elegance lives in the nuances.
              </p>
            </div>
          </div>

          <div className="about-section">
            <div className="about-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=800&auto=format&fit=crop" 
                alt="Our philosophy" 
                className="about-image" 
              />
            </div>
            <div className="about-text">
              <h2>The Modern Aesthetic</h2>
              <p>
                Our design philosophy brings together classic silhouettes and contemporary, minimalist 
                aesthetics. We create versatile clothing that easily transitions from the boardroom 
                to evening galas.
              </p>
              <p>
                By avoiding transient trends, we ensure that a Select Dresses outfit remains a staple 
                in your wardrobe for years to come. It’s not just fashion; it’s an investment in your 
                personal style.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="about-values">
          <div className="values-container">
            <h2 className="values-title">Our Core Values</h2>
            <div className="values-grid">
              <div className="value-item">
                <div className="value-icon">🌿</div>
                <h3>Sustainability</h3>
                <p>Committed to ethical production methods and 100% eco-friendly packaging for a better tomorrow.</p>
              </div>
              <div className="value-item">
                <div className="value-icon">✨</div>
                <h3>Quality Above All</h3>
                <p>Never compromising on the fabrics, the stitching, or the final finish of any garment we produce.</p>
              </div>
              <div className="value-item">
                <div className="value-icon">🤝</div>
                <h3>Customer First</h3>
                <p>Providing impeccable service, from intuitive online navigation to seamless delivery and support.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default AboutUs;
