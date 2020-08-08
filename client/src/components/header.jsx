import React from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './SearchBox.jsx';

const header = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <Link to="/" className="navbar-brand">Trailr</Link>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNavAltMarkup"
      aria-controls="navbarNavAltMarkup"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div className="navbar-nav">
        <Link to="/user/0" className="nav-item nav-link active">User</Link>
        <Link to="/trail/1" className="nav-item nav-link active">Trail</Link>
        <a href="/auth/login" className="nav-item nav-link">Login</a>
        <a href="/auth/logout" className="nav-item nav-link">Signout</a>
        <a href="/auth/google" className="nav-item nav-link">Google</a>
      </div>
    </div>
    <SearchBox />
  </nav>
);

export default header;
