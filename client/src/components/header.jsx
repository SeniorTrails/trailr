import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';

/**
 * Header to the page, contains all our navigation links
 */
const header = () => (
  <Navbar expand="lg" bg="light">
    <Link to="/" className="navbar-brand">Trailr</Link>
    <Navbar.Toggle aria-controls="menuBar" />
    <Navbar.Collapse id="menuBar">
      <Nav>
        <Link to="/user/0" className="nav-item nav-link">User</Link>
        <Link to="/trail/1" className="nav-item nav-link">Trail</Link>
        <Nav.Link href="/auth/login">Login</Nav.Link>
        <Nav.Link href="/auth/logout">Signout</Nav.Link>
        <Nav.Link href="/auth/google">Google</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default header;
