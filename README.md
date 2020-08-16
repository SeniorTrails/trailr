![🥾](https://github.com/SeniorTrails/trailr/blob/master/client/assets/imgs/mountainHeader.png)

# Trailr
Giving users a social-media-style community to share their experiences while engaging in an outdoor (and socially distant) activity

# Description
Welcome to Trailr. Trailr provides users access to hiking trails in their area, as well as search-by-location functionality. Trails load automatically as a user traverses to new areas within Google Maps. Users can save their favorite trails to plan trips, and rate the difficulty and likeability of each trail that they encounter. Users can also upload geo-tagged photos, sharing interesting things they find along the trail route with other users. Users can comment on their own photos and photos that others upload, and they can edit their own comments.


# Dependencies
Stack:
MySQL
Express
React
Node
Babel
Axios
Cookie Parser
Eslint
Bootstrap
Passport
Google Cloud Storage
Multer
Google Map React
Google Marker Clusterer
```javascript
"dependencies": {
    "@brainhubeu/react-carousel": "^1.19.26",
    "@google-cloud/storage": "^5.2.0",
    "@google/markerclusterer": "^2.0.8",
    "@types/googlemaps": "^3.39.11",
    "@types/markerclustererplus": "^2.1.33",
    "axios": "^0.19.2",
    "body-parser": "^1.19.0",
    "bootstrap": "^4.5.2",
    "cookie-parser": "^1.4.5",
    "dotenv": "^8.2.0",
    "eslint-plugin-jsx-a11y": "^6.3.1",
    "exifr": "^5.0.3",
    "express": "^4.17.1",
    "express-session": "^1.17.1",
    "fast-crc32c": "^2.0.0",
    "google-map-react": "^2.0.8",
    "heic2any": "0.0.3",
    "jquery": "^3.5.1",
    "lodash.isempty": "^4.4.0",
    "mime": "^2.4.6",
    "multer": "^1.4.2",
    "mysql": "^2.18.1",
    "nodemon": "^2.0.4",
    "passport": "^0.4.1",
    "passport-google-oauth20": "^2.0.0",
    "points-cluster": "^0.1.4",
    "popper.js": "^1.16.1",
    "prop-types": "^15.7.2",
    "react": "^16.13.1",
    "react-bootstrap": "^1.3.0",
    "react-dom": "^16.13.1",
    "react-google-maps": "^9.4.5",
    "react-hot-loader": "^4.12.21",
    "react-icons": "^3.10.0",
    "react-router": "^5.2.0",
    "react-router-dom": "^5.2.0",
    "react-scripts": "^3.4.1",
    "react-static": "^7.4.2",
    "styled-components": "^5.1.1"
  },
  "devDependencies": {
    "babel-eslint": "^10.1.0",
    "eslint": "^7.6.0",
    "eslint-config-airbnb": "^18.2.0",
    "eslint-plugin-import": "^2.22.0",
    "eslint-plugin-react": "^7.20.5",
    "parcel-bundler": "^1.12.4"
  }
```

# Installation

Development:
```
npm install                     // installs dependencies
npm run build-react             // runs compiler for React
mysql -u root < trailr.sql      // initializes and seeds database
npm run start:dev               // starts development server
                                // connecting to local mysql

                      - or -

npm run start:prod              // starts development server
                                // connecting to Cloud SQL database
```
Production:
```
npm run start                   // runs production server
```




# Environment Variables
Place in a .env file in outermost directory:
```
TRAIL_API_KEY                   // Trail RapidAPI Key
GOOGLE_MAPS_API_KEY             // Google Places API Key
GOOGLE_CLIENT_ID                // Google OAuth2 Credentials
GOOGLE_CLIENT_SECRET            // Google OAuth2 Credentials
SECRET                          // Secret for sessions
GCLOUD_BUCKET_NAME              // GoogleCloud Storage name for photos

// these are used with npm run start:prod
DB_NAME=trailr                  // Cloud SQL database name
DB_USER                         // Cloud SQL username
DB_PASS                         // Cloud SQL password
DB_HOST                         // Cloud SQL address
```
Place in app.yaml file in outermost directory when you’re ready to deploy to the gCloud app engine:
```
runtime: nodejs12
env_variables:
  TRAIL_API_KEY:                // Trail RapidAPI Key
  GOOGLE_MAPS_API_KEY:          // Google Places API Key
  GOOGLE_CLIENT_ID:             // Google OAuth2 Credentials
  GOOGLE_CLIENT_SECRET:         // Google OAuth2 Credentials
  SECRET:                       // Secret for sessions
  GCLOUD_BUCKET_NAME:           // GoogleCloud Storage name for photos
  DB_NAME: 'trailr'             // Cloud SQL database name
  DB_USER:                      // Cloud SQL username
  DB_PASS:                      // Cloud SQL password
  DB_HOST:                      // Cloud SQL password
  DB_INSTANCE_CONNECTION_NAME:  // DB Instance Cloud SQL name
  NODE_ENV: 'PROD'              // Required to run Node on production
```

# Contributing

Contributing to others’ projects is an avenue to learn new software development skills and experience new technologies. The pull request is how your personal contributions will be added to the project. The following is an overview of the Git project management workflow:

Search project for contribution instructions and follow them if present.
Fork project repo from your personal Github account.
Copy the fork and clone repo onto your local machine.
Add the original repository (the you forked) as a remote called upstream.
If you created your fork a while ago be sure to pull upstream changes into your local repository.
Create a new branch to work on! Branch from develop if it exists, else from master.
Implement/fix your feature, comment your code.
Follow the code style of the project, including indentation.
If the project has included tests use them.
Add additional tests or convert existing tests as necessary.
Add or convert project documentation as needed.
Push your working branch to your forked repo on Github.
Make a pull request from your forked repo to the origin master or development branch if present.
Once your pull request is merged, pull down upstream master to your local repo and delete any additional branch(es) you may have created.
Commit messages should be written in present tense describing what the committed code does and not what you changed in the code.

# References
[Trail RapidAPI Key](https://rapidapi.com/trailapi/api/trailapi)

# License
ISC License (ISC)
Copyright 2020

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.


# Contact
* gduple@gmail.com
* dtroyano86@gmail.com
* peterklingelhofer@gmail.com
* jamesfeltonthomas@gmail.com
