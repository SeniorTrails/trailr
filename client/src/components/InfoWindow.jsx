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

const InfoWindow = ({ props, onCloseClick }) => {
  const { selectedTrail } = props;
  const place = selectedTrail;
  const thumbnail = place.thumbnail;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 0,
    left: '0px',
    width: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    boxShadow: '0 0px 0px 0px rgba(0, 0, 0, 0)',
    padding: 0,
    fontSize: 14,
    zIndex: 0,
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
                  fluid
                  thumbnail
                  rounded
                  style={{ width: '200px' }}
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
                style={{ fontSize: 14, color: 'black', width: '20rem' }}
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
};

export default InfoWindow;

// const InfoWindow = ({ props, onCloseClick }) => {
//   const { selectedTrail } = props;
//   const place = selectedTrail;
//   const thumbnail = place.thumbnail;
//   // console.log(place);
//   const infoWindowStyle = {
//     position: 'relative',
//     bottom: 150,
//     left: '-45px',
//     width: 220,
//     backgroundColor: 'rgba(255, 255, 255, 0.75)',
//     boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
//     padding: 10,
//     fontSize: 14,
//     zIndex: 100,
//   };

//   return (
//     <div style={infoWindowStyle}>
//       <div
//         style={{ fontSize: 12, position: 'relative', left: '96%' }}
//         onClick={onCloseClick}
//       >
//         x
//       </div>
//       <div>
//         <Link to={`/trail/${place.id}`} activeclassname="active">
//           <h2>{place.name}</h2>
//         </Link>
//       </div>
//       <div>
//         <img src={thumbnail} alt="" className="img-thumbnail" />
//       </div>
//       <div style={{ fontSize: 14 }}>
//         <span style={{ color: 'grey' }}>{place.rating} </span>
//         <span style={{ color: 'orange' }}>
//           {String.fromCharCode(9733).repeat(Math.floor(place.rating))}
//         </span>
//         <span style={{ color: 'lightgrey' }}>
//           {String.fromCharCode(9733).repeat(5 - Math.floor(place.rating))}
//         </span>
//       </div>
//       <div style={{ fontSize: 14, color: 'grey' }}>{place.length} miles</div>
//       <div style={{ fontSize: 14, color: 'green' }}>{place.description}</div>
//     </div>
//   );
// };

// export default InfoWindow;

{
  /* <div style={infoWindowStyle}>
<div
  style={{ fontSize: 12, position: 'relative', left: '96%' }}
  onClick={onCloseClick}
>
  x
</div>
<Link to={`/trail/${place.id}`} activeclassname="active">
  <h2>{place.name}</h2>
</Link>
<div style={{ fontSize: 14 }}>
  <span style={{ color: 'grey' }}>{place.rating} </span>
  <span style={{ color: 'orange' }}>
    {String.fromCharCode(9733).repeat(Math.floor(place.rating))}
  </span>
  <span style={{ color: 'lightgrey' }}>
    {String.fromCharCode(9733).repeat(5 - Math.floor(place.rating))}
  </span>
</div>
<div style={{ fontSize: 14, color: 'grey' }}>{place.length} miles</div>
<div style={{ fontSize: 14, color: 'green' }}>{place.description}</div>
</div> */
}
