import React from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './SearchBox.jsx';

const header = () => {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <Link to="/">
        <a class="navbar-brand" href="#">
          Trailr
        </a>
      </Link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <Link to="user/0">
            <a class="nav-item nav-link active" href="#">
              User <span class="sr-only">(current)</span>
            </a>
          </Link>
          <Link to="mytrails">
            <a class="nav-item nav-link active" href="#">
              My Trails <span class="sr-only">(current)</span>
            </a>
          </Link>
          <Link to="login">
            <a class="nav-item nav-link" href="#">
              Login
            </a>
          </Link>
          <Link to="signout">
            <a class="nav-item nav-link" href="#">
              Signout
            </a>
          </Link>
        </div>
      </div>
          <SearchBox />
    </nav>
  );
};

export default header;
