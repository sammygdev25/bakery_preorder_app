import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import CheckoutHeader from '../components/CheckoutHeader';
import CheckoutForm from '../components/CheckoutForm';
import CheckoutSummary from '../components/CheckoutSummary';
import { WithSidebar } from '../components/ui';

export default function CheckoutPage() {
  const { items, total, pickupDate, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const handleFieldChange = (field: 'name' | 'email' | 'phone' | 'notes', value: string) => {
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'phone') setPhone(value);
    if (field === 'notes') setNotes(value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError('Please provide your name and email so we can confirm your order.');
      return;
    }
    if (!pickupDate) {
      setError('Please choose a pickup date before placing your order.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        pickupDate: new Date(pickupDate).toISOString(),
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        name,
        email,
        phone,
        notes,
        deliveryMethod,
      };
      const order = await api.post('/orders/', payload);
      clearCart();
      navigate('/orders', { state: { newOrderId: order?.id } });
    } catch (err: any) {
      setError(err?.message || 'We could not place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ds-stack-lg">
      <CheckoutHeader step="details" />
      <WithSidebar
        sidebar={
          <CheckoutSummary
            items={items}
            total={total}
            pickupDate={pickupDate}
            onSubmit={() => handleSubmit()}
            submitting={submitting}
            disabled={items.length === 0}
          />
        }
      >
        <CheckoutForm
          name={name}
          email={email}
          phone={phone}
          notes={notes}
          deliveryMethod={deliveryMethod}
          onFieldChange={handleFieldChange}
          onDeliveryMethodChange={setDeliveryMethod}
          onSubmit={handleSubmit}
          error={error}
          submitting={submitting}
        />
      </WithSidebar>
    </div>
  );
}