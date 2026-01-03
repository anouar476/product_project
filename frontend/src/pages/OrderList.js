import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { orderService } from '../services/api';

function OrderList() {
  const { keycloak } = useKeycloak();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (keycloak.authenticated) {
      loadOrders();
    }
  }, [keycloak.authenticated]);

  const loadOrders = async () => {
    try {
      const response = await orderService.getMyOrders(keycloak);
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
    }
  };

  if (!keycloak.authenticated) {
    return <div className="card">Please login to view orders</div>;
  }

  return (
    <div>
      <h2>My Orders</h2>
      {error && <div className="error">{error}</div>}

      {orders.length === 0 ? (
        <div className="card">No orders yet</div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <span className="order-date">
                    📅 {new Date(order.dateCommande).toLocaleDateString()}
                  </span>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.statut.toLowerCase()}`}>
                    {order.statut}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-details">
                      <span className="item-name">Product #{item.productId}</span>
                      <span className="item-quantity">Qty: {item.quantite}</span>
                    </div>
                    <span className="item-price">${item.prix}</span>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <span>Total Amount:</span>
                <span className="total-price">${order.montantTotal}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderList;
