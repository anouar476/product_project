import React, { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderService } from '../services/api';

function CreateOrder() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const order = {
        items: [{
          productId: product.id,
          quantite: quantity,
          prix: product.prix
        }]
      };

      await orderService.createOrder(order, keycloak);
      setSuccess('Order created successfully!');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    }
  };

  if (!keycloak.authenticated) {
    return <div className="card">Please login to create an order</div>;
  }

  if (!product) {
    return <div className="card">No product selected</div>;
  }

  return (
    <div>
      <h2>Create Order</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <h3>{product.nom}</h3>
        <p>{product.description}</p>
        <p>Price: ${product.prix}</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.quantite}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          <p><strong>Total: ${(product.prix * quantity).toFixed(2)}</strong></p>

          <button type="submit" className="btn">Place Order</button>
        </form>
      </div>
    </div>
  );
}

export default CreateOrder;
