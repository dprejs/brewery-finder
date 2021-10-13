
import React, { Component } from "react";
// import {hot} from "react-hot-loader";
import axios from 'axios';
import "./App.css";
import Map from './Map.jsx'
import keys from './../config.js';
import { Loader } from '@googlemaps/js-api-loader';


const loader = new Loader({
  apiKey: keys.maps,
  version: "weekly"
})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geo: undefined,
      location: undefined,
      breweries: [],
      locSearch: ''
    }
    this.setLocal = this.setLocal.bind(this);
    this.getBreweries = this.getBreweries.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.searchLocation = this.searchLocation.bind(this);
    this.geocode = this.geocode.bind(this);
  }
  getBreweries() {
    var url = `https://api.openbrewerydb.org/breweries?by_dist=${this.state.location.latitude},${this.state.location.longitude}`
    console.log(url);
    axios({
      method: 'get',
      url: url,
    })
      .then((res) => {
        console.log(res)
        this.setState({
          breweries: res.data
        })
      })
      .catch((err) => {
        console.log('error getting breweries', err);
      })
  }
  setLocal() {
    this.state.geo.getCurrentPosition((loc) => {
      console.log(loc.coords)
      this.setState({
        location: loc.coords
      })
    })
  }
  searchChange(e) {
    e.persist()
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  searchLocation(e) {
    e.preventDefault();
    this.geocode(this.state.locSearch)
  }
  geocode(search) {
    loader.load()
    .then((google) => {
      const Geocoder = new google.maps.Geocoder
      Geocoder.geocode({address: search}, (result) => {
        this.setState({
          location: {
            latitude: result[0].geometry.location.lat(),
            longitude: result[0].geometry.location.lng()
          }
        }, () => {
          this.getBreweries();
        })
        console.log(result)
        console.log(result[0].geometry.location.lat() )
      })
    })
    .catch((err) => {
      console.log('error loading maps api', err)
    })
  }
  componentDidMount() {
    this.setState({
      geo: navigator.geolocation
    })
    navigator.geolocation.getCurrentPosition((loc) => {
      this.setState({
        location: loc.coords
      }, () => {
        this.getBreweries()
      })
    })
  }
  render() {
    return (
      <div className="App">
        <h1> Hello, Beer! </h1>
        <input type="text" placeholder="search location" name="locSearch" onChange={this.searchChange}/>
        <button onClick={this.searchLocation}>search</button>
        {this.state.location ? <h2>lat: {this.state.location.latitude}
          long: {this.state.location.longitude}</h2> : null}
        {this.state.breweries.length ? this.state.breweries.map(brewery => brewery.name) : null}
        {this.state.breweries.length ? <Map breweries={this.state.breweries}
          loc={this.state.location}
        /> : null}
      </div>
    );
  }
}

export default App;
