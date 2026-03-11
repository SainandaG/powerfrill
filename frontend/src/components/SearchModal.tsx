import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productsData } from '../data/products';
import { hubContent } from '../data/hubContent';
import './SearchModal.css';

interface SearchResult {
    id: string;
    title: string;
    subtitle?: string;
    category: 'Product' | 'Technical Hub' | 'Navigation';
    path: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const navLinks = [
    { id: 'products', label: 'Products', sub: 'Manufacturing · Sales · Rentals', path: '/products' },
    { id: 'bess', label: 'BESS', sub: 'Grid-Scale Storage · Smart EMS', path: '/hub/bess-info' },
    { id: 'application', label: 'Application', sub: 'Engineering · Custom Solutions', path: '/hub/application' },
    { id: 'innovation', label: 'Innovation', sub: 'R&D · SiC Tech · Patents', path: '/hub/innovation' },
    { id: 'about', label: 'About', sub: 'Our Mission · Global Fleet · Reach', path: '/hub/about' },
];

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const q = query.toLowerCase();
        const newResults: SearchResult[] = [];

        // Search Products
        productsData.forEach(p => {
            if (p.title.toLowerCase().includes(q) ||
                p.subtitle.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.brief.toLowerCase().includes(q) ||
                p.industryTags.some(t => t.toLowerCase().includes(q)) ||
                p.technologyTags.some(t => t.toLowerCase().includes(q)) ||
                p.applicationTags.some(t => t.toLowerCase().includes(q)) ||
                Object.entries(p.specifications).some(([key, val]) =>
                    key.toLowerCase().includes(q) || val.toLowerCase().includes(q))) {
                newResults.push({
                    id: p.id,
                    title: p.title,
                    subtitle: p.subtitle,
                    category: 'Product',
                    path: `/${p.menuId}/${p.groupId}/${p.categoryId}/${p.slug}`
                });
            }
        });

        // Search Hub Content
        Object.entries(hubContent).forEach(([id, content]) => {
            if (content.introduction.toLowerCase().includes(q) ||
                content.objective.toLowerCase().includes(q) ||
                content.specializedInformation.toLowerCase().includes(q) ||
                content.features.some(f => f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)) ||
                content.services?.some(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.capabilities.some(c => c.toLowerCase().includes(q)))) {
                newResults.push({
                    id: id,
                    title: content.introduction.split('//')[0].trim() || id,
                    subtitle: content.objective.substring(0, 100) + '...',
                    category: 'Technical Hub',
                    path: `/hub/${id}`
                });
            }
        });

        // Search Nav Links
        navLinks.forEach(link => {
            if (link.label.toLowerCase().includes(q) || link.sub.toLowerCase().includes(q)) {
                newResults.push({
                    id: link.id,
                    title: link.label,
                    subtitle: link.sub,
                    category: 'Navigation',
                    path: link.path
                });
            }
        });

        setResults(newResults.slice(0, 8)); // Limit to first 8 results
    }, [query]);

    const handleResultClick = (path: string) => {
        navigate(path);
        onClose();
        setQuery('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="search-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="search-backdrop" onClick={onClose} />

                    <motion.div
                        className="search-container"
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <div className="search-header">
                            <div className="search-input-wrapper">
                                <svg viewBox="0 0 24 24" className="search-icon-svg">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search anything about Powerfrill..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                {query && (
                                    <button className="clear-search" onClick={() => setQuery('')}>×</button>
                                )}
                            </div>
                            <button className="close-search-modal" onClick={onClose}>ESC</button>
                        </div>

                        <div className="search-body">
                            {results.length > 0 ? (
                                <div className="search-results">
                                    {results.map((result, idx) => (
                                        <motion.div
                                            key={`${result.category}-${result.id}-${idx}`}
                                            className="search-result-item"
                                            onClick={() => handleResultClick(result.path)}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <div className="result-category">{result.category}</div>
                                            <div className="result-main">
                                                <h4 className="result-title">{result.title}</h4>
                                                {result.subtitle && <p className="result-subtitle">{result.subtitle}</p>}
                                            </div>
                                            <div className="result-arrow">→</div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : query ? (
                                <div className="search-no-results">
                                    <p>No matches for "<strong>{query}</strong>"</p>
                                    <span>Try searching for 'BESS', 'Solar', or 'Innovation'</span>
                                </div>
                            ) : (
                                <div className="search-suggestions">
                                    <p>Try searching for...</p>
                                    <div className="suggestion-tags">
                                        {['BESS', 'Solar', 'SiC', 'Grid', 'Engineering'].map(tag => (
                                            <button key={tag} onClick={() => setQuery(tag)} className="suggestion-tag">
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="search-footer">
                            <div className="search-hint">
                                <span className="key-hint">↵</span> to select
                                <span className="key-hint">ESC</span> to close
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;
