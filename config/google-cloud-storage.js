// require cloud storage service via google
const { Storage } = require('@google-cloud/storage');

// require path library
const path = require('path');

// our project ID
const GOOGLE_CLOUD_PROJECT_ID = 'trailr2';

// path to the project private key
const GOOGLE_CLOUD_KEYFILE = path.join(__dirname, './trailr-cloud-storage.json');

// create a new instance of the cloud storage service in our project for data persistance
const storage = new Storage({
  // projectId: GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: GOOGLE_CLOUD_KEYFILE,
});

module.exports = storage;
