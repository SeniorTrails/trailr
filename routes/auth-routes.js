// create instance of express router
const { Router } = require('express');

// import passport library to file
const passport = require('passport');

// set local variable to a new instance of express router
const authRouter = Router();

/**
 * login route for users to begin a new session
 * sends Login.jsx to DOM
 * finish by redirecting user to homepage "/"
 */
authRouter.get('/login', (req, res) => {
  res.send('Login');
  res.redirect('/');
});

/**
 * logout route for users to end current session
 * terminate current user session & remove the req.user property
 * perform logout operation by destroying current user session
 * finish by redirecting user to homepage "/"
 */

authRouter.get('/logout', (req, res) => {
  req.logOut();
  req.session.destroy();
  res.redirect('/');
});

// use passport sessions method to keep track of a logged in user associated with a given session
authRouter.get('/session', (req, res) => {
  console.log("REQ.SESSION", req.session);
  console.log("REQ.USER", req.user)
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(200).json(null);
  }
});

/* ------------------------------ Google Auth Route && Redirect --------------------------------- */

/**
 * authenticate users with google 3rd party authentication
 * redirect users to google authenticate screen
 * retrieve the users profile information
 */

authRouter.get('/google',
  passport.authenticate('google', {
    scope: ['profile'],
  }));

/**
 * google callback route returns users to home screen following google authentication
 * utilize passport.authenticate function to authenticate  user via google
 * retrieve the users profile information
 * finish by redirecting user back to homepage "/"
 */

authRouter.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

// export "authRouter" variable to be used in other project files
module.exports = {
  authRouter,
};
