import { Link } from 'react-router-dom';
import type { CartItem } from '../contexts/CartContext';
import { Section, Media, Button, EmptyState, Stack } from '../components/ui';
import { Icon } from '../components/icons';

interface CartItemsProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItems({ items, onUpdateQuantity, onRemove }: CartItemsProps) {
  if (items.length === 0) {
    return (
      <Section title="Your box">
        <EmptyState
          icon="cart"
          title="Your box is empty"
          text="Browse our cakes and pastries to start building your pre-order."
          action={<Button to="/menu">Browse the menu</Button>}
        />
      </Section>
    );
  }

  return (
    <Section title="Your box" subtitle={`${items.length} item${items.length > 1 ? 's' : ''} in your order`}>
      <Stack gap="md">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="ds-card">
            <div className="ds-cluster ds-between">
              <div className="ds-cluster">
                <Media
                  src={product.image_url}
                  alt={product.name}
                  ratio="square"
                  className="cart-item-thumb"
                />
                <div>
                  <Link to={`/menu?category=${product.category?.slug ?? ''}`} className="ds-card-title">
                    {product.name}
                  </Link>
                  <div className="ds-card-meta">${Number(product.price).toFixed(2)} each</div>
                </div>
              </div>

              <Stack gap="sm" align="end">
                <div className="ds-cluster">
                  <Button
                    variant="ghost"
                    size="md"
                    aria-label={`Decrease quantity of ${product.name}`}
                    onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                  >
                    <Icon name="minus" size={16} />
                  </Button>
                  <span className="ds-small">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="md"
                    aria-label={`Increase quantity of ${product.name}`}
                    onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                  >
                    <Icon name="plus" size={16} />
                  </Button>
                </div>

                <div className="ds-cluster">
                  <span className="ds-price">${(Number(product.price) * quantity).toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="md"
                    aria-label={`Remove ${product.name} from box`}
                    onClick={() => onRemove(product.id)}
                  >
                    <Icon name="trash" size={16} />
                  </Button>
                </div>
              </Stack>
            </div>
          </div>
        ))}
      </Stack>
    </Section>
  );
}