import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { solutions, getCategoriesByGroupId, getGroupsByMenuId } from '../data/products';
import { hubContent } from '../data/hubContent';
import {
    BessFlowWidget,
    InnovationRoadmapWidget,
    MissionCounterWidget,
    ServiceMatrixWidget,
    HubBackgroundVisuals,
    CarTechnicalLogo
} from './HubWidgets';
import HighFidelityBess3D from './HighFidelityBess3D';
import InnovationSplineVisual from './InnovationSplineVisual';
import ExplodedBessCabinet from './ExplodedBessCabinet';
import './SolutionDetail.css';
import BESSNetworkDiagram from './BESSNetworkDiagram';

const AnatomyScrollSection: React.FC<{ staticData: any }> = ({ staticData }) => {
    return (
        <div className="hub-anatomy-frame-container" style={{ height: '100vh', marginBottom: '0', position: 'relative', background: 'transparent' }}>
            <div style={{ width: '100%', height: '100%' }}>
                <HighFidelityBess3D accent={staticData?.accent} />
            </div>

            <div className="anatomy-hud-container">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="anatomy-kpi-card"
                >
                    <div className="kpi-header">
                        <span className="kpi-eyebrow">TECHNICAL SPECIFICATIONS</span>
                        <h3 className="kpi-title">
                            POWERFRILL <span className="accent">LFP-2400</span>
                        </h3>
                    </div>

                    <div className="kpi-grid">
                        <div className="kpi-item">
                            <span className="kpi-label">Nominal Voltage</span>
                            <span className="kpi-value">768 VDC</span>
                        </div>
                        <div className="kpi-item">
                            <span className="kpi-label">Capacity</span>
                            <span className="kpi-value">280 Ah</span>
                        </div>
                        <div className="kpi-item">
                            <span className="kpi-label">Lifecycle</span>
                            <span className="kpi-value">6,000+</span>
                        </div>
                        <div className="kpi-item">
                            <span className="kpi-label">Chemistry</span>
                            <span className="kpi-value accent">LiFePO₄</span>
                        </div>
                    </div>

                    <div className="kpi-footer">
                        <span className="status-label">SYSTEM STATUS</span>
                        <span className="status-value">● NOMINAL</span>
                    </div>
                </motion.div>
            </div>

            <div style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'radial-gradient(circle at center, transparent 40%, #000000 90%)'
            }} />
        </div>
    );
};

const SolutionDetail: React.FC = () => {
    const { solutionId } = useParams<{ solutionId: string }>();
    const solution = solutions.find(s => s.id === solutionId);
    const menuGroups = getGroupsByMenuId(solutionId || '');
    const staticData = hubContent[solutionId || ''];

    React.useEffect(() => {
        const isLight = solutionId === 'about';
        window.dispatchEvent(new CustomEvent('heroThemeChange', { detail: { isLight } }));
        return () => {
            window.dispatchEvent(new CustomEvent('heroThemeChange', { detail: { isLight: false } }));
        };
    }, [solutionId]);

    if (!solution && !staticData) {
        return (
            <div className="error-page" style={{ textAlign: 'center', paddingTop: '200px' }}>
                <h1 style={{ color: '#ffffff' }}>Solution Hub Not Found</h1>
                <Link to="/products" style={{ color: '#3b82f6' }}>← Back to Portfolio</Link>
            </div>
        );
    }

    return (
        <div
            className="solution-detail-page"
            style={{
                '--hub-accent': staticData?.accent || '#ffffff',
                '--hub-accent-rgb': staticData?.accent === '#ffcc00' ? '255, 204, 0' :
                    staticData?.accent === '#00ffcc' ? '0, 255, 204' :
                        staticData?.accent === '#ff6600' ? '255, 102, 0' : '255, 0, 102'
            } as React.CSSProperties}
        >
            {solutionId === 'bess-info' && (
                <video autoPlay muted loop playsInline className="hub-video-background"
                    style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.6 }}>
                    <source src="/assets/hero-bg.mp4" type="video/mp4" />
                </video>
            )}

            {staticData && <HubBackgroundVisuals accent={staticData.accent} />}

            <section className="solution-hero" style={{ backgroundImage: solution?.heroImage ? `url(${solution.heroImage})` : 'none' }}>
                <div className="solution-hero-overlay">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="hero-label-wrap">
                        <span className="hero-label-line" />
                        <span className="hero-label-text">POWERFILL</span>
                    </motion.div>

                    <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="solution-hero-title">
                        {staticData ? staticData.id.toUpperCase() : solution?.title}
                    </motion.h1>

                    {(() => {
                        const subtitles: Record<string, { sub: string; desc: string }> = {
                            'bess-info': {
                                sub: 'GRID-SCALE INFRASTRUCTURE · OPERATIONAL RESILIENCE',
                                desc: 'Industrial Battery Energy Storage Systems (BESS) engineered for utility-scale stability. Our solutions automate frequency regulation, eliminate intermittent renewable clipping, and provide high-availability backup for strategic energy sectors.'
                            },
                            'application': {
                                sub: 'ENGINEERING ADVISORY · SITE ARCHITECTURE',
                                desc: 'End-to-end technical stewardship for complex energetic deployments. We specialize in custom modular integration, site-hardening for extreme environments, and high-voltage grid synchronization.'
                            },
                            'innovation': {
                                sub: 'GEN-4 ARCHITECTURE · SILICON CARBIDE (SiC) EVOLUTION',
                                desc: 'Pioneering the next decade of power conversion. Our R&D focuses on ultra-fast switching SiC semiconductor stacks, solid-state electrode integration, and decentralized AI grid kernels.'
                            },
                            'about': {
                                sub: 'GLOBAL MANDATE · CORPORATE ESG',
                                desc: 'Engineering the technical substrate of the global energy transition. Powerfrill is a vertically integrated provider of mission-critical energy hardware, operating across 42 strategic industrial regions.'
                            },
                        };
                        const id = staticData?.id || '';
                        const entry = subtitles[id];
                        if (!entry) return null;
                        return (
                            <>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="hero-sub-strip">
                                    {entry.sub.split(' · ').map((part, i) => (
                                        <React.Fragment key={i}>{i > 0 && <span className="dot"> · </span>}{part}</React.Fragment>
                                    ))}
                                </motion.div>
                                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                                    style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '600px', marginTop: '1.5rem', fontFamily: 'var(--font-main)' }}>
                                    {entry.desc}
                                </motion.p>
                            </>
                        );
                    })()}
                </div>
            </section>

            <div className="container">
                <div className="hub-header-nav">
                    <Link to="/products" className="hub-back-button"><span className="arrow">←</span><span className="text">Back to Portfolio</span></Link>
                    <nav className="industrial-breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><Link to="/products">Portfolio</Link><span className="sep">›</span><span className="active-crumb">{staticData ? staticData.id.toUpperCase() : solution?.title}</span>
                    </nav>
                </div>
            </div>

            {staticData && (
                <>
                    <div className="container" style={{ paddingBottom: '0' }}>
                        <div className="hub-intro-box">
                            <span className="narrative-label">Engineering Narrative</span>
                            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="hub-objective">Technical Description</motion.h2>
                            <p className="hub-specialized-info">{staticData.objective}</p>
                            {staticData.specializedInformation && (
                                <p className="hub-specialized-info" style={{ marginTop: '2.5rem', opacity: 0.6, fontSize: '1.25rem' }}>{staticData.specializedInformation}</p>
                            )}
                        </div>

                        {staticData.stats && (
                            <div className="hub-stats-bar" style={{ marginBottom: '4rem' }}>
                                {staticData.stats.map((stat, i) => (
                                    <motion.div key={i} className="hub-stat-card" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                        <div className="hub-stat-value">{stat.val}</div>
                                        <div className="hub-stat-label">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                        {staticData.id === 'application' && <BESSNetworkDiagram />}
                    </div>

                    {staticData.id === 'bess-info' && <AnatomyScrollSection staticData={staticData} />}

                    {staticData.id === 'bess-info' && (
                        <div className="container">
                            <section className="hub-innovation-core-section" style={{ marginTop: '4rem', borderTop: '1px solid rgba(255,102,0,0.1)', paddingTop: '4rem' }}>
                                <div className="sub-heading-strip"><span className="dot">●</span><span>TECHNICAL INNOVATION CORE</span></div>
                                <h3 className="section-title" style={{ marginBottom: '2rem' }}>Thermal Management & Cell Dynamics</h3>
                                <p className="hub-specialized-info" style={{ marginBottom: '3rem' }}>
                                    Experience the procedural thermal mapping and cell balancing dynamics of the Powerfrill BESS core.
                                </p>
                                <InnovationSplineVisual />
                            </section>
                        </div>
                    )}

                    {staticData.id === 'bess-info' && (
                        <section className="hub-cinematic-inspection" style={{ position: 'relative' }}>
                            <div className="immersive-3d-journey" style={{ height: '120vh', position: 'relative' }}>
                                <div className="sticky-3d-pin" style={{ position: 'sticky', top: 0, height: '100vh', width: '100vw', left: 0, overflow: 'hidden' }}>
                                    <ExplodedBessCabinet accent={staticData.accent} />
                                </div>
                            </div>
                        </section>)}</>)}

            <div className="container">
                {staticData && (
                    <div className="hub-main-layout">
                        <div className="hub-content-primary">
                            <span className="narrative-label">Core Advantages</span>
                            <div className="sub-heading-strip">
                                {staticData.id === 'about' ? (
                                    <><span>Mission</span><span className="dot">·</span><span>Contact Information</span><span className="dot">·</span><span>Operations</span></>
                                ) : (
                                    <><span>Integrated</span><span className="dot">·</span><span>Scalable</span><span className="dot">·</span><span>Secure</span></>
                                )}
                            </div>

                            {staticData.features && (
                                <section className="hub-services-grid-wrap">
                                    <div className="hub-features-grid">
                                        {staticData.features.map((feature, i) => (
                                            <div key={i} className="hub-feature-card">
                                                <h4 className="card-title">{feature.title}</h4>
                                                <p className="card-desc">{feature.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {staticData.services && (
                                <section className="hub-services-section">
                                    <h3 className="group-section-heading">Engineering Services</h3>
                                    <div className="services-list">
                                        {staticData.services.map((service, i) => (
                                            <div key={i} className="service-row">
                                                <div className="service-info">
                                                    <h4>{service.title}</h4>
                                                    <p>{service.description}</p>
                                                </div>
                                                <div className="service-capabilities">
                                                    {service.capabilities.map((cap, ci) => (
                                                        <span key={ci} className="capability-tag">{cap}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        <aside className="hub-sidebar-widgets">
                            {staticData.id === 'bess-info' && <BessFlowWidget />}
                            {staticData.id === 'innovation' && <InnovationRoadmapWidget />}
                            {staticData.id === 'about' && (
                                <>
                                    <CarTechnicalLogo />
                                    <MissionCounterWidget />
                                </>
                            )}
                            {staticData.id === 'application' && <ServiceMatrixWidget />}
                        </aside>
                    </div>
                )}

                {menuGroups.length > 0 && !staticData && (
                    <section className="solution-content">
                        {menuGroups.map((group, groupIndex) => {
                            const groupCategories = getCategoriesByGroupId(group.id);
                            if (groupCategories.length === 0) return null;
                            return (
                                <div key={group.id} className="solution-group-section">
                                    <motion.h2 className="group-section-heading" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: groupIndex * 0.1 }}>
                                        {group.name}<div className="heading-accent" />
                                    </motion.h2>
                                    <div className="category-grid">
                                        {groupCategories.map((category, catIndex) => (
                                            <motion.div key={category.id} className="category-hover-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (groupIndex * 0.2) + (catIndex * 0.1) }}>
                                                <Link to={`/category/${category.id}`} className="hover-card-anchor">
                                                    <div className="hover-card-visual"><img src={category.image} alt={category.name} className="hover-card-img" /></div>
                                                    <div className="hover-card-body">
                                                        <h3 className="hover-card-title">{category.name}</h3>
                                                        <p className="hover-card-desc">{category.description}</p>
                                                        <div className="hover-card-footer"><span>EXPLORE MODULE</span><span className="arrow">→</span></div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}
            </div>
        </div>
    );
};

export default SolutionDetail;