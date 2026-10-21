import type { CartItem } from '../contexts/CartContext';
import { Media, Price, Button, Stack } from './ui';
import { Icon } from './icons';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const { product, quantity } = item;
  const lineTotal = Number(product.price) * quantity;

  const handleDecrease = () => {
    if (quantity <= 1) {
      onRemove(product.id);
    } else {
      onUpdateQuantity(product.id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(product.id, quantity + 1);
  };

  return (
    <div className="ds-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
      <div style={{ width: '88px', flexShrink: 0 }}>
        <Media src={product.imageUrl} alt={product.name} ratio="square" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Stack gap="xs">
          <span className="ds-card-title">{product.name}</span>
          <span className="ds-muted ds-small">
            <Price value={product.price} /> each
          </span>
        </Stack>
      </div>
      <Stack gap="xs" align="center">
        <div className="ds-cluster" style={{ alignItems: 'center', gap: '0.5rem' }}>
          <Button
            variant="ghost"
            size="md"
            aria-label="Decrease quantity"
            onClick={handleDecrease}
          >
            <Icon name="minus" size={16} />
          </Button>
          <span style={{ minWidth: '1.5rem', textAlign: 'center' }}>{quantity}</span>
          <Button
            variant="ghost"
            size="md"
            aria-label="Increase quantity"
            onClick={handleIncrease}
          >
            <Icon name="plus" size={16} />
          </Button>
        </div>
        <span className="ds-price">
          <Price value={lineTotal} />
        </span>
      </Stack>
      <Button
        variant="ghost"
        size="md"
        aria-label={`Remove ${product.name} from cart`}
        onClick={() => onRemove(product.id)}
      >
        <Icon name="trash" size={18} />
      </Button>
    </div>
  );
}

export default CartItemRow;
export { CartItemRow };