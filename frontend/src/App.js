import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Route guards
import { PrivateRoute, AdminRoute, GuestRoute } from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import RecipesList from './pages/recipe/RecipesList';
import RecipeDetail from './pages/recipe/RecipeDetail';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/auth/AdminLogin';

// User Pages
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import Bookmarks from './pages/user/Bookmarks';

// Recipe Pages
import SubmitRecipe from './pages/recipe/SubmitRecipe';
import EditRecipe from './pages/recipe/EditRecipe';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRecipes from './pages/admin/AdminRecipes';
import AdminComments from './pages/admin/AdminComments';

// Layout wrapper for public pages (with Navbar + Footer)
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#fff',
              color: '#1a1a1a',
              border: '1px solid #ffd9a5',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(255, 117, 16, 0.15)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#ff7510', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* Auth pages (no navbar) */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/admin-login" element={<GuestRoute><AdminLogin /></GuestRoute>} />

          {/* Admin pages (own layout with sidebar) */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/recipes" element={<AdminRoute><AdminRecipes /></AdminRoute>} />
          <Route path="/admin/pending" element={<AdminRoute><AdminRecipes pendingOnly={true} /></AdminRoute>} />
          <Route path="/admin/comments" element={<AdminRoute><AdminComments /></AdminRoute>} />

          {/* Public + User pages (with Navbar + Footer) */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/recipes" element={<PublicLayout><RecipesList /></PublicLayout>} />
          <Route path="/recipes/:id" element={<PublicLayout><RecipeDetail /></PublicLayout>} />

          <Route path="/dashboard" element={
            <PrivateRoute><PublicLayout><Dashboard /></PublicLayout></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><PublicLayout><Profile /></PublicLayout></PrivateRoute>
          } />
          <Route path="/bookmarks" element={
            <PrivateRoute><PublicLayout><Bookmarks /></PublicLayout></PrivateRoute>
          } />
          <Route path="/submit-recipe" element={
            <PrivateRoute><PublicLayout><SubmitRecipe /></PublicLayout></PrivateRoute>
          } />
          <Route path="/recipes/:id/edit" element={
            <PrivateRoute><PublicLayout><EditRecipe /></PublicLayout></PrivateRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <PublicLayout>
              <div className="page-container text-center py-24">
                <div className="text-8xl mb-6">🍳</div>
                <h1 className="font-display text-5xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-500 mb-8">Oops! This page doesn't exist.</p>
                <a href="/" className="btn-primary">← Back to Home</a>
              </div>
            </PublicLayout>
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
