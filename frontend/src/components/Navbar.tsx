import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import './Navbar.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import MenuBackground from './MenuBackground';

const logo = '/assets/powerfrill-logo.png';
// Color logo asset is currently overridden by a different image in public/assets
// Using CSS inversion on the main logo instead.


const navLinks = [
    { id: 'products', label: 'Products', sub: 'Manufacturing · Sales · Rentals', path: '/products', type: 'link' },
    { id: 'bess', label: 'BESS', sub: 'Grid-Scale Storage · Smart EMS', path: '/hub/bess-info', type: 'link' },
    { id: 'application', label: 'Application', sub: 'Engineering · Custom Solutions', path: '/hub/application', type: 'link' },
    { id: 'innovation', label: 'Innovation', sub: 'R&D · SiC Tech · Patents', path: '/hub/innovation', type: 'link' },
    { id: 'about', label: 'About', sub: 'Our Mission · Global Fleet · Reach', path: '/hub/about', type: 'link' }
];

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHeroLight, setIsHeroLight] = useState(false);
    const navigate = useNavigate();
    const { cartItems, cartCount, removeFromCart, clearCart } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const location = useLocation();
    const menuRef = useRef<HTMLDivElement>(null);

    // GSAP Entrance Animation
    useEffect(() => {
        if (isMenuOpen && menuRef.current) {
            const items = menuRef.current.querySelectorAll('.menu-item');
            gsap.fromTo(items,
                {
                    opacity: 0,
                    x: -30
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power2.out",
                    delay: 0.3
                }
            );
        }
    }, [isMenuOpen]);

    const handleNavClick = (id: string, type: string, path?: string) => {
        setIsMenuOpen(false);

        // Navigation Redundancy Guard - Robust normalization
        const normalize = (p: string) => p.replace(/\/$/, '') || '/';
        const currentPath = normalize(location.pathname);
        const targetPath = path ? normalize(path) : null;

        if (type === 'link' && targetPath === currentPath) return;

        if (type === 'link' && path) {
            navigate(path);
            window.scrollTo(0, 0);
        } else {
            if (location.pathname !== '/') {
                navigate('/', { state: { scrollTo: id } });
            } else {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    // Listen for Hero theme changes (dynamic logo/theme adaptivity)
    useEffect(() => {
        const handleHeroTheme = (e: any) => {
            setIsHeroLight(e.detail.isLight);
        };
        window.addEventListener('heroThemeChange', handleHeroTheme);
        return () => window.removeEventListener('heroThemeChange', handleHeroTheme);
    }, []);

    // Handle scroll on mount if navigating back to home
    React.useEffect(() => {
        if (location.state && (location.state as any).scrollTo) {
            const id = (location.state as any).scrollTo;
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
                // Clear state
                navigate(location.pathname, { replace: true, state: {} });
            }, 100);
        }
    }, [location, navigate]);

    // Handle body scroll lock and global blur
    React.useEffect(() => {
        let isScrolledVal = false;
        let ticking = false;

        const handleScroll = () => {
            isScrolledVal = window.scrollY > 50;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(isScrolledVal);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isLightPage =
        location.pathname === '/checkout' ||
        location.pathname === '/products' ||
        location.pathname.includes('/product/') ||
        (location.pathname === '/' && isHeroLight);

    // Intelligent logo selection: Use CSS filter inversion on light pages instead of the corrupted color logo asset
    const logoSrc = logo;

    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            <header className={`header ${isMenuOpen ? 'menu-open' : ''} ${isLightPage ? 'is-light' : ''} ${isScrolled ? 'is-scrolled' : ''} ${location.pathname === '/products' ? 'is-products-page' : ''}`}>

                <div className="header-container">
                    <div className="header-left-section">
                        {location.pathname !== '/' && (
                            <div className="nav-back-wrapper">
                                <button
                                    className="global-back-nav"
                                    onClick={() => navigate(-1)}
                                    aria-label="Go back"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="19" y1="12" x2="5" y2="12"></line>
                                        <polyline points="12 19 5 12 12 5"></polyline>
                                    </svg>
                                    <span className="back-text">BACK</span>
                                </button>
                            </div>
                        )}
                        {location.pathname !== '/products' && (
                            <div className="logo-wrapper">
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        if (location.pathname === '/') {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        } else {
                                            navigate('/');
                                            window.scrollTo(0, 0);
                                        }
                                    }}
                                >
                                    <img src={logoSrc} alt="Powerfrill" className="logo-img" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="header-actions">
                        <button
                            className="theme-toggle-btn"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? (
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </svg>
                            )}
                        </button>
                        <div className="user-action-group">
                            {user ? (
                                <div className="user-profile-menu">
                                    <button className="account-icon-btn" onClick={() => navigate('/login')}>
                                        <div className="avatar-mini">{user.full_name?.[0] || user.email[0].toUpperCase()}</div>
                                    </button>
                                    <button className="logout-btn-nav" onClick={logout} title="Sign Out">
                                        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor" /></svg>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="login-icon-btn"
                                    onClick={() => {
                                        if (location.pathname === '/login') {
                                            navigate(-1);
                                        } else {
                                            navigate('/login');
                                        }
                                    }}
                                    aria-label={location.pathname === '/login' ? "Close Login" : "Sign In"}
                                >
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <button
                            className="cart-button"
                            onClick={() => setIsCartOpen(true)}
                            aria-label="Open Cart"
                        >
                            <svg viewBox="0 0 24 24" className="cart-icon">
                                <path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-7-4h10l2-8H7l-1-4H3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </button>
                        <button
                            className={`menu-button ${isMenuOpen ? 'active' : ''}`}
                            onClick={() => { setIsMenuOpen(!isMenuOpen); setIsCartOpen(false); }}
                            aria-label="Toggle Menu"
                        >
                            <div className="menu-bars">
                                <span className="bar" />
                                <span className="bar" />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Cart Drawer */}
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)} />
                <div className="cart-drawer-content">
                    <div className="cart-header">
                        <h2>QUOTATION LIST</h2>
                        <button className="close-cart" onClick={() => setIsCartOpen(false)}>×</button>
                    </div>

                    <div className="cart-items">
                        {cartItems.length === 0 ? (
                            <div className="empty-cart">
                                <p>No technical systems selected for quotation.</p>
                                <button className="explore-btn" onClick={() => { setIsCartOpen(false); navigate('/products'); }}>Explore Products</button>
                            </div>
                        ) : (
                            <>
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <img src={item.image} alt={item.title} className="cart-item-img" />
                                        <div className="cart-item-info">
                                            <h3>{item.title}</h3>
                                            <p>{item.subtitle}</p>
                                            <div className="cart-item-actions">
                                                <span>Qty: {item.quantity}</span>
                                                <button onClick={() => removeFromCart(item.id)}>Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="cart-footer">
                                    <button className="checkout-btn" onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}>
                                        PROCEED TO QUOTATION
                                    </button>
                                    <button className="clear-btn" onClick={clearCart}>Clear All</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div ref={menuRef} className={`fullscreen-menu ${isMenuOpen ? 'open' : ''}`}>
                <MenuBackground />
                <div className="menu-overlay" />
                <div className="menu-scanlines" />

                <nav className="menu-content">
                    {navLinks.map((link, index) => (
                        <button
                            key={link.id}
                            className="menu-item"
                            onClick={() => handleNavClick(link.id, link.type, link.path)}
                        >
                            <span className="menu-item-num">0{index + 1}</span>
                            <div className="menu-item-bar" />
                            <div className="menu-item-text-group">
                                <span className="menu-item-label">{link.label}</span>
                                <span className="menu-item-sub">{link.sub}</span>
                            </div>
                        </button>
                    ))}
                </nav>

                <div className="menu-scene-label">Solar · Wind · BESS · EV · Grid</div>

                <div className="menu-bottom-tag">
                    <span className="menu-btag-text">Powering Every Mile — Every Vehicle — Every Future</span>
                </div>
            </div>
        </>
    );
};

export default Navbar;
