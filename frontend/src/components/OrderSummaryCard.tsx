import type { Order } from '../types';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Badge, Stack } from './ui';
import { Icon } from './icons';

interface OrderSummaryCardProps {
  order: Order;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'completed':
    case 'ready':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'confirmed':
    case 'preparing':
      return 'primary';
    default:
      return 'neutral';
  }
}

function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const pickup = order.pickupDate ? new Date(order.pickupDate) : null;

  return (
    <Card>
      <CardBody>
        <Stack gap="sm">
          <div className="ds-between">
            <CardTitle>Order #{order.orderNumber}</CardTitle>
            <Badge tone={statusTone(order.status)}>{order.status}</Badge>
          </div>

          <CardMeta>
            <Icon name="calendar" size={16} />
            {' '}
            {pickup
              ? `Pickup ${pickup.toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}`
              : 'Pickup date to be confirmed'}
          </CardMeta>

          {order.items && order.items.length > 0 && (
            <Stack gap="xs">
              {order.items.map((item) => (
                <div className="ds-between" key={item.id}>
                  <span className="ds-small">
                    {item.quantity} x {item.product?.name ?? `Item #${item.productId}`}
                  </span>
                  <span className="ds-small ds-muted">
                    ${(Number(item.priceAtOrder) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </Stack>
          )}
        </Stack>
      </CardBody>
      <CardFooter>
        <div className="ds-between">
          <span className="ds-muted ds-small">Total</span>
          <Price value={Number(order.totalAmount)} />
        </div>
      </CardFooter>
    </Card>
  );
}

export default OrderSummaryCard;
export { OrderSummaryCard };