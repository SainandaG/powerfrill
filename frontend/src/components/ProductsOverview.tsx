import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { productsData } from '../data/products';
import ProductCard from './ProductCard';
import './ProductsOverview.css';

// ─── Category Metadata ─────────────────────────────────────────────────────────
const MAIN_CATEGORIES = [
    { id: 'all', label: 'All Solutions', icon: '⚡' },
    { id: 'battery-bess', label: 'Battery BESS', icon: '🔋' },
    { id: 'solar-energy', label: 'Solar Energy', icon: '☀️' },
    { id: 'future-tech', label: 'Future Tech', icon: '🚀' },
] as const;

type MenuId = 'all' | 'battery-bess' | 'solar-energy' | 'future-tech';

// Human-readable group labels
const GROUP_LABELS: Record<string, string> = {
    'automotive-battery-packs': 'Automotive Packs',
    'energy-storage-solutions': 'Energy Storage',
    'solar-power-solutions': 'Solar Solutions',
    'inverters-electronics': 'Inverters & Electronics',
    'mounting-structures': 'Mounting Structures',
    'plant-infrastructure': 'Plant Infrastructure',
    'grid-bess': 'Grid BESS',
    'industrial-bess': 'Industrial BESS',
    'future-tech-solutions': 'Future Tech',
};

// ─── Component ──────────────────────────────────────────────────────────────────
const ProductsOverview: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMenu, setSelectedMenu] = useState<MenuId>('all');
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'name-desc'>('default');
    const [viewMode, setViewMode] = useState<'grid-2' | 'grid-3'>('grid-3');
    const [searchOpen, setSearchOpen] = useState(false);

    // Derive subcategory groups for current main category
    const subGroups = useMemo(() => {
        const products = selectedMenu === 'all'
            ? productsData
            : productsData.filter(p => p.menuId === selectedMenu);
        const seen = new Set<string>();
        const groups: { id: string; label: string; count: number }[] = [];
        products.forEach(p => {
            if (!seen.has(p.groupId)) {
                seen.add(p.groupId);
                const count = products.filter(x => x.groupId === p.groupId).length;
                groups.push({
                    id: p.groupId,
                    label: GROUP_LABELS[p.groupId] ?? p.groupId.replace(/-/g, ' '),
                    count,
                });
            }
        });
        return groups;
    }, [selectedMenu]);

    // Reset group when main category changes
    const handleMenuSelect = useCallback((id: MenuId) => {
        setSelectedMenu(id);
        setSelectedGroup(null);
    }, []);

    const filteredProducts = useMemo(() => {
        let result = [...productsData];

        if (selectedMenu !== 'all') {
            result = result.filter(p => p.menuId === selectedMenu);
        }
        if (selectedGroup) {
            result = result.filter(p => p.groupId === selectedGroup);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.industryTags.some(t => t.toLowerCase().includes(q))
            );
        }
        if (sortBy === 'name-asc') result.sort((a, b) => a.title.localeCompare(b.title));
        if (sortBy === 'name-desc') result.sort((a, b) => b.title.localeCompare(a.title));
        return result;
    }, [selectedMenu, selectedGroup, searchQuery, sortBy]);

    return (
        <div className="po-page">

            {/* ── DESKTOP SIDEBAR + MAIN ──────────────────────────────────── */}
            <div className="po-desktop">
                <aside className="po-sidebar">
                    {/* Search */}
                    <div className="sidebar-section">
                        <h4>Search</h4>
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                    </div>

                    {/* Product Hubs */}
                    <div className="sidebar-section">
                        <h4>Product Hubs</h4>
                        <ul className="category-list">
                            {MAIN_CATEGORIES.map(cat => (
                                <li
                                    key={cat.id}
                                    className={selectedMenu === cat.id ? 'active' : ''}
                                    onClick={() => handleMenuSelect(cat.id as MenuId)}
                                >
                                    <span className="cat-icon">{cat.icon}</span>
                                    {cat.label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Subcategories */}
                    {subGroups.length > 0 && (
                        <div className="sidebar-section">
                            <h4>Categories</h4>
                            <ul className="category-list small">
                                <li
                                    className={selectedGroup === null ? 'active' : ''}
                                    onClick={() => setSelectedGroup(null)}
                                >All</li>
                                {subGroups.map(g => (
                                    <li
                                        key={g.id}
                                        className={selectedGroup === g.id ? 'active' : ''}
                                        onClick={() => setSelectedGroup(g.id)}
                                    >
                                        {g.label}
                                        <span className="cat-count">{g.count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Assistance */}
                    <div className="sidebar-section">
                        <h4>Need Help?</h4>
                        <div className="assistance-box">
                            <p>Can't find the energy solution you need?</p>
                            <Link to="/hub/about" className="contact-link">Contact Engineering →</Link>
                        </div>
                    </div>
                </aside>

                <main className="po-main">
                    <div className="shop-controls">
                        <div className="results-count">Showing {filteredProducts.length} results</div>
                        <div className="controls-right">
                            <div className="view-toggle">
                                <button className={viewMode === 'grid-3' ? 'active' : ''} onClick={() => setViewMode('grid-3')} title="3 Columns">
                                    <svg viewBox="0 0 24 24" width="18" height="18"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                                </button>
                                <button className={viewMode === 'grid-2' ? 'active' : ''} onClick={() => setViewMode('grid-2')} title="2 Columns">
                                    <svg viewBox="0 0 24 24" width="18" height="18"><rect x="2" y="2" width="9" height="20" /><rect x="13" y="2" width="9" height="20" /></svg>
                                </button>
                            </div>
                            <select className="sort-dropdown" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                                <option value="default">Default Sorting</option>
                                <option value="name-asc">Name (A–Z)</option>
                                <option value="name-desc">Name (Z–A)</option>
                            </select>
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        <motion.div className={`product-grid ${viewMode}`} layout>
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filteredProducts.length === 0 && (
                        <div className="no-results">
                            <h3>No products found</h3>
                            <p>Try adjusting your filters.</p>
                            <button className="reset-btn" onClick={() => { setSearchQuery(''); setSelectedMenu('all'); setSelectedGroup(null); }}>
                                Reset Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* ── MOBILE LAYOUT (Myntra-style) ────────────────────────────── */}
            <div className="po-mobile">

                {/* Mobile Top Bar */}
                <div className="mobile-topbar">
                    <span className="mobile-results">{filteredProducts.length} Products</span>
                    <div className="mobile-topbar-right">
                        <button className="mobile-search-btn" onClick={() => setSearchOpen(o => !o)} aria-label="Search">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>
                        <select className="mobile-sort" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                            <option value="default">Sort</option>
                            <option value="name-asc">A–Z</option>
                            <option value="name-desc">Z–A</option>
                        </select>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <AnimatePresence>
                    {searchOpen && (
                        <motion.div
                            className="mobile-search-bar"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Two-Column Category Panel */}
                <div className="mobile-category-shell">

                    {/* LEFT: Main Categories */}
                    <div className="mobile-cat-left">
                        {MAIN_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                className={`mobile-cat-item ${selectedMenu === cat.id ? 'active' : ''}`}
                                onClick={() => handleMenuSelect(cat.id as MenuId)}
                            >
                                <span className="mobile-cat-icon">{cat.icon}</span>
                                <span className="mobile-cat-label">{cat.label}</span>
                                {selectedMenu === cat.id && <span className="mobile-cat-bar" />}
                            </button>
                        ))}
                    </div>

                    {/* RIGHT: Subcategory Groups */}
                    <div className="mobile-cat-right">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedMenu}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="mobile-subcat-list"
                            >
                                {/* "All" chip for this menu */}
                                <button
                                    className={`mobile-subcat-item ${selectedGroup === null ? 'active' : ''}`}
                                    onClick={() => setSelectedGroup(null)}
                                >
                                    <span className="subcat-dot" />
                                    <span className="subcat-name">All {selectedMenu === 'all' ? 'Products' : MAIN_CATEGORIES.find(c => c.id === selectedMenu)?.label}</span>
                                    <span className="subcat-count">{filteredProducts.length}</span>
                                </button>

                                {subGroups.map((g, i) => (
                                    <motion.button
                                        key={g.id}
                                        className={`mobile-subcat-item ${selectedGroup === g.id ? 'active' : ''}`}
                                        onClick={() => setSelectedGroup(prev => prev === g.id ? null : g.id)}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                    >
                                        <span className="subcat-dot" />
                                        <span className="subcat-name">{g.label}</span>
                                        <span className="subcat-count">{g.count}</span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Product Grid */}
                <div className="mobile-product-area">
                    {selectedGroup && (
                        <div className="mobile-active-filter">
                            <span>{GROUP_LABELS[selectedGroup] ?? selectedGroup}</span>
                            <button onClick={() => setSelectedGroup(null)}>✕</button>
                        </div>
                    )}

                    <AnimatePresence mode="popLayout">
                        <motion.div className="product-grid grid-2" layout>
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filteredProducts.length === 0 && (
                        <div className="no-results">
                            <h3>No products found</h3>
                            <p>Try a different category.</p>
                            <button className="reset-btn" onClick={() => { setSearchQuery(''); setSelectedMenu('all'); setSelectedGroup(null); }}>
                                Reset
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ProductsOverview;
