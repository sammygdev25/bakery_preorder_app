import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartHeader from '../components/CartHeader';
import CartItems from '../components/CartItems';
import CartSummary from '../components/CartSummary';

export default function CartPage() {
  const { items, total, itemCount, pickupDate, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="ds-stack-lg">
      <CartHeader itemCount={itemCount} />
      <CartItems items={items} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
      <CartSummary
        total={total}
        itemCount={itemCount}
        pickupDate={pickupDate}
        onCheckout={handleCheckout}
      />
    </div>
  );
}