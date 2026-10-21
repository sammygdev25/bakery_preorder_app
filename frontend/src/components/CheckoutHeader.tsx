import { PageHeader } from '../components/ui';
import { Icon } from '../components/icons';

export interface CheckoutHeaderProps {
  step?: 'details' | 'payment';
}

export default function CheckoutHeader({ step = 'details' }: CheckoutHeaderProps) {
  return (
    <PageHeader
      eyebrow="Checkout"
      title="Finish your order"
      subtitle="Confirm your pickup time and details, then review your order before paying."
      actions={
        <div className="ds-cluster">
          <span className="ds-badge-step">
            <Icon name="calendar" size={16} />
            1. Details
          </span>
          <Icon name="chevron-right" size={16} />
          <span className="ds-badge-step" style={{ opacity: step === 'payment' ? 1 : 0.5 }}>
            <Icon name="credit-card" size={16} />
            2. Payment
          </span>
        </div>
      }
    />
  );
}