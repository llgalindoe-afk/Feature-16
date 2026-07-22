import React from 'react';
import { NavLink, Link } from 'react-router-dom';

function Header() {
  return (
    <header className="topbar">
      <div className="brand-block">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>Cositas Lab</h1>
        </Link>
      </div>
      <nav className="topnav">
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
      </nav>
    </header>
  );
}

export default Header;
