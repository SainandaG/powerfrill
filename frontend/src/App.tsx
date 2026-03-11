import { lazy, Suspense, useState, useEffect } from 'react'
import './index.css'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import Hero from './components/Hero.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { AuthProvider, useAuth } from './context/AuthContext.tsx'
import LoginPage from './pages/LoginPage.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'
import StaffManagement from './pages/StaffManagement.tsx'
import { productService } from './services/api.ts'
import { productsData } from './data/products.ts'

const ProductPage = lazy(() => import('./components/ProductPage.tsx'))
const ProductsOverview = lazy(() => import('./components/ProductsOverview.tsx'))
const ProductEditor = lazy(() => import('./pages/ProductEditor.tsx'))
const PublishingCenter = lazy(() => import('./pages/PublishingCenter.tsx'))
const AdminProductList = lazy(() => import('./pages/AdminProductList.tsx'))
const AdminQuotations = lazy(() => import('./pages/AdminQuotations.tsx'))
const SolutionDetail = lazy(() => import('./components/SolutionDetail.tsx'))
const CategoryDetail = lazy(() => import('./components/CategoryDetail.tsx'))
const CheckoutPage = lazy(() => import('./components/CheckoutPage.tsx'))
const PromotionPopup = lazy(() => import('./components/PromotionPopup.tsx'))

const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', fontFamily: 'monospace' }}>
    <div style={{ letterSpacing: '2px', opacity: 0.5 }}>INITIALIZING...</div>
  </div>
);

function ProtectedRoute({ children, roles }: { children: React.ReactNode, roles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <LoginPage />; // Or redirect to /login
  if (roles && !roles.includes(user.role)) {
    return (
      <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyItems: 'center', textAlign: 'center' }}>
        <h1 style={{ color: '#ff4444' }}>Unauthorized</h1>
      </div>
    )
  }

  return <>{children}</>;
}


function ProductPageWrapper() {
  const { productSlug, productId } = useParams<{
    productSlug?: string;
    productId?: string;
  }>();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        if (productId) {
          // Try local data first, then API
          const local = productsData.find(p => p.id === productId);
          if (local) { setProduct(local); setLoading(false); return; }
          const data = await productService.getById(productId);
          setProduct(data);
        } else if (productSlug) {
          // Try local static data first (instant, no network)
          const local = productsData.find(p => p.slug === productSlug);
          if (local) { setProduct(local); setLoading(false); return; }
          // Fallback: API (for admin-published products)
          const all = await productService.getAll();
          const found = all.find((p: any) => p.slug === productSlug);
          setProduct(found ?? null);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId, productSlug]);

  if (loading) return <PageLoader />;

  if (!product) {
    return (
      <div className="product-page" style={{ textAlign: 'center', paddingTop: '200px' }}>
        <h1 style={{ color: '#ffffff' }}>Product Not Found</h1>
        <Link to="/products" style={{ color: '#3b82f6' }}>← Back to Portfolio</Link>
      </div>
    );
  }

  return (
    <ProductPage {...product} />
  );
}



function HomePage() {
  return (
    <>
      <main>
        <Hero />
      </main>
    </>
  );
}

import { ThemeProvider } from './context/ThemeContext.tsx'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="app">
              <Navbar />
              <div className="main-content-wrapper">
                <Suspense fallback={<div className="loading-state">...</div>}>
                  <PromotionPopup />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsOverview />} />
                    <Route path="/hub/:solutionId" element={<SolutionDetail />} />
                    <Route path="/category/:categoryId" element={<CategoryDetail />} />
                    <Route path="/checkout" element={<CheckoutPage />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute roles={['ADMIN', 'EDITOR']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/products" element={
                      <ProtectedRoute roles={['ADMIN', 'EDITOR']}>
                        <AdminProductList />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/quotations" element={
                      <ProtectedRoute roles={['ADMIN', 'EDITOR']}>
                        <AdminQuotations />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/products/new" element={
                      <ProtectedRoute roles={['ADMIN', 'EDITOR']}>
                        <ProductEditor />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/products/:id" element={
                      <ProtectedRoute roles={['ADMIN', 'EDITOR']}>
                        <ProductEditor />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/staff" element={
                      <ProtectedRoute roles={['ADMIN']}>
                        <StaffManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/publishing" element={
                      <ProtectedRoute roles={['ADMIN', 'EDITOR']}>
                        <PublishingCenter />
                      </ProtectedRoute>
                    } />

                    {/* Enterprise Catalog Routing */}
                    <Route path="/:menuId/:groupId/:categoryId/:productSlug" element={<ProductPageWrapper />} />

                    {/* Backward Compatible / Legacy Route */}
                    <Route path="/product/:productId" element={<ProductPageWrapper />} />
                    <Route path="/login" element={<LoginPage />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
