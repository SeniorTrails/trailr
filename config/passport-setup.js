// require passport library
const passport = require('passport');

// import googleStrategy from passport library
const GoogleStrategy = require('passport-google-oauth20');

// import clientID and clientSecret in this file to use hidden auth credentials
const keys = require('./keys');

// set up passport middleware to use google strategy in our project
passport.use(
  new GoogleStrategy({
  // options for the strategy, input clientID && clientSecret
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
  }, (accessToken, refreshToken, profile, done) => {
    // passport callback function
    console.log('passport callback fired');
    console.log(profile);
  }),
);
