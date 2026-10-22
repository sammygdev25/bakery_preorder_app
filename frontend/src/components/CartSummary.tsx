import { Card, CardBody, CardTitle, Price, Button, Stack } from '../components/ui';
import { Icon } from '../components/icons';

interface CartSummaryProps {
  total: number;
  itemCount: number;
  pickupDate?: string;
  onCheckout: () => void;
}

export default function CartSummary({ total, itemCount, pickupDate, onCheckout }: CartSummaryProps) {
  const isEmpty = itemCount === 0;

  return (
    <Card>
      <CardBody>
        <CardTitle>Order Summary</CardTitle>
        <Stack gap="sm">
          <div className="ds-between">
            <span className="ds-muted">
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
            <span>${Number(total || 0).toFixed(2)}</span>
          </div>
          <div className="ds-between">
            <span className="ds-muted">Pickup fee</span>
            <span className="ds-muted">Free</span>
          </div>
          {pickupDate && (
            <div className="ds-between">
              <span className="ds-muted">
                <Icon name="calendar" size={14} /> Pickup
              </span>
              <span>{new Date(pickupDate).toLocaleString()}</span>
            </div>
          )}
          <div className="ds-between">
            <span className="ds-card-title">Total</span>
            <Price value={total} />
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={onCheckout}
            disabled={isEmpty}
          >
            <Icon name="arrow-right" size={16} /> Proceed to Checkout
          </Button>
          <p className="ds-small ds-muted">
            Fresh-baked treats, ready for pickup at your chosen time. Payment is collected at checkout.
          </p>
        </Stack>
      </CardBody>
    </Card>
  );
}