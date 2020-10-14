import React, { Component } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
// import styled from 'styled-components';

// const Wrapper = styled.div`
//   position: relative;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   padding: 20px;
// `;

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.clearSearchBox = this.clearSearchBox.bind(this);
  }

  componentDidMount({ mapApi } = this.props) {
    this.searchBox = new mapApi.places.SearchBox(this.searchInput);
    this.searchBox.addListener('places_changed', this.onPlacesChanged);
    // this.searchBox.bindTo('bounds', map);
  }

  componentWillUnmount({ mapApi } = this.props) {
    mapApi.event.clearInstanceListeners(this.searchInput);
  }

  onPlacesChanged = ({ map, addplace, getInput } = this.props) => {
    const selected = this.searchBox.getPlaces();
    const { 0: place } = selected;
    if (!place.geometry) return;
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    addplace(selected);
    getInput(this.searchBox.getPlaces());
    this.searchInput.blur();
  };

  clearSearchBox() {
    this.searchInput.value = '';
  }

  render() {
    return (
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">
            {/* <span role="img" aria-label="hiking-emoji">🥾</span> */}
            Find Trails
          </InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="Search by Location"
          aria-label="Username"
          aria-describedby="basic-addon1"
          ref={(ref) => {
            this.searchInput = ref;
          }}
          type="text"
          onFocus={this.clearSearchBox}
        />
      </InputGroup>
    );
  }
}

export default SearchBox;

// const SearchBox = (props) => {
//   const {
//     map,
//     mapApi,
//     addplace,
//     searchInput
//   } = props;

//   useEffect((mapApi) => {
//     searchBox = new mapApi.places.SearchBox(searchInput);
//     searchBox.addListener('places_changed', onPlacesChanged);

//     return () => {
//       mapApi.event.clearInstanceListeners(searchInput);
//     };

//   }, [searchInput]);

//   const onPlacesChanged = (map, addplace) => {
//     const selected = searchBox.getPlaces();
//     const { 0: place } = selected;
//     if (!place.geometry) return;
//     if (place.geometry.viewport) {
//       map.fitBounds(place.geometry.viewport);
//     } else {
//       map.setCenter(place.geometry.location);
//       map.setZoom(17);
//     }

//     addplace(selected);
//       searchInput.blur();
//   };

//   const clearSearchBox = () => {
//     this.searchInput.value = '';
//   };

//   return (
//     <InputGroup className="mb-3">
//       <InputGroup.Prepend>
//         <InputGroup.Text id="basic-addon1">
//           {/* <span role="img" aria-label="hiking-emoji">🥾</span> */}
//           Find Trails
//         </InputGroup.Text>
//       </InputGroup.Prepend>
//       <FormControl
//         placeholder="Search by Location"
//         aria-label="Username"
//         aria-describedby="basic-addon1"
//         ref={(ref) => {
//           searchInput = ref;
//         }}
//         type="text"
//         onFocus={clearSearchBox}
//       />
//     </InputGroup>
//   );
// };
