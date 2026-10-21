import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Badge, Button, Media, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Product } from '../types';

interface MenuGridProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  onClearFilters?: () => void;
}

export default function MenuGrid({ products, loading, onAddToCart, onClearFilters }: MenuGridProps) {
  if (loading) {
    return (
      <Section tight>
        <SkeletonCards count={6} />
      </Section>
    );
  }

  if (products.length === 0) {
    return (
      <Section tight>
        <EmptyState
          icon="search"
          title="No treats match your search"
          text="Try another category or clear your filters to see the full case of cakes and pastries."
          action={
            onClearFilters ? (
              <Button variant="primary" onClick={onClearFilters}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      </Section>
    );
  }

  return (
    <Section tight>
      <Grid size="md" cols={3}>
        {products.map((product) => (
          <Card key={product.id}>
            <Media
              src={product.imageUrl}
              alt={product.name}
              ratio="square"
              badge={
                product.isFeatured ? (
                  <Badge tone="primary">Featured</Badge>
                ) : !product.isAvailable ? (
                  <Badge tone="neutral">Sold out</Badge>
                ) : undefined
              }
            />
            <CardBody>
              <CardTitle>{product.name}</CardTitle>
              {product.category?.name && <CardMeta>{product.category.name}</CardMeta>}
              {product.description && <CardMeta>{product.description}</CardMeta>}
              <CardFooter>
                <Price value={product.price} />
                <Button
                  variant="primary"
                  disabled={!product.isAvailable}
                  onClick={() => onAddToCart(product)}
                >
                  <Icon name="cart" size={16} />
                  {product.isAvailable ? 'Add to cart' : 'Unavailable'}
                </Button>
              </CardFooter>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}