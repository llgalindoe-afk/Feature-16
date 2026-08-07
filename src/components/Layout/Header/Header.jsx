import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectIsAdmin } from '../../../store/authSlice';
import { fetchCart } from '../../../store/cartSlice';
import { fetchWishlist } from '../../../store/wishlistSlice';

function Header() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const isAdmin = useSelector(selectIsAdmin);
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="topbar">
      <div className="brand-block">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>Cositas LAB</h1>
        </Link>
      </div>
      <nav className="topnav" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          end
        >
          Home
        </NavLink>
        <NavLink 
          to="/products" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          Catálogo
        </NavLink>

        {token ? (
          <>
            <NavLink 
              to="/cart" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              Cesta
              {cartItemsCount > 0 && (
                <span style={{
                  background: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {cartItemsCount}
                </span>
              )}
            </NavLink>
            <NavLink 
              to="/wishlist" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Wishlist
            </NavLink>
            {isAdmin && (
              <NavLink 
                to="/admin" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                style={{ color: '#ef4444', fontWeight: 'bold' }}
              >
                Admin
              </NavLink>
            )}
            <NavLink 
              to="/profile" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              style={{ fontWeight: 'var(--font-weight-bold)' }}
            >
              {user?.name || 'Perfil'}
            </NavLink>
            <button
              onClick={handleLogout}
              className="nav-link"
              style={{
                background: 'transparent',
                border: '1px solid rgba(17, 17, 17, 0.15)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-black)';
                e.currentTarget.style.color = 'var(--color-white)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-black)';
              }}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <NavLink 
              to="/login" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Login
            </NavLink>
            <NavLink 
              to="/register" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Registro
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
