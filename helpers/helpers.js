const util = require('util');
const gc = require('../config/google-cloud-storage');

const bucket = gc.bucket('trailr_photos'); // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file) => new Promise((resolve, reject) => {
  console.log('******HIT UPLOADIMAGE FUNC******************', file);
  const { originalname, buffer } = file;

  const blob = bucket.file(originalname.replace(/ /g, '_'));
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('finish', () => {
    console.log('******HIT blobStream.on******************');
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    resolve(publicUrl);
  })
    .on('error', (error) => {
      console.log(error);
      reject('Unable to upload image, something went wrong');
    })
    .end(buffer);
});

module.exports = {
  uploadImage,
};
