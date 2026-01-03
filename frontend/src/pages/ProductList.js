import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';

function ProductList() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (keycloak.authenticated) {
      loadProducts();
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

  const addToCart = (product) => {
    navigate('/create-order', { state: { product } });
  };

  if (!keycloak.authenticated) {
    return <div className="card">Please login to view products</div>;
  }

  return (
    <div>
      <h2>Product Catalog</h2>
      {error && <div className="error">{error}</div>}

      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="card">
            <h3>{product.nom}</h3>
            <p>{product.description}</p>
            <p><strong>Price: ${product.prix}</strong></p>
            <p>Stock: {product.quantite}</p>
            <button className="btn" onClick={() => addToCart(product)}>
              Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
