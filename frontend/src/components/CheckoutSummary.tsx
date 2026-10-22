import { Card, CardBody, CardTitle, CardFooter, Media, Price, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { CartItem } from '../contexts/CartContext';

interface CheckoutSummaryProps {
  items: CartItem[];
  total: number;
  pickupDate?: string;
  onSubmit: () => void;
  submitting?: boolean;
  disabled?: boolean;
}

export default function CheckoutSummary({
  items,
  total,
  pickupDate,
  onSubmit,
  submitting = false,
  disabled = false,
}: CheckoutSummaryProps) {
  return (
    <Card>
      <CardBody>
        <CardTitle>Order summary</CardTitle>
        <div className="ds-stack" style={{ marginTop: '0.75rem' }}>
          {items.length === 0 ? (
            <p className="ds-muted ds-small">Your box is empty — add some treats from the menu.</p>
          ) : (
            items.map((item) => (
              <div className="ds-cluster ds-between" key={item.product.id}>
                <div className="ds-cluster" style={{ gap: '0.6rem' }}>
                  <Media
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    ratio="square"
                    className="ds-media-sm"
                  />
                  <div>
                    <div className="ds-small">{item.product.name}</div>
                    <div className="ds-muted ds-small">
                      Qty {item.quantity} &times; ${Number(item.product.price).toFixed(2)}
                    </div>
                  </div>
                </div>
                <Price value={item.quantity * Number(item.product.price)} />
              </div>
            ))
          )}
        </div>

        {pickupDate && (
          <div className="ds-cluster ds-small ds-muted" style={{ marginTop: '0.75rem' }}>
            <Icon name="calendar" size={16} />
            <span>
              Pickup:{' '}
              {new Date(pickupDate).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>
        )}

        <CardFooter>
          <div className="ds-between" style={{ width: '100%' }}>
            <span className="ds-label">Total</span>
            <Price value={total} />
          </div>
        </CardFooter>

        <Button
          variant="primary"
          size="lg"
          onClick={onSubmit}
          disabled={disabled || submitting || items.length === 0}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {submitting ? 'Placing order...' : 'Place order & pay'}
        </Button>
      </CardBody>
    </Card>
  );
}