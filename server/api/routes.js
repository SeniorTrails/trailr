// import express framework
const { Router } = require('express');

//importing DB query functions
const { getUser, getTrail, addTrail, updateTrail, deleteTrail} = require('../../database/index.js');

// set local variable to  a new instance of express router
const router = Router();

// route handlers

// will serve static page
// google procedure to serve-up static resources

/* --------------------------------- Get Requests ------------------------------------------------*/

// tested - works as written
//this route will server static file at "client/dist/index.html"
// router.get('/', (req, res) => {
//   res.send(res.body);
// });

// tested - must be written '/users/id'
router.get('/trails/:id', (req, res) => {
  getTrail()
    .then(()=>{
      res.send('******HIT THE THEN in getTrail********')
    })
    .catch((error)=>{
      res.sendStatus(500)
    })
});

// tested - must be written '/users/id'
router.get('/users/:id', (req, res) => {
  getUser()
  .then(()=>{
    res.send('******HIT THE THEN in getUser********')
  })
  .catch((error)=>{
    res.sendStatus(500)
  })

});

/* --------------------------------- POST Requests -----------------------------------------------*/
// tested - must be written '/trails/id'
router.post('/trails/:id', (req, res) => {
  addTrail()
    .then((success)=>{
      res.send('******HIT THE THEN of AddTrails********')
    })
    .catch((error)=>{
      res.sendStatus(500)
    })
});

/* --------------------------------- PUT Requests -----------------------------------------------*/
// tested - must be written '/trails/id'
router.put('/trails/:id', (req, res) => {
  updateTrail()
    .then((success)=>{
      res.send('******HIT THE THEN of updateTrail********')
    })
    .catch((error)=>{
      res.sendStatus(500)
    })
});

/* --------------------------------- DELETE Requests ---------------------------------------------*/
// tested - must be written '/trails/id'
router.delete('/trails/:id', (req, res) => {
  deleteTrail()
    .then((success)=>{
      res.send('******HIT THE THEN of deleteTrail********')
    })
    .catch((error)=>{
      res.sendStatus(500)
    })
});

module.exports = {
  router,
};
