import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import { registerThunk, clearError } from '../../store/authSlice';

function RegisterPage() {
  const nameInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error: reduxError } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState(null);

  // Focus first input using useRef and clear any auth errors
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Introduce un correo electrónico válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Por favor confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    dispatch(clearError());

    if (!validate()) return;

    const result = await dispatch(registerThunk({
      name: formData.name,
      email: formData.email,
      password: formData.password
    }));

    if (registerThunk.fulfilled.match(result)) {
      setSuccessMsg('¡Registro completado con éxito! Redirigiendo al inicio...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
  };

  return (
    <div className="auth-container">
      <div className="panel auth-card">
        <p className="eyebrow">Nueva cuenta</p>
        <h2>Crear Cuenta</h2>
        <p className="lead">Únete a Cositas Lab para disfrutar de una experiencia de compra personalizada.</p>

        {reduxError && (
          <div className="error-banner">
            <p>{reduxError}</p>
          </div>
        )}

        {successMsg && (
          <div className="success-banner">
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="stack-md auth-form" noValidate>
          <FormInput
            ref={nameInputRef}
            label="Nombre completo"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            error={errors.name}
          />

          <FormInput
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
            placeholder="Mínimo 6 caracteres"
            error={errors.password}
          />

          <FormInput
            label="Confirmar contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            error={errors.confirmPassword}
          />

          <div style={{ marginTop: '1rem' }}>
            <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </Button>
          </div>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p className="detail-copy">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
