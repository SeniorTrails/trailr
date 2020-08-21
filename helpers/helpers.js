const util = require('util');
const gc = require('../config/google-cloud-storage');

const bucket = gc.bucket(process.env.GCLOUD_BUCKET_NAME); // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file;

  const blob = bucket.file(originalname.replace(/ /g, '_'));
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    resolve(publicUrl);
  })
    .on('error', (error) => {
      console.log(error);
      reject(error, 'Unable to upload image, something went wrong');
    })
    .end(buffer);
});

/**
 * Checks to see if a user is logged in to protect api routes
 * @param {Object} user req.user
 */
const authChecker = (user) => !!user;

module.exports = {
  uploadImage,
  authChecker,
};
