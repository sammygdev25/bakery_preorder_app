import { Link } from 'react-router-dom';
import type { Order } from '../types';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, EmptyState, Icon, Price } from '../components/ui';

interface OrderHistoryListProps {
  orders: Order[];
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'completed':
    case 'ready':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'confirmed':
    case 'baking':
      return 'primary';
    default:
      return 'soft';
  }
}

function formatPickupDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function OrderHistoryList({ orders }: OrderHistoryListProps) {
  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="No orders yet"
        text="Once you place an order for cakes or pastries, it will show up here with its pickup time and status."
        action={
          <Link to="/menu" className="btn btn-primary">
            Browse the menu
          </Link>
        }
      />
    );
  }

  return (
    <div className="ds-stack" style={{ gap: 'var(--space-md, 1rem)' }}>
      {orders.map((order) => (
        <Card key={order.id}>
          <CardBody>
            <div className="ds-between">
              <div>
                <CardTitle>Order #{order.orderNumber}</CardTitle>
                <CardMeta>
                  <Icon name="calendar" size={14} /> Pickup: {formatPickupDate(order.pickupDate)}
                </CardMeta>
              </div>
              <Badge tone={statusTone(order.status)}>{order.status}</Badge>
            </div>
            {order.items && order.items.length > 0 && (
              <CardMeta>
                {order.items.length} item{order.items.length === 1 ? '' : 's'}
              </CardMeta>
            )}
            <CardFooter>
              <Price value={order.totalAmount} />
            </CardFooter>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export { OrderHistoryList };