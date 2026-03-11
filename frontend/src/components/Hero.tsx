import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "./Footer.tsx";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);


// --- Sections Data ---

const sections = [
    {
        id: "01",
        label: "BESS",
        title: "BESS",
        subtitle: "GRID-SCALE STORAGE · WHAT & HOW",
        description: "Advanced energy storage systems that capture power from renewables or the grid and redeploy it during peak demand. Our BESS solutions balance fluctuating loads, provide mission-critical backup, and ensure a stable frequency for utility networks worldwide.",
        accent: "#ff6600",
        stats: [
            { val: "800V", unit: "ARCH" },
            { val: "2.5MW+", unit: "DENSITY" },
            { val: "98%", unit: "EFF" },
        ],
        route: '/hub/bess-info',
        actionLabel: 'CHECK BESS PRODUCTS',
        bgImage: '/assets/hero-bess-bg.png',
        bgVideo: '/assets/bess-bg.mp4',
        isLight: false
    },
    {
        id: "02",
        label: "PRODUCTS",
        title: "PRODUCTS",
        subtitle: "MANUFACTURING · SALES · RENTALS",
        description: "From ISO-certified cell manufacturing to global hardware sales and flexible fleet rental programs, we provide the industrial backbone for EV infrastructure and mission-critical power delivery.",
        accent: "#00ccff",
        stats: [
            { val: "50K+", unit: "UNITS" },
            { val: "42", unit: "REGIONS" },
            { val: "FLEX", unit: "RENTAL" },
        ],
        route: '/products',
        actionLabel: 'EXPLORE PRODUCTS',
        bgImage: '/assets/hero-products-bg.png',
        bgVideo: '/assets/products-bg.mp4',
        isLight: false
    },
    {
        id: "03",
        label: "APPLICATION",
        title: "MONETIZATION",
        subtitle: "ENERGY TRADING · GRID BALANCING",
        description: "Transform your energy storage into a revenue-generating asset. Our advanced software seamlessly integrates with wholesale energy markets, automatically identifying and capitalizing on peak pricing opportunities, frequency regulation, and capacity markets.",
        accent: "#ffcc00",
        stats: [
            { val: "AI", unit: "TRADING" },
            { val: "24/7", unit: "ARBITRAGE" },
            { val: "ROI", unit: "MAXIMIZED" },
        ],
        route: '/hub/application',
        actionLabel: 'OUR SERVICES',
        bgImage: '/assets/hero-application-monetize-bg.png',
        bgVideo: '/assets/application-bg.mp4',
        isLight: false
    },
    {
        id: "04",
        label: "INNOVATION",
        title: "INNOVATION",
        subtitle: "FUTURE SCOPE · R&D ROADMAP",
        description: "Our future scope includes Gen-4 Silicon Carbide (SiC) power stacks, solid-state cell integration, and real-time AI grid balancing for the next decade of decentralized energy.",
        accent: "#00ffcc",
        stats: [
            { val: "18", unit: "PATENTS" },
            { val: "24/7", unit: "R&D" },
            { val: "GEN-3", unit: "SiC" },
            { val: "GEN-4", unit: "SiC" },
            { val: "SOLID", unit: "STATE" },
        ],
        route: '/hub/innovation',
        actionLabel: 'FUTURE TECH',
        bgImage: '/assets/hero-innovation-bg.png',
        isLight: false
    },
    {
        id: "05",
        label: "ABOUT",
        title: "ABOUT POWERFILL",
        subtitle: "GLOBAL LEADERSHIP · INDUSTRIAL SCALE",
        description: "PowerFill is a global leader in energy infrastructure, operating across 42 regions with a focus on mission-critical battery systems and grid monetization. We combine enterprise-grade hardware with intelligent software to participate in the world's most lucrative energy markets, ensuring maximum ROI and grid stability for a decentralized energy future.",
        accent: "#ff0066",
        stats: [
            { val: "42", unit: "REGIONS" },
            { val: "SECURE", unit: "TRANSACT" },
            { val: "24/7", unit: "MONITOR" },
        ],
        route: '/hub/about',
        actionLabel: 'OUR IDENTITY',
        bgImage: '/assets/hero-about-monetize-bg.png',
        isLight: false
    }
];





// --- Text Splitting Utils (Emo Energy Style) ---
const SplitChars = ({ children, className = "" }: { children: string, className?: string }) => {
    return (
        <span className={`split-chars-wrapper ${className}`} style={{ display: 'inline-block' }}>
            {children.split("").map((char, i) => (
                char === " " ? <span key={i} style={{ display: 'inline-block', width: '0.25em' }}>&nbsp;</span> :
                    <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
                        <span className="split-char" style={{ display: 'inline-block', transform: 'translateY(120%)', opacity: 0 }}>
                            {char}
                        </span>
                    </span>
            ))}
        </span>
    );
};

const SplitWords = ({ children, className = "" }: { children: string, className?: string }) => {
    return (
        <span className={`split-words-wrapper ${className}`} style={{ display: 'inline-block' }}>
            {children.split(" ").map((word, i) => (
                <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', marginRight: '0.25em' }}>
                    <span className="split-word" style={{ display: 'inline-block', transform: 'translateY(120%)', opacity: 0 }}>
                        {word}
                    </span>
                </span>
            ))}
        </span>
    );
};

const Hero: React.FC = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(0);
    const [hoveredSection, setHoveredSection] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);


    // Emit event for Navbar color adjustment
    useEffect(() => {
        const event = new CustomEvent('heroThemeChange', {
            detail: { isLight: sections[activeSection]?.isLight || false }
        });
        window.dispatchEvent(event);
    }, [activeSection]);

    // GSAP Scroll Animations
    useGSAP(() => {
        const sectionElements = gsap.utils.toArray<HTMLElement>('.hero-scroll-section');

        sectionElements.forEach((sec, i) => {
            // Emo Energy style text reveal: fade up and staggered characters and words
            const charEls = sec.querySelectorAll('.split-char');
            const wordEls = sec.querySelectorAll('.split-word');
            const otherEls = sec.querySelectorAll('.rimac-stats, .rimac-cta-wrapper');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sec,
                    scroller: containerRef.current,
                    start: "top 60%", // Start revealing when section is 60% in view
                    toggleActions: "play none none reverse" // Play forward on enter, reverse on leave back
                }
            });

            if (charEls.length) {
                // Snappy ease for technical Rimac/Emo Energy feel
                tl.to(charEls, { y: '0%', opacity: 1, duration: 0.8, stagger: 0.02, ease: "power4.out" }, 0);
            }
            if (wordEls.length) {
                tl.to(wordEls, { y: '0%', opacity: 1, duration: 0.8, stagger: 0.015, ease: "power3.out" }, 0.15);
            }
            if (otherEls.length) {
                tl.fromTo(otherEls, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.4);
            }

            // Trigger active section for Nav Dots and Background Image Opacity logic
            ScrollTrigger.create({
                trigger: sec,
                scroller: containerRef.current,
                start: "top 50%",
                onEnter: () => {
                    if (i < sections.length) setActiveSection(i);
                },
                onEnterBack: () => {
                    if (i < sections.length) setActiveSection(i);
                }
            });
        });
    }, { scope: containerRef });

    const goToSection = (index: number) => {
        const container = containerRef.current;
        if (!container) return;
        container.scrollTo({
            top: index * window.innerHeight,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <div
                ref={containerRef}
                className="hero-page-rimac-v2"
                style={{
                    overflowY: 'auto',
                    scrollSnapType: 'y mandatory',
                    height: '100dvh'
                }}
            >
                {/* Ambient Background Images with Parallax & Scale Effect */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundColor: '#050505' }}>
                    {sections.map((s, i) => {
                        const isActive = activeSection === i;
                        return (
                            <div
                                key={`bg-content-${i}`}
                                className="hero-background-layer"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: isActive ? 0.85 : 0,
                                    transform: isActive ? 'scale(1)' : 'scale(1.1)',
                                    filter: 'brightness(0.7) contrast(1.1)',
                                    transition: 'opacity 1.2s cubic-bezier(0.25, 0.1, 0.25, 1), transform 1.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
                                }}
                            >
                                {(s as any).bgVideo ? (
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        poster={s.bgImage}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    >
                                        <source src={(s as any).bgVideo} type="video/mp4" />
                                    </video>
                                ) : (
                                    s.bgImage && (
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                backgroundImage: `url(${s.bgImage})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Scrollable Content Layers */}
                {sections.map((s, i) => (
                    <div
                        key={`scroll-sec-${i}`}
                        className="hero-scroll-section"
                        style={{ scrollSnapAlign: 'start', position: 'relative' }}
                    >
                        <div className="rimac-content-container layout-center">
                            <>
                                <div className="rimac-eyebrow">
                                    <SplitChars>{`0${i + 1}`}</SplitChars> <SplitChars>{s.label}</SplitChars>
                                </div>
                                <h2 className="rimac-title">
                                    <SplitChars>{s.title}</SplitChars>
                                </h2>
                                <p className="rimac-description">
                                    <SplitWords>{s.description}</SplitWords>
                                </p>

                                {s.stats && (
                                    <div className="rimac-stats-wrapper">
                                        <div className="rimac-stats">
                                            {s.stats.map((st, si) => (
                                                <div key={si} className="rimac-stat">
                                                    <span className="rimac-stat-val">{st.val}</span>
                                                    <span className="rimac-stat-unit">{st.unit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>

                            <div className="rimac-cta-wrapper">
                                <button
                                    className="rimac-explore-btn"
                                    onClick={() => navigate(s.route)}
                                >
                                    <span className="btn-line left" />
                                    <span className="btn-text">EXPLORE</span>
                                    <span className="btn-line right" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="hero-scroll-section hide-desktop footer-mobile-wrapper" style={{ height: 'auto', scrollSnapAlign: 'end' }}>
                    <Footer />
                </div>

                <div className="hero-grid-overlay" style={{ zIndex: 1, position: 'fixed' }} />
            </div>

            {/* Static UI - Fixed overlays placed OUTSIDE container for maximum stability */}
            <nav className="hero-side-scroller-nav" style={{ position: 'fixed' }}>
                {sections.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => goToSection(i)}
                        onMouseEnter={() => setHoveredSection(i)}
                        onMouseLeave={() => setHoveredSection(null)}
                        className={`hero-nav-dot-item ${activeSection === i ? 'is-active' : ''} ${hoveredSection === i ? 'is-hovered' : ''}`}
                        style={{
                            backgroundColor: activeSection === i || hoveredSection === i ? `${s.accent}20` : 'transparent',
                            borderColor: activeSection === i || hoveredSection === i ? `${s.accent}40` : 'transparent',
                            transform: activeSection === i || hoveredSection === i ? 'scale(1.05)' : 'scale(1)'
                        }}
                    >
                        <div className="hero-nav-dot-line" style={{ background: activeSection === i || hoveredSection === i ? s.accent : 'var(--text-secondary)', opacity: activeSection === i || hoveredSection === i ? 1 : 0.5 }} />
                        <span className="hero-nav-dot-label" style={{ color: activeSection === i ? s.accent : hoveredSection === i ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                            {s.id} {s.label}
                        </span>
                    </button>
                ))}
            </nav>

            {/* Scroll Indicator & Mobile Bottom Dock */}
            <div className="rimac-scroll-indicator">
                <div className="scroll-line" />
                <div className="mobile-scroll-preview hide-desktop">
                    {activeSection < sections.length - 1 ? (
                        <>
                            <span className="msp-text">SCROLL TO</span>
                            <span className="msp-label">{sections[activeSection + 1].label}</span>
                        </>
                    ) : (
                        <span className="msp-text">REACHED END</span>
                    )}
                </div>
            </div>



            <div className="hero-bottom-navigator" style={{ position: 'fixed' }}>
                <div className="hero-nav-bullets">
                    {sections.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToSection(i)}
                            className="hero-nav-bullet"
                            style={{
                                width: activeSection === i ? 24 : 6,
                                background: activeSection === i ? (sections[i]?.accent || "#ffffff") : "rgba(255, 255, 255, 0.15)"
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Social Dock - Fixed on bottom right (vertical on desktop, horizontal on mobile) */}
            <div className="hero-social-dock">
                <div className="rimac-social-links hsd-social-icons">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="rsl-link instagram hsd-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="rsl-link linkedin hsd-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </a>
                </div>
                <div className="hsd-scroll-text hide-mobile">SCROLL TO DISCOVER</div>
            </div>
        </>
    );
};


export default Hero;
