import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import { login } from '../../api/auth';

function LoginPage() {
  const emailInputRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Focus first input using useRef
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Introduce un correo electrónico válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMsg(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await login(formData);
      setSuccessMsg('¡Inicio de sesión exitoso!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || 'Error al iniciar sesión. Comprueba tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="panel auth-card">
        <p className="eyebrow">Acceso de usuarios</p>
        <h2>Iniciar Sesión</h2>
        <p className="lead">Accede a tu cuenta para gestionar tus compras y preferencias.</p>

        {serverError && (
          <div className="error-banner">
            <p>{serverError}</p>
          </div>
        )}

        {successMsg && (
          <div className="success-banner">
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="stack-md auth-form" noValidate>
          <FormInput
            ref={emailInputRef}
            label="Correo electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            error={errors.email}
          />

          <FormInput
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
          />

          <div style={{ marginTop: '1rem' }}>
            <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </div>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p className="detail-copy">
            ¿No tienes una cuenta aún?{' '}
            <Link to="/register" className="text-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
