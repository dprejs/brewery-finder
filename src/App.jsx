
import React, { Component } from "react";
// import {hot} from "react-hot-loader";
import axios from 'axios';
import "./App.css";
import Map from './Map.jsx'
import keys from './../config.js';
import { Loader } from '@googlemaps/js-api-loader';
import Brewery from './brewery.jsx'
import cheers from './cheers.svg';

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
      locSearch: '',
      mapCenter: undefined,
      userInput: '',
      userId: undefined,
      userName: undefined,
      favorites: [],
      favoritesIds: []
    }
    this.setLocal = this.setLocal.bind(this);
    this.getBreweries = this.getBreweries.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.searchLocation = this.searchLocation.bind(this);
    this.geocode = this.geocode.bind(this);
    this.goto = this.goto.bind(this);
    this.login = this.login.bind(this);
    this.getFavorites = this.getFavorites.bind(this);
    this.showFavorites = this.showFavorites.bind(this);
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
  goto(coords) {
    this.setState({
      mapCenter: coords
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
  getFavorites() {
    axios.get(`/favorites?user_id=${this.state.userId}`)
      .then((response) => {
        this.setState({
          favorites: response.data
        })
        response.data.forEach((favorite) => {
          this.setState({
            favoritesIds: [...this.state.favoritesIds, favorite.id]
          })
        })
        console.log(response.data)
      })
      .catch((err) => {
        console.log('error getting favorites', err);
      })
  }
  searchChange(e) {
    e.preventDefault()
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
        Geocoder.geocode({ address: search }, (result) => {
          this.setState({
            location: {
              latitude: result[0].geometry.location.lat(),
              longitude: result[0].geometry.location.lng()
            },
            mapCenter: {
              latitude: result[0].geometry.location.lat(),
              longitude: result[0].geometry.location.lng()
            }
          }, () => {
            this.getBreweries();
          })
          console.log(result)
          console.log(result[0].geometry.location.lat())
        })
      })
      .catch((err) => {
        console.log('error loading maps api', err)
      })
  }
  login(e) {
    e.preventDefault();
    axios.post('/user', {
      name: this.state.userInput
    })
      .then((res) => {
        this.setState({
          userId: res.data,
          userName: this.state.userInput
        }, () => {
          this.getFavorites();
        })
        console.log(res);
      })
  }
  showFavorites() {
    this.setState({
      breweries: this.state.favorites
    })
  }
  componentDidMount() {
    this.setState({
      geo: navigator.geolocation
    })
    navigator.geolocation.getCurrentPosition((loc) => {
      this.setState({
        location: loc.coords,
        mapCenter: loc.coords,
      }, () => {
        this.getBreweries()
      })
    })
  }
  render() {
    return (
      <div className="App">
        {this.state.userName ? <h1 className='cheers'><img src={cheers} />Cheers {this.state.userName}! <br /></h1> :
        <h1 className='cheers'><img src={cheers} /></h1>}
        <div className='nav-bar'>
          <input type="text"
            placeholder="user login"
            name="userInput"
            onChange={this.searchChange} />
          <button onClick={this.login}>login</button>
          <input type="text"
            placeholder="search location"
            name="locSearch"
            onChange={this.searchChange} />
          <button onClick={this.searchLocation}>search</button>
          {this.state.userId ? <button onClick={this.showFavorites}>show favorites</button> : null}

        </div>

        <div className='list'>
          <table>
            <tr className='title-row'>
              <th>show on map</th>
              <th>name</th>
              <th>size</th>
              <th>address</th>
              <th>website</th>
              <th>phone </th>
              {this.state.userId ? <><th>Favorite?</th>
                <th>Comment</th></> : null}

            </tr>
            {this.state.breweries.length ? this.state.breweries.map((brewery) => {
              return (<Brewery brewery={brewery} goto={this.goto} userId={this.state.userId} favorites={this.state.favorites} />)
            }) : null}
          </table>

        </div>
        <div className='map'>
          {this.state.breweries.length ? <Map breweries={this.state.breweries}
            loc={this.state.location}
            center={this.state.mapCenter}
          /> : null}
        </div>
      </div>
    );
  }
}

export default App;
