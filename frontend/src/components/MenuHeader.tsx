import { PageHeader } from '../components/ui';

interface MenuHeaderProps {
  resultCount?: number;
  loading?: boolean;
}

export default function MenuHeader({ resultCount, loading }: MenuHeaderProps) {
  const subtitle =
    !loading && typeof resultCount === 'number'
      ? `${resultCount} ${resultCount === 1 ? 'treat' : 'treats'} ready to pre-order`
      : 'Fresh cakes and pastries, baked to order';

  return (
    <PageHeader
      eyebrow="Our Menu"
      title="Cakes & Pastries"
      subtitle={subtitle}
    />
  );
}