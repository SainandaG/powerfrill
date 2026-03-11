import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <img src="/assets/powerfrill-logo.png" alt="Powerfrill" className="footer-logo" />
                <div className="footer-locations">
                    <a href="https://maps.google.com/?q=Hyderabad" target="_blank" rel="noopener noreferrer" className="footer-location-link">
                        📍 Hyderabad
                    </a>
                    <span className="location-divider">|</span>
                    <a href="https://maps.google.com/?q=Bangalore" target="_blank" rel="noopener noreferrer" className="footer-location-link">
                        📍 Bangalore
                    </a>
                </div>
                <p className="footer-text">&copy; {new Date().getFullYear()} Powerfrill. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
