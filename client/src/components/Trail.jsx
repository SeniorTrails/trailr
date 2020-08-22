import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import {
  getTrailData,
  updateUserRating,
  updateFavorite,
  getFavoriteStatus,
  uploadPhoto,
  getTrailPlantIdData,
} from '../helpers';
import Input from './input.jsx';
import Map from './TrailMap.jsx';
import Carousel from './Carousel.jsx';
import AddComment from './AddComment.jsx';
import AddPicture from './AddPicture.jsx';
import PlantId from './PlantId.jsx';
import TrailPlantIdInfoList from './TrailPlantIdInfoList.jsx';

const StyledHeart = styled(Heart)`
  color: #00470F;
  :hover {
    color: #008a1d;
  }
`;

const StyledFillHeart = styled(HeartFill)`
  color: #00470F;
  :hover {
    color: #008a1d;
  }
`;

// Favorite Heart Component
const FavHeart = ({ fav, ch }) => (
  <>
    {fav ? <StyledFillHeart onClick={ch} /> : <StyledHeart onClick={ch} />}
  </>
);
FavHeart.propTypes = {
  fav: PropTypes.bool.isRequired,
  ch: PropTypes.func.isRequired,
};

// Options for the ratings selector
const ratingOptions = [
  { value: 0, label: '' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

/**
 * Takes the server's trail data and parses it into several different variables
 *  so that it's easier to work with
 * @param {Object} data trail data from server to parse
 * @returns {Object} photoData, userRatingData, trailData
 */
const parseTrailData = (data) => {
  const trailData = {
    id: data.id,
    name: data.name,
    url: data.url,
    description: data.description,
    lat: data.latitude,
    lon: data.longitude,
    difficulty: data.averageDifficulty,
    likeability: data.averageLikeability,
    thumbnail: data.thumbnail,
  };
  // Sorts the photos by newest closest to the picture
  const photoData = data.photos.map((photo) => {
    const sorted = photo.comments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return { ...photo, comments: sorted };
  });
  const userRatingData = { diff: data.userDifficulty, like: data.userLikeability };
  return {
    photoData,
    userRatingData,
    trailData,
  };
};

/**
 * The Trail Page component
 * @param {Object} user loggedIn, name, id
 */
const trail = ({ user }) => {
  const { id } = useParams();
  const [trailInfo, setTrailInfo] = useState({});
  const [photoInfo, setPhotoInfo] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [redirect, setRedirect] = useState(false);
  // Redirect if no trail info is found

  const [plantInfoArray, setPlantInfoArray] = useState([]);
  const [plantIdButtonLoading, setPlantIdButtonLoading] = useState(false);

  // Set all the initial data with DB calls based on id in useParams
  useEffect(() => {
    getTrailData(id, user.id)
      .then((response) => {
        if (!response) {
          setRedirect(true);
        } else {
          const { photoData, userRatingData, trailData } = parseTrailData(response);
          setTrailInfo(trailData);
          setPhotoInfo(photoData);
          setUserRatings({
            userLoaded: true,
            like: {
              value: +userRatingData.like,
              edit: false,
            },
            diff: {
              value: +userRatingData.diff,
              edit: false,
            },
          });
        }
      })
      .catch((err) => {
        setRedirect(true);
      });
  }, []);

  useEffect(() => {
    if (user.loggedIn) {
      getFavoriteStatus(id, user.id)
        .then((status) => {
          setFavorite(status);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user]);

  useEffect(() => {
    getTrailPlantIdData(id)
      .then((response) => setPlantInfoArray(response))
      .catch((err) => console.error(err));
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
    if (target.value !== 0) {
      const numValue = +target.value;
      updateUserRating(target.name, numValue, user.id, id)
        .then((newRating) => {
          const updatedElement = { ...userRatings[target.name] };
          updatedElement.value = numValue.toString();
          updatedElement.edit = false;
          setUserRatings((prev) => ({ ...prev, [target.name]: updatedElement }));
          setTrailInfo((prev) => {
            const updatedTrailInfo = { ...prev };
            if (target.name === 'like') {
              updatedTrailInfo.likeability = +newRating.averageLikeability;
            } else {
              updatedTrailInfo.difficulty = +newRating.averageDifficulty;
            }
            return updatedTrailInfo;
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  /**
   * Updates the photo being shown to the given Id
   * @param {Number} photoId new photoId
   */
  const changeCurrentPhoto = (photoId) => {
    setCurrentPhoto(photoId);
  };

  const removePhoto = (photoId) => {
    setCurrentPhoto(0);
    const updatedPhotos = [...photoInfo];
    updatedPhotos.splice(photoId, 1);
    setPhotoInfo(updatedPhotos);
  };

  /**
   * After the DB call this adds the new comment to the photo for the user,
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
    newPhotos.forEach((item) => {
      updatedInfo.push({
        ...item,
        comments: [],
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

  const toggleFavorite = () => {
    updateFavorite(id, user.id, favorite)
      .then((response) => {
        setFavorite((prev) => !prev);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      {redirect ? <Redirect to="/404" /> : null}
      <Col xs={6}>
        <Row>
          <Col xs={8}>
            <h2>{trailInfo.name} {!user.loggedIn
              ? null
              : <FavHeart fav={favorite} ch={toggleFavorite} />}
            </h2>
          </Col>
          <Col xs={3}>
            {!user.loggedIn
              ? null
              : (
                <AddPicture
                  appendPhoto={appendPhoto}
                  center={{ lat: trailInfo.lat, lng: trailInfo.lon }}
                  userId={user.id}
                  trailId={+id}
                />
              )}
          </Col>
        </Row>
        <div style={{ width: '100%', height: '300px' }}>
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
        </div>
        <div>
          {user.loggedIn && <PlantId trailId={trailInfo.id} userId={user.id} />}
          <br />
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
            {!user.loggedIn || !userRatings.userLoaded ? null : (
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
              user={user}
              removePhoto={removePhoto}
            />
            {!user.loggedIn
              ? null
              : (
                <AddComment
                  appendComments={appendComments}
                  userId={user.id}
                  photoId={photoInfo[currentPhoto].id}
                  name={user.name}
                />
              )}
          </>
        )}
        <TrailPlantIdInfoList plantInfoArray={plantInfoArray} />
        <br />
        <br />
      </Col>
    </>
  );
};

export default trail;

trail.propTypes = {
  user: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    name: PropTypes.string,
    id: PropTypes.number,
  }),
};
