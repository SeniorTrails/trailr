import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

/**
 * Header to the page, contains all our navigation links
 */

// temporary isLoggedIn boolean:
const isLoggedIn = false;

const header = () => (
  <Navbar expand="sm" bg="light">
    <Link to="/" className="navbar-brand">
      Trailr
    </Link>
    <Navbar.Toggle aria-controls="menuBar" />
    <Navbar.Collapse id="menuBar">
      <Nav>
        <Link to="/user/0" className="nav-item nav-link">
          User
        </Link>
        <Link to="/trail/1" className="nav-item nav-link">
          Trail
        </Link>
        {isLoggedIn ? (
          <Nav.Link href="/auth/logout">Signout</Nav.Link>
        ) : (
          <Nav.Link href="/auth/google">Login</Nav.Link>
        )}
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default header;
