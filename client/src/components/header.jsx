import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

const header = () => (
  <Navbar expand="lg" bg="light">
    <Link to="/" className="navbar-brand">Trailr</Link>
    <Navbar.Toggle aria-controls="menuBar">
      <span className="navbar-toggler-icon" />
    </Navbar.Toggle>
    <Navbar.Collapse id="menuBar">
      <div className="navbar-nav">
        <Link to="/user/0" className="nav-item nav-link">User</Link>
        <Link to="/trail/1" className="nav-item nav-link">Trail</Link>
        <a href="/auth/login" className="nav-item nav-link">Login</a>
        <a href="/auth/logout" className="nav-item nav-link">Signout</a>
        <a href="/auth/google" className="nav-item nav-link">Google</a>
      </div>
    </Navbar.Collapse>
  </Navbar>
);

export default header;
