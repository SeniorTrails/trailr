// require .env package
require('dotenv').config();

const cors = require('cors');

// require passport-setup file, to enable passport middleware
require('../config/passport-setup');

// require path module to provide utilities for working with static file and directory paths
const path = require('path');

// import express framework
const express = require('express');

// import multer framework for middle functionality
const multer = require('multer');

// import passport framework
const passport = require('passport');

// import body parser for response information
const bodyParser = require('body-parser');

// import cookie parser from express framework
const cookieParser = require('cookie-parser');

// import express-session middleware from express framework
const session = require('express-session');

// import "router" variable from routes.js file
const { router } = require('./api/routes');

// import "authRouter" from auth-routes.js file
const { authRouter } = require('../routes/auth-routes');

// import db query functions from database/index.js
const { getUser } = require('../database/index');

// create new instance of express frame work saved to local variable
const app = express();

// describe multer upload object to be stored in bucket
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(cors());

// disable the name setting feature on the app settings table
app.disable('x-powered-by');
// set up express middleware to work with multer
app.use(multerMid.single('file'));

// utilize cookie-parser middleware from express framework
app.use(cookieParser());

// utilize body parser on incoming requests to server
app.use(bodyParser.json());

// utilize the urlencoder from express framework
app.use(bodyParser.urlencoded({ extended: false }));

// utilize passport middleware initialize && session authentication functionality
app.use(session({
  secret: process.env.SECRET, // not sure if this is right
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }, //don't know if we need this
}));

/**
 * utilize middleware to determine which user data should be stored in the session
 * if login is successful then serializeUser decides what user information should get stored
 * in the session and a cookie is sent to the browser for the same to maintain the session.
 */
passport.serializeUser((user, done) => {
  // eslint-disable-next-line no-console
  console.info('serilize', user);
  done(null, { id: user.id, name: user.name });
});

/**
 * utilize middleware to retrieve persisted user data for current session
 * deserializeUser method is called on all subsequent user requests and
 * enables us to load additional user information on every request to session cookie
 */
passport.deserializeUser((userSession, done) => {
  getUser(userSession.id)
    .then((user) => {
      const userInfo = {
        id: user.id,
        name: user.name,
      };
      done(null, userInfo);
    })
    .catch((error) => {
      done(error);
    });
});

// set express middleware to utilize passport to initialize new session
app.use(passport.initialize());

// set express middleware to utilize passport to persist user sessions
app.use(passport.session());

// configure the PORT server will listen for calls on
const PORT = 8080;

// utilize express-session middleware to read session cookies

// direct express to certain middleware for requests on certain paths
app.use('/api', router);

// authentication routes
app.use('/auth', authRouter);

// serve static files from local directory
app.use('/', express.static(path.join(__dirname, '/../client/dist')));

// reroutes any route to the index.html so React Router works
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/dist/index.html'));
});

// set server to listen for requests on configured report
app.listen(process.env.PORT || PORT, () => {
  console.info(`Server Walking The Trails on http://localhost:${PORT}`);
});
