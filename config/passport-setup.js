// require passport library
const passport = require('passport');

// import googleStrategy from passport library
const GoogleStrategy = require('passport-google-oauth20');

// import db query functions from database/index.js
const { addUser } = require('../database/index');

// set up passport middleware to use google strategy in our project
passport.use(
  new GoogleStrategy({
  // options for the strategy, input clientID && clientSecret
    callbackURL: process.env.NODE_ENV === 'PROD' ? 'https://trailr2.uc.r.appspot.com/auth/google/redirect' : '/auth/google/redirect',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }, (accessToken, refreshToken, profile, done) => {
    // passport callback function
    // console.log('passport callback fired'); // indication that function fired
    console.log('USER PROFILE', profile); // shows returned profile information
    const { displayName, id, photos } = profile;
    addUser({
      google_id: id,
      name: displayName,
      profile_photo_url: photos[0].value,
    })
      .then((newUser) => {
        console.log(`Created New User: ${newUser}`);
        // completes the http request, and sends information to next function in middleware chain
        done(null, newUser);
      })
      .catch((error) => {
        done(error);
      });
  }),
);
