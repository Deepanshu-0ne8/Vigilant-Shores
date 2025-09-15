import React from 'react';
import './Home.css';
import { FaRocket, FaCog, FaShieldAlt, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import Navbar from './Navbar';
import { Link } from 'react-router';

// Data for the features section - easy to update
const features = [
  {
    icon: <FaRocket />,
    title: 'Fast & Efficient',
    description: 'Optimized for performance to deliver a smooth and snappy user experience.',
  },
  {
    icon: <FaCog />,
    title: 'Highly Customizable',
    description: 'Easily adapt and configure the platform to meet your specific needs.',
  },
  {
    icon: <FaShieldAlt />,
    title: 'Secure & Reliable',
    description: 'Built with security in mind to protect your data at all times.',
  },
];

const Home = () => {
  return (
    <>
    <Navbar />
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Our Platform</h1>
          <p className="hero-subtitle">
            The ultimate solution for modern development, designed for collaboration and scale.
          </p>
          <button className="cta-button primary">Get Started for Free</button>
        </div>
      </header>

      <main>
        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
            <h2>Ready to Dive In?</h2>
            <p>Join thousands of developers and start building today.</p>
            <Link to="/signup">
            <button className="cta-button secondary">Sign Up Now</button>
            </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="home-footer">
          <p>&copy; {new Date().getFullYear()} Your Company. All Rights Reserved. | Prayagraj, India</p>
          <div className="social-links flex items-center">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
      </footer>
    </div>
    </>
  );
};

export default Home;