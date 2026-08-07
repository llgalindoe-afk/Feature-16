import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkSessionThunk } from './store/authSlice';
import { router } from './router';

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkSessionThunk());
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'var(--font-family)',
        color: 'var(--color-black-50)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--color-black-10)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p>Cargando aplicación...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <RouterProvider router={router} />
  );
}

export default App;
