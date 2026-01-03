import React from 'react';
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import keycloak from './keycloak';
import ProductList from './pages/ProductList';
import OrderList from './pages/OrderList';
import CreateOrder from './pages/CreateOrder';
import AdminPanel from './pages/AdminPanel';

function App() {
  const initOptions = {
    onLoad: 'check-sso',
    checkLoginIframe: false,
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
    >
      <Router>
        <AppContent />
      </Router>
    </ReactKeycloakProvider>
  );
}

function AppContent() {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div>
      <header className="header">
        <div className="header-brand">
          <h1>ShopHub</h1>
          <span className="header-subtitle">E-Commerce Platform</span>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-link">
            <span className="nav-icon">🛍️</span>
            Products
          </Link>
          <Link to="/orders" className="nav-link">
            <span className="nav-icon">📦</span>
            My Orders
          </Link>
          {keycloak?.hasRealmRole('ADMIN') && (
            <Link to="/admin" className="nav-link">
              <span className="nav-icon">⚙️</span>
              Admin
            </Link>
          )}
        </nav>
        <div className="header-actions">
          {keycloak?.authenticated ? (
            <div className="user-info">
              <span className="user-name">{keycloak.tokenParsed?.preferred_username}</span>
              <button className="btn btn-danger" onClick={() => keycloak.logout()}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => keycloak && keycloak.login()}>
              Login
            </button>
          )}
        </div>
      </header>

      <div className="container">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
