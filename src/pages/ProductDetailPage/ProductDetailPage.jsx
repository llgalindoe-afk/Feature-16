import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useProduct from '../../hooks/useProduct';
import useReviews from '../../hooks/useReviews';
import ReviewList from '../../components/ReviewList/ReviewList';
import Button from '../../components/Button/Button';
import WishlistButton from '../../components/WishlistButton/WishlistButton';
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import { addCartItem } from '../../store/cartSlice';

function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [selectedSize, setSelectedSize] = useState("40");
  const [quantity, setQuantity] = useState(1);

  const { data: product, loading: productLoading, error: productError } = useProduct(id);
  const { data: reviews, loading: reviewsLoading, error: reviewsError, refresh } = useReviews(id);

  if (productLoading) {
    return (
      <div className="panel loading-state" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="spinner"></div>
        <p className="lead">Cargando detalle del producto...</p>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="panel error-banner" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Producto no encontrado</h2>
        <p className="lead">{productError || 'El producto que buscas no existe o no se pudo cargar.'}</p>
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/products" className="button-link">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="stack-xl">
      <div className="detail-breadcrumb">
        <Link to="/products" className="text-link">Inicio / Catálogo</Link>
        <span> &gt; </span>
        <span>{product.name}</span>
      </div>

      <div className="detail-layout detail-editorial elegant-detail">
        <div className="panel image-panel detail-gallery">
          <img 
            src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/${product.imageUrl}`) : product.image || 'https://via.placeholder.com/400'} 
            alt={product.name} 
            className="detail-image" 
          />
        </div>

        <div className="panel stack-lg detail-info">
          <div className="detail-header-block">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <p className="eyebrow" style={{ margin: 0 }}>{product.category}</p>
              {product.ropa && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: '#111',
                  color: '#fff',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '100px'
                }}>
                  Prenda de vestir
                </span>
              )}
            </div>
            <h2>{product.name}</h2>
            <p className="lead">{product.description}</p>
          </div>

          <div className="detail-meta">
            <span>{product.category}</span>
            <strong>{Number(product.price).toFixed(2)} €</strong>
          </div>

          {product.ropa && (
            <div className="detail-section">
              <p className="detail-label">Talla</p>
              <div className="size-grid">
                {["40", "41", "42", "43"].map(size => (
                  <button
                    key={size}
                    type="button"
                    className={`size-chip ${selectedSize === size ? 'active-size' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section">
            <p className="detail-label">Cantidad</p>
            <div className="quantity-row quantity-large">
              <button 
                type="button" 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                type="button" 
                onClick={() => setQuantity(q => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="detail-actions-column" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button
              variant="primary"
              onClick={() => {
                dispatch(addCartItem({ productId: product.id, quantity, size: product.ropa ? selectedSize : null, product }));
                alert(product.ropa 
                  ? `¡Añadido al carrito! ${quantity}x ${product.name} (Talla ${selectedSize})`
                  : `¡Añadido al carrito! ${quantity}x ${product.name}`
                );
              }}
              style={{ flex: 1 }}
            >
              Añadir al carrito
            </Button>
            <div style={{ transform: 'translateY(-2px)' }}>
              <WishlistButton product={product} />
            </div>
          </div>

          <div className="detail-description-block">
            <p className="detail-label">Descripción</p>
            <p className="detail-copy detail-copy-plain">
              {product.name} es una pieza pensada para acompañar el día a día con una silueta cuidada, materiales cómodos y una estética limpia. Su diseño encaja con looks relajados o más pulidos, manteniendo siempre una presencia actual y fácil de combinar.
            </p>
          </div>

          <div className="detail-copy-grid">
            <div className="fake-box">
              <p className="detail-label">Envío</p>
              <p className="detail-copy">Envío en 24/48h, cambios sencillos y recogida en tienda disponible.</p>
            </div>
            <div className="fake-box">
              <p className="detail-label">Cambios y devoluciones</p>
              <p className="detail-copy">Dispones de 14 días para cambios o devoluciones, con proceso rápido y asistencia durante todo el pedido.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="panel reviews-panel">
        <p className="eyebrow">Opiniones</p>
        <h3>Opiniones de clientes</h3>
        {reviewsLoading ? (
          <p className="lead">Cargando opiniones...</p>
        ) : reviewsError ? (
          <ReviewList reviews={product.reviews || []} />
        ) : (
          <ReviewList reviews={reviews && reviews.length > 0 ? reviews : product.reviews || []} />
        )}
        {user && (
          <ReviewForm productId={product.id} onReviewAdded={refresh} />
        )}
      </div>
    </section>
  );
}

export default ProductDetailPage;
