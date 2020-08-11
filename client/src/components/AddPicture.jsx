import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import heic2any from 'heic2any';
import exifr from 'exifr';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Input from './input.jsx';
import useForm from '../helpers';
import Marker from './Marker.jsx';

const maxImages = 10;
const maxImageSize = 5 * 1024 * 1024; // 5MBs

const addPicture = ({ appendPhoto, center }) => {
  const [show, setShow] = useState(false);
  const [images, setImages] = useState({});
  const toggleModal = () => setShow(!show);

  // Handles new file uploads
  const changeHandler = (e) => {
    e.persist();
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i += 1) {
        // Parse the metadata off the image,
        // latitude and longitude
        exifr.parse(e.target.files[i])
          .then((metaData) => {
            console.log(metaData);
            const newImage = {
              key: e.target.files[i].name,
              url: URL.createObjectURL(e.target.files[i]),
              lat: metaData.latitude,
              lng: metaData.longitude,
            };
            // If the image is a heic convert it
            if (newImage.key.match(/.heic$|.HEIC$/)) {
              const blob = e.target.files[i];
              heic2any({ blob })
                .then((result) => {
                  newImage.url = URL.createObjectURL(result);
                  setImages((prev) => {
                    const updated = { ...prev};
                    updated[newImage.key] = newImage;
                    return updated;
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              setImages((prev) => {
                const updated = { ...prev};
                updated[newImage.key] = newImage;
                return updated;
              });
            }
          });
      }
    }
  };

  const addMarker = ({ lat, lng }, key) => {
    setImages((prev) => {
      const updated = { ...prev };
      updated[key].lat = lat;
      updated[key].lng = lng;
      return updated;
    });
  };

  const submitHandler = () => {
    console.log(images);
    appendPhoto(images);
  };

  return (
    <>
      <Button variant="success" onClick={toggleModal}>Add Picture</Button>
      <Modal show={show} onHide={toggleModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input onChange={changeHandler} type='file' id='imageUpload' multiple />
          {Object.keys(images).map((key) => (
            <Row key={images[key].key}>
              <Col>
                <Image thumbnail src={images[key].url} />
              </Col>
              <Col>
                <div style={{ height: '300px', width: '100%' }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
                    defaultCenter={center}
                    defaultZoom={17}
                    onClick={(e) => addMarker(e, images[key].key)}
                  >
                    <Marker lat={images[key].lat} lng={images[key].lng} />
                  </GoogleMapReact>
                </div>
              </Col>
            </Row>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={toggleModal}>Close</Button>
          <Button variant="success" onClick={submitHandler}>Submit Images</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default addPicture;
