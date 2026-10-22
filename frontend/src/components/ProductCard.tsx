import { useCart } from '../contexts/CartContext';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Media, Button, Badge } from './ui';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { items } = useCart();
  const inCartQty = items
    .filter((i) => i.product.id === product.id)
    .reduce((sum, i) => sum + i.quantity, 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.isAvailable) return;
    onAddToCart(product);
  };

  return (
    <Card>
      <Media
        src={product.imageUrl}
        alt={product.name}
        ratio="square"
        badge={product.isFeatured ? 'Featured' : undefined}
      />
      <CardBody>
        <CardTitle>{product.name}</CardTitle>
        {product.description && (
          <CardMeta>{product.description}</CardMeta>
        )}
        <div className="ds-cluster" style={{ marginTop: '0.5rem' }}>
          {!product.isAvailable && <Badge tone="danger">Sold out</Badge>}
          {inCartQty > 0 && (
            <Badge tone="soft">{inCartQty} in cart</Badge>
          )}
        </div>
        <CardFooter>
          <Price value={product.price} />
          <Button
            variant="primary"
            size="md"
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
          >
            {product.isAvailable ? 'Add to order' : 'Unavailable'}
          </Button>
        </CardFooter>
      </CardBody>
    </Card>
  );
}

export default ProductCard;
export { ProductCard };
