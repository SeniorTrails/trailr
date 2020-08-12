import React from 'react';
import { Link } from 'react-router-dom';
import {
  Overlay,
  OverlayTrigger,
  Popover,
  Button,
  Images,
  Image,
  Container,
  Row,
  Col,
} from 'react-bootstrap';

const InfoWindow = React.memo(({ selectedTrail, onCloseClick }) => {
  // const { selectedTrail } = props;
  const place = selectedTrail;
  const thumbnail = place.thumbnail;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 200,
    left: '0px',
    width: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    boxShadow: '0 0px 0px 0px rgba(0, 0, 0, 0)',
    padding: 10,
    fontSize: 14,
    zIndex: 100,
  };

  return (
    <div style={infoWindowStyle}>
      <>
        {['top'].map((placement) => (
          <OverlayTrigger
            trigger="click"
            key={placement}
            placement={placement}
            style={{ width: '400px' }}
            overlay={<Popover id={`popover-positioned-${placement}`} />}
          >
            <Button variant="secondary">
              <div
                style={{
                  fontSize: 12,
                  position: 'relative',
                  left: '50%',
                  color: 'black',
                }}
                onClick={onCloseClick}
              >
                X
              </div>
              <div>
                <Link to={`/trail/${place.id}`} activeclassname="active">
                  <h4>{place.name}</h4>
                </Link>
              </div>
              <div>
                <Image
                  src={thumbnail}
                  thumbnail
                  rounded
                  style={{ width: '130px' }}
                />
              </div>
              <div style={{ fontSize: 14 }}>
                <span style={{ color: 'black' }}>{place.rating} </span>
                <span style={{ color: 'orange' }}>
                  {String.fromCharCode(9733).repeat(Math.floor(place.rating))}
                </span>
                <span style={{ color: 'grey' }}>
                  {String.fromCharCode(9733).repeat(
                    5 - Math.floor(place.rating)
                  )}
                </span>
              </div>
              <div style={{ fontSize: 14, color: 'black' }}>
                {place.length} miles
              </div>
              <div
                className="text-truncate"
                style={{ fontSize: 14, color: 'black', width: '14rem' }}
              >
                {place.description}
                <br />
              </div>
            </Button>
          </OverlayTrigger>
        ))}
      </>
    </div>
  );
});

export default InfoWindow;
