import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import HomePage from '../pages/HomePage/HomePage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import CartPage from '../pages/CartPage/CartPage';
import WishlistPage from '../pages/WishlistPage/WishlistPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import CheckoutSuccessPage from '../pages/CheckoutSuccessPage/CheckoutSuccessPage';
import AdminRoute from '../components/AdminRoute/AdminRoute';
import AdminPage from '../pages/AdminPage/AdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: 'cart',
            element: <CartPage />
          },
          {
            path: 'wishlist',
            element: <WishlistPage />
          },
          {
            path: 'profile',
            element: <ProfilePage />
          },
          {
            path: 'checkout',
            element: <CheckoutSuccessPage />
          }
        ]
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: 'admin',
            element: <AdminPage />
          }
        ]
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);
