// require .env package
require('dotenv').config();

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

// require passport-setup file, to enable passport middleware
const passportSetup = require('../config/passport-setup');

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

// disable the name setting feature on the app settings table
app.disable('x-powered-by');
// set up express middleware to work with multer
app.use(multerMid.single('file'));

// direct express to certain middleware for requests on certain paths
app.use('/', express.static(`${__dirname}/../client/dist`));

// utilize cookie-parser middleware from express framework
app.use(cookieParser());

// utilize body parser on incoming requests to server
app.use(bodyParser.json());

// utilize the urlencoder from express framework
app.use(bodyParser.urlencoded({ extended: false }));

// utilize express-session middleware to read session cookies
app.use(session({
  secret: process.env.SECRET, // not sure if this is right
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }, //don't know if we need this
}));

// utilize passport middleware initialize && session authentication functionality
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  // use find user by id
  // getUser(id)
  //   .then((user) => {
  //   })
  //   .catch((error) => {
  //     throw error;
  //   });
  done(null, user);
});

// configure the PORT server will listen for calls on
const PORT = 8080;

app.use('/api', router);

// authentication routes
app.use('/auth', authRouter);

// set server to listen for requests on configured report
app.listen(PORT, () => {
  console.log(`Server Walking The Trails on http://localhost:${PORT}`);
});
