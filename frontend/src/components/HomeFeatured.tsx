import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Badge, Button, Media, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeFeaturedProps {
  products: Product[];
  loading?: boolean;
  onAddToCart: (product: Product) => void;
}

export default function HomeFeatured({ products, loading, onAddToCart }: HomeFeaturedProps) {
  return (
    <Section
      eyebrow="Fresh from the oven"
      title="Featured bakes"
      subtitle="A rotating pick of our customers' favorite cakes and pastries, ready to pre-order for pickup."
      actions={<Button to="/menu" variant="ghost">View full menu</Button>}
    >
      {loading ? (
        <SkeletonCards count={6} />
      ) : products.length === 0 ? (
        <EmptyState
          icon="sparkle"
          title="No featured items yet"
          text="Check back soon, our bakers are always whipping up something new."
          action={<Button to="/menu" variant="primary">Browse the menu</Button>}
        />
      ) : (
        <Grid size="md" cols={4}>
          {products.slice(0, 8).map((product) => (
            <Card key={product.id} to={`/menu?category=${product.category?.slug ?? ''}`}>
              <Media src={product.imageUrl} alt={product.name} ratio="square" badge={<Badge tone="primary">Featured</Badge>} />
              <CardBody>
                <CardTitle>{product.name}</CardTitle>
                <CardMeta>{product.category?.name ?? 'Bakery pick'}</CardMeta>
                <CardFooter>
                  <Price value={product.price} />
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                  >
                    <Icon name="cart" size={16} /> Add
                  </Button>
                </CardFooter>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  );
}