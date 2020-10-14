import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Form} from 'react-bootstrap'
import WeatherTicker from './WeatherTicker.jsx'
import axios from 'axios'


const WeatherBar = ({userLocation}) => {
const [isSwitchOn, setIsSwitchOn] = useState(false);
const [view, setView] = useState([]);
const [viewLoaded, setViewLoaded] = useState(false);
const {lat, lng} = userLocation;
  
  const toggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn)
  }

  const updateWeather = () => {
    axios.get('https://api.openweathermap.org/data/2.5/onecall', {
      params: {
        lat: lat,
        lon: lng,
        units: 'Imperial',
        appid: '3fa21bd691a27fe5b69030afc26e8f53',
        },
      }).then(({data}) => {
        isSwitchOn ? setView(data.daily.slice(1, 6)) : setView(data.hourly.slice(0, 7))
        console.log(data)
        setViewLoaded(true);
      }).catch((err) => console.log('There seems to be an error', err))
    }
  useEffect(() => {
    updateWeather()
  }, [isSwitchOn])

  return <div>
    <Container>
    <Row>
      <div style={{marginRight: '7px'}}>Wanderlust</div>
    <Form>
      <Form.Switch
        onChange={toggleSwitch}
        type="switch"
        id="custom-switch"
        checked={isSwitchOn}
        label="Galivanter"
      />
    </Form>
        {viewLoaded && view.map((weather) => {
          console.log(weather.dt);
          <Col xs='6'>
            <WeatherTicker 
              time={weather.dt}
              tempDay={weather.temp.day}
              tempEve={weather.temp.eve}
              description={weather.weather.main}
              icon={weather.weather.icon}
          /></Col>
        })}
      </Row>
  </Container>
  </div>;
};
export default WeatherBar;
