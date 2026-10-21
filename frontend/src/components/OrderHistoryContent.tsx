import { Section, Card, CardBody, Badge, Button, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Order } from '../types';

interface OrderHistoryContentProps {
  orders: Order[];
  selectedOrderId?: number | null;
  onSelectOrder?: (id: number) => void;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'ready':
      return 'primary';
    case 'confirmed':
      return 'soft';
    default:
      return 'neutral';
  }
}

export default function OrderHistoryContent({ orders, selectedOrderId, onSelectOrder }: OrderHistoryContentProps) {
  if (!orders || orders.length === 0) {
    return (
      <Section eyebrow="Your orders" title="Order history">
        <EmptyState
          icon="package"
          title="No pre-orders yet"
          text="Once you place an order for cakes or pastries, it will show up here with its pickup date and status."
          action={<Button to="/menu">Browse the menu</Button>}
        />
      </Section>
    );
  }

  return (
    <Section eyebrow="Your orders" title="Order history" subtitle="Every cake and pastry pre-order you've placed, with pickup date and status.">
      <div className="ds-table-wrap">
        <table className="ds-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Pickup date</th>
              <th>Status</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={selectedOrderId === order.id ? 'is-selected' : undefined}>
                <td>#{order.orderNumber}</td>
                <td>
                  {order.pickupDate
                    ? new Date(order.pickupDate).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : '—'}
                </td>
                <td>
                  <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                </td>
                <td>${Number(order.totalAmount).toFixed(2)}</td>
                <td>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => onSelectOrder?.(order.id)}
                  >
                    <Icon name="eye" size={16} /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}