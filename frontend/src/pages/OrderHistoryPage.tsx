import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOrderList } from '../api';
import type { Order, User as ApiUser } from '../types';
import OrderHistoryHeader from '../components/OrderHistoryHeader';
import OrderHistoryContent from '../components/OrderHistoryContent';
import OrderHistoryDetails from '../components/OrderHistoryDetails';
import { LoadingBlock, Alert } from '../components/ui';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOrderList();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('We could not load your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const apiUser: ApiUser | null = user
    ? {
        id: user.id,
        email: user.email,
        passwordHash: user.password_hash,
        googleId: user.google_id,
        name: user.name || `${user.first_name} ${user.last_name}`.trim() || user.username,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      }
    : null;

  return (
    <div className="ds-stack-lg">
      <OrderHistoryHeader userName={user?.name || user?.email} />
      {loading ? (
        <LoadingBlock label="Loading your orders..." />
      ) : error ? (
        <Alert tone="danger">{error}</Alert>
      ) : (
        <OrderHistoryContent
          orders={orders}
          selectedOrderId={selectedOrderId}
          onSelectOrder={(id) => setSelectedOrderId(id)}
        />
      )}
      <OrderHistoryDetails user={apiUser} />
    </div>
  );
}
