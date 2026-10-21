import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOrderList } from '../api';
import type { Order } from '../types';
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
      <OrderHistoryDetails user={user} />
    </div>
  );
}