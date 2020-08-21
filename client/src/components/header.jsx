import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

/**
 * Header to the page, contains all our navigation links
 */
const header = ({ user }) => (
  <Navbar expand="sm" bg="light">
    <Link to="/" className="navbar-brand">
      Trailr
    </Link>
    <Link to="/birdwatcher" className="navbar-brand">
      Birdr
    </Link>
    <Navbar.Toggle aria-controls="menuBar" />
    <Navbar.Collapse id="menuBar">
      <Nav>
        {user.loggedIn ? (
          <>
            <Link to={`/user/${user.id}`} className="nav-item nav-link">
              My Profile
            </Link>
            <Nav.Link href="/auth/logout">Signout</Nav.Link>
          </>
        ) : (
          <Nav.Link href="/auth/google">Login</Nav.Link>
        )}
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default header;
