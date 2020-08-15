import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { OverlayTrigger, Popover, Button, Image } from 'react-bootstrap';
import styled from 'styled-components';
import { addTrail } from '../helpers';

const LinkDiv = styled.div`
  :hover {
    color: blue
  }
`;

/**
 * InfoWindow is small pop-up window that displays a clickable title of the currently selected
 * trail, along with a thumbnail, trail length, and truncated description. The title is clickable,
 * and directs the user to the trail page for that selected trail.
 * @param {Object} selectedTrail an object with information specific to the currently selected trail
 * @param {Function} onCloseClick a function that changes the current photo
 */

const InfoWindow = React.memo(({ selectedTrail, onCloseClick }) => {
  const [redirect, setRedirect] = useState(false);
  const place = selectedTrail;
  const { thumbnail } = place;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 150,
    left: 0,
    width: 220,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    boxShadow: '0 0px 0px 0px rgba(0, 0, 0, 0)',
    padding: 0,
    fontSize: 14,
    zIndex: 0,
  };

  const clickHandler = () => {
    const trailData = {
      ...place,
      api_id: place.id,
      latitude: +place.lat,
      longitude: +place.lon,
    };
    addTrail(trailData)
      .then((response) => {
        setRedirect(`/trail/${response.id}`);
      })
      .catch((err) => {
        setRedirect('/404');
      });
  };

  return (
    <div style={infoWindowStyle}>
      <>
        {!redirect ? null : <Redirect to={redirect} />}
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
                <LinkDiv onClick={clickHandler}><h4>{place.name}</h4></LinkDiv>
              </div>
              <div>
                <Image
                  src={thumbnail}
                  thumbnail
                  rounded
                  style={{ width: '130px' }}
                />
              </div>
              <div style={{ fontSize: 14, color: 'white' }}>
                {place.length} miles
              </div>
              <div
                className="text-truncate"
                style={{ fontSize: 14, color: 'white', width: '14rem' }}
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
