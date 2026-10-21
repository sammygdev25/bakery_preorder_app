import { PageHeader } from '../components/ui';

export interface OrderHistoryHeaderProps {
  userName?: string;
}

export default function OrderHistoryHeader({ userName }: OrderHistoryHeaderProps) {
  return (
    <PageHeader
      eyebrow="Your account"
      title="Order history"
      subtitle={
        userName
          ? `Every pre-order placed by ${userName}, with pickup dates and payment status.`
          : 'Every pre-order you have placed, with pickup dates and payment status.'
      }
    />
  );
}