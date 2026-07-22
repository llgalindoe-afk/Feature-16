import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import Button from '../../components/Button/Button';

function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="panel auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <p className="eyebrow">Mi Cuenta</p>
        <h2>Perfil de Usuario</h2>
        <p className="lead">Aquí puedes ver tus datos personales y gestionar tu sesión.</p>

        {user ? (
          <div className="stack-md" style={{ margin: '2rem 0' }}>
            <div className="fake-box" style={{ padding: '1.5rem', textAlign: 'left' }}>
              <p className="detail-label" style={{ marginBottom: '0.25rem' }}>Nombre</p>
              <strong style={{ fontSize: '1.2rem' }}>{user.name}</strong>
            </div>

            <div className="fake-box" style={{ padding: '1.5rem', textAlign: 'left' }}>
              <p className="detail-label" style={{ marginBottom: '0.25rem' }}>Correo electrónico</p>
              <strong style={{ fontSize: '1.2rem' }}>{user.email}</strong>
            </div>
          </div>
        ) : (
          <p className="lead">Cargando perfil...</p>
        )}

        <Button variant="secondary" onClick={handleLogout} style={{ width: '100%' }}>
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}

export default ProfilePage;
