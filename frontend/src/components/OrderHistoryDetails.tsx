import { Section } from '../components/ui';
import { Icon } from '../components/icons';
import type { User } from '../types';

interface OrderHistoryDetailsProps {
  user: User | null;
}

export default function OrderHistoryDetails({ user }: OrderHistoryDetailsProps) {
  if (!user) return null;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  return (
    <Section narrow title="Account details" eyebrow="Your info">
      <div className="ds-form">
        <div className="ds-form-row">
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="user" size={14} /> Name
            </span>
            <p>{user.name}</p>
          </div>
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="mail" size={14} /> Email
            </span>
            <p>{user.email}</p>
          </div>
        </div>
        {memberSince && (
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="calendar" size={14} /> Baking with us since
            </span>
            <p className="ds-muted">{memberSince}</p>
          </div>
        )}
        <p className="ds-help">
          Need to change your pickup details or have a question about a custom cake order? Reach out and our bakers
          will take care of it before your next pickup.
        </p>
      </div>
    </Section>
  );
}