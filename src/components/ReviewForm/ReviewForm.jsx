import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { postReview } from '../../api/reviews';
import Button from '../Button/Button';

function ReviewForm({ productId, onReviewAdded }) {
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Por favor, escribe un comentario para tu reseña.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const reviewData = {
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        author: user?.name || 'Cliente verificado',
        date: new Date().toISOString()
      };
      
      await postReview(productId, reviewData);
      setSuccess(true);
      setTitle('');
      setComment('');
      setRating(5);
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al enviar la opinión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="panel" style={{ marginTop: '2rem', padding: '2rem' }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>Escribe una opinión</h3>
      
      {error && (
        <div className="error-banner" style={{ marginBottom: '1rem' }}>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="success-banner" style={{ marginBottom: '1rem' }}>
          <p>¡Muchas gracias! Tu opinión ha sido publicada con éxito.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="stack-md" style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span className="detail-label">Valoración</span>
          <div style={{ display: 'flex', gap: '0.25rem', fontSize: '1.5rem', cursor: 'pointer' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  color: star <= rating ? '#e4a900' : '#e0e0e0',
                  transition: 'color 0.15s ease'
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label htmlFor="review-title" className="detail-label">Título (opcional)</label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Excelente calidad, Muy recomendado..."
            style={{
              padding: '0.8rem 1.2rem',
              borderRadius: '16px',
              border: '1px solid rgba(17, 17, 17, 0.1)',
              background: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label htmlFor="review-comment" className="detail-label">Tu comentario</label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Qué te ha parecido el producto? Cuéntanos tu experiencia..."
            rows={4}
            required
            style={{
              padding: '0.8rem 1.2rem',
              borderRadius: '16px',
              border: '1px solid rgba(17, 17, 17, 0.1)',
              background: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Enviando opinión...' : 'Enviar Opinión'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
