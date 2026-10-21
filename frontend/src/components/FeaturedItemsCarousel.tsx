import { useRef } from 'react';
import type { Product } from '../types';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Button } from './ui';
import { Icon } from './icons';

interface FeaturedItemsCarouselProps {
  items: Product[];
  onAddToCart: (product: Product) => void;
}

function FeaturedItemsCarousel({ items, onAddToCart }: FeaturedItemsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="ds-stack" style={{ gap: 'var(--space-md, 1rem)' }}>
      <div className="ds-cluster" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
        <Button variant="ghost" size="md" onClick={() => scrollBy(-1)} aria-label="Scroll left">
          <Icon name="chevron-left" />
        </Button>
        <Button variant="ghost" size="md" onClick={() => scrollBy(1)} aria-label="Scroll right">
          <Icon name="chevron-right" />
        </Button>
      </div>
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '0.5rem',
        }}
      >
        {items.map((product) => (
          <div
            key={product.id}
            style={{ flex: '0 0 260px', scrollSnapAlign: 'start' }}
          >
            <Card>
              <Media product={product} />
              <CardBody>
                <CardTitle>{product.name}</CardTitle>
                <CardMeta>{product.description}</CardMeta>
                <CardFooter>
                  <Price value={product.price} />
                  <Button variant="primary" size="md" onClick={() => onAddToCart(product)}>
                    <Icon name="cart" size={16} /> Add
                  </Button>
                </CardFooter>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

function Media({ product }: { product: Product }) {
  return (
    <div className="ds-media ds-media-square">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} />
      ) : (
        <div className="ds-media-fallback">
          <Icon name="image" size={32} />
        </div>
      )}
    </div>
  );
}

export { FeaturedItemsCarousel };
export default FeaturedItemsCarousel;