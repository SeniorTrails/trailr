// import express framework
const { Router } = require('express');

// importing DB query functions
const {
  getUser,
  addUser,
  getTrail,
  addTrail,
  updateTrail,
  deleteTrail,
  updateDifficulty,
  updateLikeability,
  addComment,
  addPhoto,
  deleteComment,
  deletePhoto,
} = require('../../database/index.js');

// import GCS functions
const { uploadImage } = require('../../helpers/helpers');

// set local variable to  a new instance of express router
const router = Router();

// route handlers

/* --------------------------------- Get Requests ------------------------------------------------*/

// tested - sends back whole trail object, "getTrail"
router.get('/trails', (req, res) => {
  const { body } = req;
  getTrail(body)
    .then((success) => {
      console.log('******HIT THE THEN in getTrail********');
      res.send(success);
    })
    .catch((error) => {
      res.setStatus(500);
      throw error;
    });
});

// tested - sends back user info object, photos, and photo comments, getUser ************
router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  // console.log('REQ OBJ', req.params);
  // console.log('User ID', id);
  getUser(id)
    .then((success) => {
      console.log('******HIT THE THEN in getUser********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/* --------------------------------- POST Requests -----------------------------------------------*/
// tested - sends back object with user id, "addUser"
router.post('/users', (req, res) => {
  const { body } = req;
  addUser(body)
    .then((success) => {
      console.log('******HIT THE THEN of addUser********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

// tested - sends back object with trail id, "addTrail"
router.post('/trails', (req, res) => {
  const { body } = req;
  addTrail(body)
    .then((success) => {
      console.log('******HIT THE THEN of AddTrails********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

// tested - sends back object with comment id in it "addComment"
router.post('/comments', (req, res) => {
  const { body } = req;
  addComment(body)
    .then((success) => {
      console.log('******HIT THE THEN of addComment********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

// tested - sends back object with photo id in it "addPhoto",
router.post('/photos', (req, res) => {
  const { body } = req;
  addPhoto(body)
    .then((success) => {
      console.log('******HIT THE THEN of addPhoto********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

// Google cloud storage route
// router.post('/uploads', async(req, res, next) => {
//   try {
//     const myFile = req.file;
//     const imageUrl = await uploadImage(myFile);
//     res
//       .status(200)
//       .json({
//         message: 'Upload was successful',
//         data: `${imageUrl}`,
//       });
//   } catch (error) {
//     next(error);
//   }
// });

router.post('/uploads', (req, res) => {
  const myFile = req.file;
  uploadImage(myFile)
    .then((photoUrl) => {
      // console.log('*****photoUrl*****', photoUrl);
      addPhoto({
        url: photoUrl,
      })
        .then((success) => {
          console.log('addPhoto in uploadImage worked', success);
        })
        .catch((error) => {
          console.log(error);
        });
      res.json({
        message: 'Upload was successful',
        data: `${photoUrl}`,
      });
      res.send();
    })
    .catch((error) => {
      throw error;
    });
});

/* --------------------------------- PUT Requests -----------------------------------------------*/
// tested - not working yet
router.put('/trails', (req, res) => {
  const { body } = req;
  updateTrail(body)
    .then((success) => {
      console.log('******HIT THE THEN of updateTrail********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});
// tested - send back object with new rating, updateDifficulty
router.put('/difficulty', (req, res) => {
  console.log('******HIT THE updateDifficulty router********');
  const { body } = req;
  updateDifficulty(body)
    .then((success) => {
      console.log('******HIT THE THEN of updateDifficulty********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

// tested - send back object with new rating, updateLikeability,
router.put('/likeability', (req, res) => {
  const { body } = req;
  updateLikeability(body)
    .then((success) => {
      console.log('******HIT THE THEN of updateLikeability********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/* --------------------------------- DELETE Requests ---------------------------------------------*/

// tested - must be written '/trails/<id#>', works && sends back table information after delete
router.delete('/trails/:id', (req, res) => {
  const { id } = req.params;
  deleteTrail(id)
    .then((success) => {
      console.log('******HIT THE THEN of deleteTrail********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

// tested => route works, sends back table information for affected rows, "deletePhoto"
router.delete('/photos/:id', (req, res) => {
  const { id } = req.params;
  deletePhoto(id)
    .then((success) => {
      console.log('******HIT THE THEN of deletePhoto********');
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

// tested - works, sends back table information for affected rows, "deleteComment"
router.delete('/comments/:id', (req, res) => {
  const { id } = req.params;
  deleteComment(id)
    .then((success) => {
      console.log('******HIT THE THEN of deleteComment********');
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
