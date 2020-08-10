// import express framework
const { Router } = require('express');

// importing DB query functions
const {
  getUser, getTrail, addTrail, updateTrail, deleteTrail, addUser, updateLikeability, updateDifficulty} = require('../../database/index.js');

// set local variable to  a new instance of express router
const router = Router();

// route handlers

/* --------------------------------- Get Requests ------------------------------------------------*/

// tested - must be written '/users/id'
router.get('/trails/:id', (req, res) => {
  getTrail()
    .then((success) => {
      res.send('******HIT THE THEN in getTrail********');
      res.send(success);
    })
    .catch((error) => {
      res.setStatus(500);
      throw error;
    });
});

// tested - must be written '/users/id'
router.get('/users/:id', (req, res) => {
  getUser()
    .then((success) => {
      res.send('******HIT THE THEN in getUser********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/* --------------------------------- POST Requests -----------------------------------------------*/
// tested - must be written '/trails/id'
router.post('/trails/:id', (req, res) => {
  addTrail()
    .then((success) => {
      res.send('******HIT THE THEN of AddTrails********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

// // testing addUser function
// router.post('/user/', (req, res) => {
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

/* --------------------------------- PUT Requests -----------------------------------------------*/
// tested - must be written '/trails/id'
router.put('/trails/:id', (req, res) => {
  updateTrail()
    .then((success) => {
      res.send('******HIT THE THEN of updateTrail********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/* --------------------------------- DELETE Requests ---------------------------------------------*/
// tested - must be written '/trails/id'
router.delete('/trails/:id', (req, res) => {
  deleteTrail()
    .then((success) => {
      res.send('******HIT THE THEN of deleteTrail********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

module.exports = {
  router,
};
