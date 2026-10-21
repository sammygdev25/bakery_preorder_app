import { Section, WithSidebar, Alert, Button } from '../components/ui';
import { Icon } from '../components/icons';

export interface CheckoutFormProps {
  name: string;
  email: string;
  phone: string;
  notes: string;
  deliveryMethod: 'pickup' | 'delivery';
  onFieldChange: (field: 'name' | 'email' | 'phone' | 'notes', value: string) => void;
  onDeliveryMethodChange: (method: 'pickup' | 'delivery') => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string | null;
  submitting?: boolean;
}

export default function CheckoutForm({
  name,
  email,
  phone,
  notes,
  deliveryMethod,
  onFieldChange,
  onDeliveryMethodChange,
  onSubmit,
  error,
  submitting,
}: CheckoutFormProps) {
  return (
    <Section eyebrow="Checkout" title="Your details" tight>
      {error && (
        <Alert tone="danger">
          <Icon name="alert" size={16} /> {error}
        </Alert>
      )}
      <WithSidebar
        sidebar={
          <div className="ds-card ds-card-body ds-stack">
            <p className="ds-card-title">How would you like your order?</p>
            <label className="ds-field">
              <input
                type="radio"
                name="deliveryMethod"
                checked={deliveryMethod === 'pickup'}
                onChange={() => onDeliveryMethodChange('pickup')}
              />{' '}
              <Icon name="map-pin" size={16} /> Pick up at the bakery
            </label>
            <label className="ds-field">
              <input
                type="radio"
                name="deliveryMethod"
                checked={deliveryMethod === 'delivery'}
                onChange={() => onDeliveryMethodChange('delivery')}
              />{' '}
              <Icon name="truck" size={16} /> Local delivery
            </label>
            <p className="ds-help">
              We'll have your cakes and pastries ready fresh for the time you choose on the
              previous step.
            </p>
          </div>
        }
      >
        <form className="ds-form" onSubmit={onSubmit}>
          <div className="ds-form-row">
            <div className="ds-field">
              <label className="ds-label" htmlFor="checkout-name">
                Full name
              </label>
              <input
                id="checkout-name"
                className="input"
                type="text"
                required
                value={name}
                onChange={(e) => onFieldChange('name', e.target.value)}
                placeholder="Jane Baker"
              />
            </div>
            <div className="ds-field">
              <label className="ds-label" htmlFor="checkout-email">
                Email
              </label>
              <input
                id="checkout-email"
                className="input"
                type="email"
                required
                value={email}
                onChange={(e) => onFieldChange('email', e.target.value)}
                placeholder="jane@example.com"
              />
            </div>
          </div>
          <div className="ds-field">
            <label className="ds-label" htmlFor="checkout-phone">
              Phone number
            </label>
            <input
              id="checkout-phone"
              className="input"
              type="tel"
              required
              value={phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              placeholder="So we can reach you about your order"
            />
          </div>
          <div className="ds-field">
            <label className="ds-label" htmlFor="checkout-notes">
              Order notes <span className="ds-muted">(optional)</span>
            </label>
            <textarea
              id="checkout-notes"
              className="input"
              rows={3}
              value={notes}
              onChange={(e) => onFieldChange('notes', e.target.value)}
              placeholder="Allergies, a message on the cake, anything we should know..."
            />
          </div>
          <div className="ds-form-actions">
            <Button type="submit" variant="primary" size="lg" disabled={submitting}>
              {submitting ? 'Placing order...' : 'Continue to payment'}
            </Button>
          </div>
        </form>
      </WithSidebar>
    </Section>
  );
}