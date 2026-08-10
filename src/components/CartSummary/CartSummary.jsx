import React, { useState } from 'react';
import { checkout } from '../../api/checkout';
import Button from '../Button/Button';

function CartSummary({ items }) {
  const [loadingStripe, setLoadingStripe] = useState(false);

  const subtotal = items.reduce((acc, item) => {
    if (!item.product) return acc;
    return acc + item.product.price * item.quantity;
  }, 0);

  const shippingThreshold = 100;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 4.99;
  const total = subtotal + shippingCost;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoadingStripe(true);
    try {
      const cartItems = items.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }));
      const url = await checkout(cartItems);
      window.location.href = url;
    } catch (err) {
      alert("Error al iniciar el checkout: " + (err.response?.data?.error || err.message));
      setLoadingStripe(false);
    }
  };

  return (
    <div className="panel stack-lg" style={{ padding: '2rem', height: 'fit-content' }}>
      <p className="eyebrow" style={{ margin: 0 }}>Resumen del pedido</p>
      <h3 style={{ margin: '0 0 1rem 0', fontWeight: 'bold' }}>Detalle de Compra</h3>

      <div className="stack-md" style={{ borderBottom: '1px solid rgba(17, 17, 17, 0.1)', paddingBottom: '1.5rem', gap: '0.8rem', display: 'grid' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal</span>
          <strong>{subtotal.toFixed(2)} €</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Envío</span>
          <span>{shippingCost === 0 ? 'Gratis' : `${shippingCost.toFixed(2)} €`}</span>
        </div>
        {shippingCost > 0 && (
          <p className="detail-copy" style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(17, 17, 17, 0.5)' }}>
            Envío gratuito en compras superiores a {shippingThreshold} €. ¡Te faltan {(shippingThreshold - subtotal).toFixed(2)} €!
          </p>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
        <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Total</span>
        <strong style={{ fontSize: '1.6rem', color: 'var(--color-primary)' }}>{total.toFixed(2)} €</strong>
      </div>

      <Button 
        variant="primary" 
        onClick={handleCheckout} 
        disabled={loadingStripe || items.length === 0}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {loadingStripe ? 'Redirigiendo a Stripe...' : 'Realizar Pedido'}
      </Button>
    </div>
  );
}

export default CartSummary;
