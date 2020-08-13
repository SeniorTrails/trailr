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
  req.logOut();
  res.redirect('/');
  // finish with redirect to "/"
});

/* ------------------------------ Google Auth Route && Redirect --------------------------------- */
// authenticate user with google 3rd party
authRouter.get('/google',
// redirect users to google authenticate screen
  passport.authenticate('google', {
    // retrieve the users profile information
    scope: ['profile'],
  }));

// callback route for google to redirect to homepage "/"
authRouter.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  console.log("USER", req.user);
  console.log("COOKIES", req.cookies);
  console.log("SIGNED COOKIES", req.signedCookies);
  res.redirect('/'); // this works sending back to home screen
  // res.send('You reached the callback URI'); // this works
});

// export "authRouter" variable to be used in other project files
module.exports = {
  authRouter,
};

// // testing addUser function
// authRouter.post('/user/', (req, res) => {
//   const userObject = req.body;
//   addUser(userObject)
//     .then((success) => {
//       res.send(success);
//     })
//     .catch((error) => {
//       res.sendStatus(500);
//       throw error;
//     });
// });