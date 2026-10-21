import { PageHeader } from '../components/ui';

interface CartHeaderProps {
  itemCount: number;
}

export default function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <PageHeader
      eyebrow="Your order"
      title="Cart"
      subtitle={
        itemCount > 0
          ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} ready for pickup scheduling`
          : 'Fill your box with fresh cakes and pastries'
      }
    />
  );
}