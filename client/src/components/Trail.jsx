import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import { getTrailData, updateUserRating } from '../helpers';
import Input from './input.jsx';
import Map from './TrailMap.jsx';
import Carousel from './Carousel.jsx';
import AddComment from './AddComment.jsx';
import AddPicture from './AddPicture.jsx';

const data = {
  id: 279988,
  name: 'Eagle Trail',
  url: 'https://www.singletracks.com/bike-trails/eagle-trail-8663/',
  description:
    'Nice easy trail.  Smaller in width than South or North Loop. South side of trail borders the Beaver Pond.',
  city: 'Mandeville',
  region: 'Louisiana',
  country: 'United States',
  lat: 30.35324,
  lon: -90.02715,
  difficulty: 3,
  likeability: 4,
  thumbnail:
    'https://images.singletracks.com/blog/wp-content/uploads/2014/06/et3-orig.jpg',
};

const userData = {
  diff: 2,
  like: 1,
};

const photos = [
  {
    id: 1,
    url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Natchez_Trace_Trail.jpg/1280px-Natchez_Trace_Trail.jpg',
    lat: 30.35121,
    lng: -90.026479,
    comments: [
      {
        id: 1,
        text:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        name: 'Daniel Troyano',
      },
      {
        id: 2,
        text:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        name: 'Daniel Troyano',
      },
      {
        id: 3,
        text:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        name: 'Daniel Troyano',
      },
    ],
  },
  {
    id: 2,
    url:
      'https://upload.wikimedia.org/wikipedia/commons/c/ce/North_Country_Trail_Manistee_Forest.jpg',
    lat: 30.350458,
    lng: -90.026045,
    comments: [
      {
        id: 4,
        text:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        name: 'Caylie Sadin',
      },
      {
        id: 5,
        text:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        name: 'Daniel Troyano',
      },
    ],
  },
  {
    id: 5,
    url:
      'https://vbwsjdqd1l-flywheel.netdna-ssl.com/wp-content/uploads/2014/04/Santos-Trails-1.jpg',
    lat: 30.352326,
    lng: -90.02711,
    comments: [
      {
        id: 4,
        text:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        name: 'Caylie Sadin',
      },
      {
        id: 5,
        text:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        name: 'Daniel Troyano',
      },
    ],
  },
  {
    id: 3,
    url:
      'https://www.pittsburghmagazine.com/content/uploads/2020/03/cb-cook-forest-trail1.jpg',
    lat: 30.35326,
    lng: -90.027236,
    comments: [
      {
        id: 4,
        text:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        name: 'Caylie Sadin',
      },
      {
        id: 5,
        text:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        name: 'Daniel Troyano',
      },
    ],
  },
  {
    id: 4,
    url: 'https://www.cliftonpark.com/images/100acretrail.jpg',
    lat: 30.348433,
    lng: -90.026569,
    comments: [
      {
        id: 4,
        text:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        name: 'Caylie Sadin',
      },
      {
        id: 5,
        text:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        name: 'Daniel Troyano',
      },
    ],
  },
];

const ratingOptions = [
  { value: '', label: '' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

/**
 * The Trail Page component
 */
const trail = () => {
  const { id } = useParams();
  const [trailInfo, setTrailInfo] = useState({});
  const [photoInfo, setPhotoInfo] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [currentPhoto, setCurrentPhoto] = useState(0);

  // Set all the initial data with DB calls based on id in useParams
  useEffect(() => {
    getTrailData(id)
      .then(trailData => {
        // setTrailInfo(trailData);
        // setPhotoInfo(trailData.photos);
        // Check if User is logged in to set User ratings
        setTrailInfo(data);
        setPhotoInfo(photos);
        setUserRatings({
          userLoaded: true,
          like: {
            value: userData.like,
            edit: false,
          },
          diff: {
            value: userData.diff,
            edit: false,
          },
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  /**
   * Toggles wether the rating is editable based on user clicks, if it is
   *  already editable doesn't toggle if they click the selecter
   * @param {Event} e the clicked event
   * @param {String} target the value to edit
   */
  const editable = (e, target) => {
    const newValue = { ...userRatings[target] };
    // If you don't click the select turn it off and on
    if (e.target.tagName !== 'SELECT') {
      newValue.edit = !newValue.edit;
    } else {
      newValue.edit = true;
    }
    setUserRatings((prev) => ({ ...prev, [target]: newValue }));
  };

  /**
   * Custom changeHandler for ratings that updates DB whenever they are changed
   * @param {Object} target input element to use to update the DB
   */
  const changeHandler = ({ target }) => {
    // USER ID IS HARD CODED FIX THIS
    updateUserRating(target.name, target.value, 1, id)
      .then((newRating) => {
        console.log('USER ID IS HARD CODED FIX THIS');
        const updatedElement = { ...userRatings[target.name] };
        updatedElement.value = target.value;
        updatedElement.edit = false;
        setUserRatings((prev) => ({ ...prev, [target.name]: updatedElement }));
        setTrailInfo((prev) => {
          const updatedTrailInfo = { ...prev };
          if (target.name === 'like') {
            updatedTrailInfo.likeability = newRating;
          } else {
            updatedTrailInfo.difficulty = newRating;
          }
          return updatedTrailInfo;
        });
      })
      .catch((err) => {
        console.error(err);
      });
    // THIS IS WHERE WE CHANGE THE RATING IN THE DB
    const updatedElement = { ...userRatings[target.name] };
    updatedElement.value = target.value;
    updatedElement.edit = false;
    setUserRatings((prev) => ({ ...prev, [target.name]: updatedElement }));
  };

  /**
   * Updates the photo being shown to the given Id
   * @param {Number} photoId new photoId
   */
  const changeCurrentPhoto = (photoId) => {
    setCurrentPhoto(photoId);
  };

  /**
   * After the DB call this appends the new comment to the photo for the user,
   *  so that we don't have to make additional DB calls
   * @param {Object} newComment comment to add to the photo
   */
  const appendComments = (newComment) => {
    const updatedInfo = [...photoInfo];
    const updatedPhoto = { ...updatedInfo[currentPhoto] };
    updatedPhoto.comments.push({ ...newComment });
    updatedInfo[currentPhoto] = updatedPhoto;
    setPhotoInfo(updatedInfo);
  };

  /**
   * After the DB call this appends the new photo to the trail for the user,
   *  so that we don't have to make additional DB calls
   * @param {Object} newPhotos photo to add to the trail
   */
  const appendPhoto = (newPhotos) => {
    const updatedInfo = [...photoInfo];
    Object.keys(newPhotos).forEach((key) => {
      updatedInfo.push({
        ...newPhotos[key],
        comments: [],
        id: photoInfo.length + 1,
      });
    });
    setPhotoInfo(updatedInfo);
  };

  /**
   * Sets the color of the Badge based on the rating
   * @param {Number} num rating to dicate color by
   */
  const colorPicker = (num) => {
    switch (+num) {
      case 1:
      case 2:
        return 'danger';
      case 4:
      case 5:
        return 'success';
      case 3:
      default:
        return 'info';
    }
  };

  return (
    <>
      <Col xs={6}>
        <Row>
          <Col xs={9}>
            <h2>{trailInfo.name}</h2>
          </Col>
          <Col xs={3}>
            <AddPicture
              appendPhoto={appendPhoto}
              center={{ lat: trailInfo.lat, lng: trailInfo.lon }}
            />
          </Col>
        </Row>
        <div style={{ width: '100%', height: '300px' }}>
          {!photoInfo.length ? null : (
            <Map
              googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.GOOGLE_MAPS_API_KEY}`}
              containerElement={<div style={{ height: '100%' }} />}
              mapElement={<div style={{ height: '100%' }} />}
              loadingElement={<div style={{ height: '100%' }} />}
              location={{ lat: trailInfo.lat, lng: trailInfo.lon }}
              id={trailInfo.id}
              photoInfo={photoInfo}
              changeCurrentPhoto={changeCurrentPhoto}
              currentPhoto={currentPhoto}
            />
          )}
        </div>
        <div>
          <p>{trailInfo.description}</p>
          <Image className="w-50" src={trailInfo.thumbnail} />
          <Row>
            <Col xs={4}>
              <h3>
                Difficulty
                <Badge variant={colorPicker(trailInfo.difficulty)}>
                  {trailInfo.difficulty}
                </Badge>
              </h3>
              <h3>
                Likeability
                <Badge variant={colorPicker(trailInfo.likeability)}>
                  {trailInfo.likeability}
                </Badge>
              </h3>
            </Col>
            {!userRatings.userLoaded ? null : (
              <Col xs={8}>
                <div
                  onClick={(e) => editable(e, 'diff')}
                  style={{ marginBottom: '8px' }}
                >
                  <h3>
                    My Difficulty
                    {userRatings.diff.edit ? (
                      <Input
                        value={userRatings.diff.value}
                        changeHandler={changeHandler}
                        name="diff"
                        type="select"
                        options={ratingOptions}
                        style={{ display: 'inline' }}
                      />
                    ) : (
                      <Badge variant={colorPicker(userRatings.diff.value)}>
                        {userRatings.diff.value}
                      </Badge>
                    )}
                  </h3>
                </div>
                <div onClick={(e) => editable(e, 'like')}>
                  <h3>
                    My Likeability
                    {userRatings.like.edit ? (
                      <Input
                        value={userRatings.like.value}
                        changeHandler={changeHandler}
                        name="like"
                        type="select"
                        options={ratingOptions}
                        style={{ display: 'inline' }}
                      />
                    ) : (
                      <Badge variant={colorPicker(userRatings.like.value)}>
                        {userRatings.like.value}
                      </Badge>
                    )}
                  </h3>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </Col>
      <Col xs={6}>
        {!photoInfo.length ? null : (
          <>
            <Carousel
              photos={photoInfo}
              currentPhoto={currentPhoto}
              changeCurrentPhoto={changeCurrentPhoto}
            />
            <AddComment
              appendComments={appendComments}
              userId={1}
              photoId={photoInfo[currentPhoto].id}
              username={'Danny'}
            />
          </>
        )}
      </Col>
    </>
  );
};

export default trail;
