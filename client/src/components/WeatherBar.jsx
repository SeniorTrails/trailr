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
        console.log(data)
        isSwitchOn ? setView(data.daily.slice(1, 6)) : setView(data.hourly.slice(0, 7))
        setViewLoaded(true);
      }).catch((err) => console.log('There seems to be an error', err))
    }
  useEffect(() => {
    updateWeather()
  }, [isSwitchOn])

  return <div>
    <Container>
    <Row style={{boarder: '1px solid black'}}>
      <Col xs='1'> 
      <div>Wandelust</div>
      </Col>
      <Col xs='1'>
        <Form>
          <Form.Switch
            onChange={toggleSwitch}
            type="switch"
            id="custom-switch"
            checked={isSwitchOn}
            label="Galivanter"
          />
        </Form>
      </Col>
      </Row>
      <Row>
      <Col xs='12'>
      <div style={{display: 'flex'}}>
      
        {viewLoaded && view.map((weather) => 
        (weather.temp instanceof Object) ? 
            <WeatherTicker 
              time={weather.dt}
              day={weather.temp.day}
              eve={weather.temp.eve}
              description={weather.weather[0].main}
              icon={weather.weather[0].icon}
          />
          :
          <WeatherTicker 
              time={weather.dt}
              temp={weather.temp}
              description={weather.weather[0].main}
              icon={weather.weather[0].icon}
          />
        )}
        </div>
        </Col>
      </Row>
  </Container>
  </div>;
};
export default WeatherBar;
