import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useUser } from '../context/UserContext';

interface Order {
  id: string;
  name: string;
  processedAt: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
      };
    }[];
  };
  fulfillmentStatus: string;
}

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.shopifyAccessToken) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Pass the customer access token to the backend
        const response = await api.post('/shopify/orders', { 
          customerAccessToken: user.shopifyAccessToken 
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (!user) {
    return <div>Please log in to see your orders.</div>;
  }

  if (!user.shopifyAccessToken) {
    return (
      <div className="text-center">
        <p>Please link your shop account to see your orders.</p>
        <Link to="/shopify-auth" className="text-blue-500 hover:underline">
          Login or Register a Shop Account
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return <div>You have no orders.</div>;
  }

  return (
    <div className="my-orders-page">
      <h2>My Orders</h2>
      {orders.map(order => (
        <div key={order.id} className="border p-4 rounded mb-4">
          <h4>Order {order.name}</h4>
          <p>Date: {new Date(order.processedAt).toLocaleDateString()}</p>
          <p>Total: {order.totalPrice.amount} {order.totalPrice.currencyCode}</p>
          <p>Status: {order.fulfillmentStatus}</p>
          <ul>
            {order.lineItems.edges.map((item, index) => (
              <li key={index}>{item.node.title} (x{item.node.quantity})</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MyOrdersPage;
