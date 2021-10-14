import React from 'react';
import axios from 'axios';
import Modal from './modal.jsx'

export default class Brewery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      comment: '',
      isFavorite: false,
      favoriteComment: '',
      favoriteId: null
    }
    this.toggleModal = this.toggleModal.bind(this);
    this.commentChange = this.commentChange.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
  }
  addFavorite(e) {
    e.preventDefault();
    let favorite = this.props.brewery;
    favorite.comment = this.state.comment;
    favorite.user_id = this.props.userId;
    axios.post('/favorites', this.props.brewery)
    .then((res) => {
      this.setState({
        favoriteId: res.data
      })
    })
    this.toggleModal();
    this.setState({
      isFavorite: true,
      favoriteComment: this.state.comment
    })
  }
  removeFavorite(e) {
    e.preventDefault();
    axios.delete(`/favorites?favorite_id=${this.state.favoriteId}`)
    this.setState({
      isFavorite: false
    })
  }
  toggleModal() {
    this.setState({
      showModal: !this.state.showModal
    });

  }
  commentChange(e) {
    e.preventDefault();
    this.setState({
      comment: e.target.value
    })
  }
  componentDidUpdate(prevProps) {
    if(prevProps.favorites !== this.props.favorites){
      this.props.favorites.forEach((favorite) => {
        if (favorite.id === this.props.brewery.id) {
          this.setState({
            isFavorite: true,
            favoriteComment: favorite.comment,
            favoriteId: favorite.favorite_id
          })
        }
      })
    }
  }
  componentDidMount() {
    this.props.favorites.forEach((favorite) => {
      if (favorite.id === this.props.brewery.id) {
        this.setState({
          isFavorite: true,
          favoriteComment: favorite.comment,
          favoriteId: favorite.favorite_id
        })
      }
    })
  }
  render() {
    return (
      <div>
        <button onClick={() => {
          this.props.goto({
            latitude: this.props.brewery.latitude,
            longitude: this.props.brewery.longitude
          })
        }}>goto</button>
        <span>{this.props.brewery.name} | </span>
        <span>{this.props.brewery.brewery_type} | </span>
        <span>{this.props.brewery.street} | </span>
        <span>{this.props.brewery.website_url} | </span>
        <span>{this.props.brewery.phone} </span>
        {this.props.userId ? <button onClick={this.state.isFavorite ? this.removeFavorite : this.toggleModal}>
          {this.state.isFavorite ? <span>Remove from Favorites</span> : <span>Add to Favorites</span>}
          </button> : null}
        {this.state.isFavorite ? <div>{this.state.favoriteComment}</div> : null}
        <Modal show={this.state.showModal}
        handleClose={this.toggleModal}
        >
          <div>
            Comment:
            <input type="text" onChange={this.commentChange}/>
            <button onClick={this.addFavorite}>save favorite</button>
          </div>
        </Modal>
      </div>
    )
  }
}
