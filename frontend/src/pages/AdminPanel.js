import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { productService, orderService } from '../services/api';

function AdminPanel() {
  const { keycloak } = useKeycloak();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newProduct, setNewProduct] = useState({
    nom: '',
    description: '',
    prix: 0,
    quantite: 0
  });

  useEffect(() => {
    if (keycloak.authenticated && keycloak.hasRealmRole('ADMIN')) {
      loadProducts();
      loadOrders();
    }
  }, [keycloak.authenticated]);

  const loadProducts = async () => {
    try {
      const response = await productService.getAllProducts(keycloak);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const loadOrders = async () => {
    try {
      const response = await orderService.getAllOrders(keycloak);
      setOrders(response.data);
    } catch (err) {
      console.log('Failed to load orders');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await productService.createProduct(newProduct, keycloak);
      setSuccess('Product added successfully!');
      setShowAddProduct(false);
      setNewProduct({ nom: '', description: '', prix: 0, quantite: 0 });
      loadProducts();
    } catch (err) {
      setError('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await productService.deleteProduct(id, keycloak);
        loadProducts();
        setSuccess('Product deleted');
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  if (!keycloak.authenticated || !keycloak.hasRealmRole('ADMIN')) {
    return <div className="card">Access denied. Admin only.</div>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <h3>Product Management</h3>
        <button className="btn" onClick={() => setShowAddProduct(!showAddProduct)}>
          {showAddProduct ? 'Cancel' : 'Add Product'}
        </button>

        {showAddProduct && (
          <form onSubmit={handleAddProduct} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={newProduct.nom}
                onChange={(e) => setNewProduct({ ...newProduct, nom: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input
                type="number"
                step="0.01"
                value={newProduct.prix}
                onChange={(e) => setNewProduct({ ...newProduct, prix: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="number"
                value={newProduct.quantite}
                onChange={(e) => setNewProduct({ ...newProduct, quantite: parseInt(e.target.value) })}
                required
              />
            </div>
            <button type="submit" className="btn">Add Product</button>
          </form>
        )}

        <div style={{ marginTop: '20px' }}>
          {products.map(product => (
            <div key={product.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              <strong>{product.nom}</strong> - ${product.prix} - Stock: {product.quantite}
              <button
                className="btn btn-danger"
                style={{ marginLeft: '10px' }}
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>All Orders</h3>
        {orders.map(order => (
          <div key={order.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            Order #{order.id} - User: {order.username || order.userId} - Total: ${order.montantTotal} - Status: {order.statut}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
