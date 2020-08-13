import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import MapWrapped from './components/MapWrapped.jsx';
import Header from './components/header.jsx';
import Trail from './components/Trail.jsx';
import User from './components/User.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import NoMatchPage from './components/NoMatchPage.jsx';
import HeaderImage from './components/HeaderImage.jsx';

const app = () => (
  <BrowserRouter>
    <HeaderImage />
    <div className="container">
      <Header />
      <div className="row">
        <Switch>
          <Route path="/trail/:id">
            <Trail />
          </Route>
          <Route path="/user/:id">
            <User />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <div className="col-12" style={{ width: '100%', height: '600px' }}>
              <MapWrapped
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.GOOGLE_MAPS_API_KEY}`}
                containerElement={<div style={{ height: '800px' }} />}
                mapElement={<div style={{ height: '100%' }} />}
                loadingElement={<div style={{ height: '100%' }} />}
              />
            </div>
          </Route>
          <Route path="/404"><NoMatchPage /></Route>
        </Switch>
      </div>
    </div>
  </BrowserRouter>
);

export default app;
