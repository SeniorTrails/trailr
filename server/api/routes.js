// import express framework
const { Router } = require('express');

// set local variable to  a new instance of express router
const router = Router();

// route handlers

// will serve static page
// google procedure to serve-up static resources

/* --------------------------------- Get Requests ------------------------------------------------*/

// tested - works as written
router.get('/', (req, res) => {
  res.send(" '/' page route was hit");
});

// tested - works as written
router.get('/api/trails', (req, res) => {
  res.send('"/api/trails" route was hit');
});

// tested - must be written '/users/id'
router.get('/trails/:id', (req, res) => {
  res.send('"Trails/:id" route was hit');
});

// tested - must be written '/users/id'
router.get('/users/:id', (req, res) => {
  res.send('"Users/:id" route was hit');
});

/* --------------------------------- POST Requests -----------------------------------------------*/
// tested - must be written '/trails/id'
router.post('/trails/:id', (req, res) => {
  res.send('"Trails/:id" POST route was hit');
});

/* --------------------------------- PUT Requests -----------------------------------------------*/
// tested - must be written '/trails/id'
router.put('/trails/:id', (req, res) => {
  res.send('"Trails/:id" PUT route was hit');
});

/* --------------------------------- DELETE Requests ---------------------------------------------*/
// tested - must be written '/trails/id'
router.delete('/trails/:id', (req, res) => {
  res.send('"Trails/:id" Delete route was hit');
});

module.exports = {
  router,
};
