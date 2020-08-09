// create instance of express router
const { Router } = require('express');

// set local variable to  a new instance of express router
const authRouter = Router();

// create login route
authRouter.get('/login', (req, res) => {
  res.render('Login'); // sends Login.jsx to DOM
});

// create logout route
authRouter.get('/logout', (req, res) => {
  // add in passport handler for logout here
  res.send('Logging out');
});

// create google authorization route
authRouter.get('/google', (req, res) => {
  // add in passport handler for google authentication here
  res.send('Logging in with google');
});

// export "authRouter" variable to be used in other project files
module.exports = {
  authRouter,
};
