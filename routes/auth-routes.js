// create instance of express router
const { Router } = require('express');

// import passport library to file
const passport = require('passport');

// set local variable to  a new instance of express router
const authRouter = Router();

// create login route
authRouter.get('/login', (req, res) => {
  // add in passport handler for logout here
  res.send('Login'); // sends Login.jsx to DOM
  // finish with redirect to "/"
});

// create logout route
authRouter.get('/logout', (req, res) => {
  // add in passport handler for logout here
  res.send('Logging out');
  // finish with redirect to "/"
});

/* ------------------------------ Google Auth Route && Redirect --------------------------------- */
// authenticate user with google 3rd party
authRouter.get('/google',
// redirect users to google authenticate screen
  passport.authenticate('google', {
    scope: ['profile'],
  }));

// callback route for google to redirect to
authRouter.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.send('You reached the callback URI'); // this works
  // res.redirect('/'); // this works sending back to home screen
});

// export "authRouter" variable to be used in other project files
module.exports = {
  authRouter,
};
