import React from 'react';
import {
  Map,
  InfoWindow,
  Marker,
  GoogleApiWrapper
} from 'google-maps-react';
import keys from './../config.js';
import yah from './you_are_here.svg'
import './map.css';
import { Loader } from '@googlemaps/js-api-loader';


const loader = new Loader({
  apiKey: keys.maps,
  version: "weekly"
})


export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfo: false,
      activeMarker: {},
      selectedPlace: {}
    }
    // this.mapRef = React.useRef(null);
    this.markerClick = this.markerClick.bind(this);
  }
  geocode() {
    loader.load()
    .then((google) => {
      const Geocoder = new google.maps.Geocoder
      Geocoder.geocode({address: 'flagstaff'}, (result) => {
        console.log(result)
      })
    })
    .catch((err) => {
      console.log('error loading maps api', err)
    })
  }
  markerClick(props, marker, e) {
    this.setState({
      showInfo: true,
      activeMarker: marker,
      selectedPlace: props

    })
  }
  mapClick(props) {
    if (this.state.showInfo) {
      this.setState({
        showInfo: false,
        activeMarker: null
      })
    }
  }
  componentDidMount() {
    // this.geocode()
  }
  render() {
    return (
      <Map google={window.google} zoom={14}
      initialCenter={{
        lat: this.props.loc.latitude,
        lng: this.props.loc.longitude
      }}
      center={{
        lat: this.props.loc.latitude,
        lng: this.props.loc.longitude
      }}
      mapTypeControl={false}
      fullscreenControl={false}
      streetViewControl={false}
      className="map">
        {this.props.breweries.length ? this.props.breweries.map((brewery) => {
          return (<Marker
            onClick={this.markerClick}
            name={brewery.name}
            position={{ lat: brewery.latitude, lng: brewery.longitude }}
            title={brewery.name}
            loc={brewery.street}
          />)
        }) : null}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showInfo}>
          <div>
            <h1>{this.state.selectedPlace.name}</h1>
            <h2>{this.state.selectedPlace.loc}</h2>
          </div>
      </InfoWindow>
      </Map>
    )
  }
}
export default GoogleApiWrapper({
  apiKey: (keys.maps)
})(MapContainer)
