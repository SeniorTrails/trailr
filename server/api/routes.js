// import axios framework for http requests
const axios = require('axios');

// import express framework, destructor Router method from library
const { Router } = require('express');

// import all database helper functions
const {
  getUser,
  addUser,
  getTrail,
  addTrail,
  updateTrail,
  deleteTrail,
  updateDifficulty,
  updateComment,
  updateLikeability,
  addComment,
  addPhoto,
  deleteComment,
  deletePhoto,
  addFavorite,
  deleteFavorite,
} = require('../../database/index.js');

// import GCS functions
const { uploadImage } = require('../../helpers/helpers');

// set local variable to  a new instance of express router
const router = Router();

/*  Get Request Handlers */

/*
* route - returns requested trail information when given id number
* use - uses "getTrail" function to retrieve specific trail from DB
* inputs - "getTrail" receives an object with id_trail & id_user
* {Param} - id_trail - deconstructed from req.params
* {Param} - id_user - deconstructed from req.body
* returns - object containing all trail information in DB
*/
router.get('/trails/:id', (req, res) => {
  const { id } = req.query;
  const idT = req.params.id;
  const trailObject = {
    id_trail: idT,
    id_user: id,
  };
  getTrail(trailObject)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/*
* route - makes GET request to trail API for trails in user area when App is rendered
* use - uses axios function to retrieve information on trails in users area from api
* inputs - axios function requires proper headers & params
* {Param} - x-rapidapi-key - private key saved in .env file, found on API website
* {Param} - radius - deconstructed from req.query
* {Param} - lat - deconstructed from req.query
* {Param} - lon - deconstructed from req.query
* returns - an array of objects each containing trail information from API
*/
router.get('/trails', (req, res) => {
  const { radius, lat, lon } = req.query;
  axios({
    method: 'GET',
    url: 'https://trailapi-trailapi.p.rapidapi.com/trails/explore/',
    headers: {
      'content-type': 'application/octet-stream',
      'x-rapidapi-host': 'trailapi-trailapi.p.rapidapi.com',
      'x-rapidapi-key': process.env.TRAIL_API_KEY,
      useQueryString: true,
    },
    params: {
      radius,
      lat,
      lon,
    },
  })
    .then((response) => {
      const trailDataArray = response.data.data;
      res.send(trailDataArray);
    })
    .catch((error) => {
      throw error;
    });
});

/*
* route - retrieves specific user information when given a user id number
* use - uses "getUser" function to retrieve user information from DB
* inputs - "getUser" receives as user id number
* {Param} - id - deconstructed from req.params
* returns - an object of user information from DB containing user info, photos, and photo comments
*/

router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  getUser(id)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/* POST Request Handlers */

/*
* route - adds new user information to the db
* use - uses "addUser" function to add new user information to DB
* inputs - "addUser" receives an object of user information:
*        -- {"google_id", "name", "profile_photo_url"}
* {Param} - body - deconstructed from the req object, "body" is an object
* returns - an object with newly added user id
*/

router.post('/users', (req, res) => {
  const { body } = req;
  addUser(body)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/*
* route - adds new trail information to the db
* use - uses "addTrail" function to add new trail and information to DB
* inputs - "addTrail" receives an object of information:
*        -- {api_id, name, city, region, country, latitude, longitude, url, thumbnail, description}
* {Param} - body - deconstructed from the req object, "body" is an object
* returns - an object with newly added trail id
*/
router.post('/trails', (req, res) => {
  const { body } = req;
  addTrail(body)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/*
* route - adds new trail information to the db
* use - uses "addComment" function to add new user comment about a trail to DB
* inputs - "addComment" receives an object of information:
*        -- { text, id_user, id_photo }
* {Param} - body - deconstructed from the req object, "body" is an object
* returns - an object with newly added comment id
*/
router.post('/comments', (req, res) => {
  const { body } = req;
  addComment(body)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/*
* route - adds new trail information to the db
* use - uses "addPhoto" function to add user photo of a trail to DB
* inputs - "addPhoto" receives an object of information:
*        -- {url, description, lat, lng, id_user, id_trail}
* {Param} - body - deconstructed from the req object, "body" is an object
* returns - an object with newly added photo id
*/
router.post('/photos', (req, res) => {
  const { body } = req;
  addPhoto(body)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/*
* route - adds new trail information to the db
* use1 - uses "uploadImage" function to add an image file to google cloud storage bucket
* inputs - "uploadImage" receives an object of information:
*        -- { originalname, buffer }
* {Param} - myFile - variable set to equal req.file from req object, "myFile" is an object
* returns - an object with newly added photo id
* use2 - uses "addPhoto" function to add photo to DB
* inputs - "addPhoto" receives an object of information:
*        -- {url: photoUrl} - photoUrl returned from "uploadImage"
* {Param} - photoUrl - photoUrl returned from "uploadImage", created local object with "url" key
* returns - an object with newly added photo id
*/
router.post('/uploads', (req, res) => {
  const myFile = req.file;
  uploadImage(myFile)
    .then((photoUrl) => {
      addPhoto({
        url: photoUrl,
      })
        .then((success) => {
          console.log('addPhoto in uploadImage worked', success);
        })
        .catch((error) => {
          throw error;
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

/*
* route - allows user to add specific trail information to the db
* use - uses "addFavorite" function to add a trail to favorites table in db
* inputs - "addFavorite" receives an object of information:
*        -- { id_user, id_trail }
* {Param} - body - deconstructed from the req object, "body" is an object
* returns - returns an object with id of newly added favorite trail
*/
router.post('/favorites', (req, res) => {
  const { body } = req;
  addFavorite(body)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/* PUT Requests Handlers */

/*
* route - allows user to update trail information saved in the db
* use - uses "updateTrail" function to change trail information in db
* inputs - "updateTrail" receives an object of information:
* --{ api_id, name, city, region, country, latitude, longitude, url, thumbnail, description, status}
* {Param} - body - deconstructed from the req object, "body" is an object
* returns - ??????????????
*/
router.put('/trails', (req, res) => {
  const { body } = req;
  updateTrail(body)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/*
* route - allows user to update trail difficulty rating saved in db
* use - uses "updateDifficulty" function to add a trail to favorites table in db
* inputs - "updateDifficulty" receives an object of information:
*        -- { id_user, id_trail, value }
* {Param} - body - deconstructed from the req object, "body" is an object
* returns - returns an object with new average of difficulty ratings for trail
*/
router.put('/difficulty', (req, res) => {
  const { body } = req;
  updateDifficulty(body)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/*
* route - allows user to update trail difficulty rating saved in db
* use - uses "updateLikeability" function to add a trail to favorites table in db
* inputs - "updateLikeability" receives an object of information:
*        -- { id_user, id_trail, value }
* {Param} - body - deconstructed from the req object, "body" is an object
* returns - returns an object with new average of likes for trail
*/
router.put('/likeability', (req, res) => {
  const { body } = req;
  updateLikeability(body)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

// ********* documentation not completed complete after new pull *************** //
/*
* route - allows user to update user comments about a trail saved in db
* use - uses "updateComment" function to update trail comments from users
* inputs - "updateComment" receives an object of information:
*        -- { id_user, id_trail, value }
* {Param} - body - deconstructed from the req object, "body" is an object
* returns - ???????????
*/
router.put('/comments', (req, res) => {
  const { body } = req;
  updateComment(body)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/*  DELETE Requests Handlers */

/*
* route - allows user to delete a trail from db
* use - uses "deleteTrail" function to remove selected trail information from db
* inputs - "deleteTrail" receives an id number :
* {Param} - id - deconstructed from the req object out of the params key value object
* returns - sends back table information for affected rows, "deletedTrailData"
*/
router.delete('/trails/:id', (req, res) => {
  const { id } = req.params;
  deleteTrail(id)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/*
* route - allows user to delete a photo from db
* use - uses "deletePhoto" function to remove selected user added trail photos from db
* inputs - "deletePhoto" receives an id number :
* {Param} - id - deconstructed from the req object out of the params key value object
* returns - sends back table information for affected rows, "deletionResults"
*/
router.delete('/photos/:id', (req, res) => {
  const { id } = req.params;
  deletePhoto(id)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/*
* route - allows user to delete a comment from db
* use - uses "deleteComment" function to remove selected user added trail comments from db
* inputs - "deleteComment" receives an id number :
* {Param} - id - deconstructed from the req object out of the params key value object
* returns - sends back table information for affected rows, "deletedCommentData"
*/
router.delete('/comments/:id', (req, res) => {
  const { id } = req.params;
  deleteComment(id)
    .then((success) => {
      res.send(success);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

/*
* route - allows user to delete a favorite trail form the db
* use - uses "deleteFavorite" function to remove user selected favorite trail from db
* inputs - "deleteFavorite" receives an object of information:
*        -- { id_user, id_trail }
* {Param} - body - deconstructed from the req object, "body" is an object
* returns - sends back table information for affected rows, "deletedFavoriteData"
*/
router.delete('/favorites', (req, res) => {
  const { body } = req;
  deleteFavorite(body)
    .then((success) => {
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
