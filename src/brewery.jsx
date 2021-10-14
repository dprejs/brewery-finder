import React from 'react';
import axios from 'axios';
import Modal from './modal.jsx'

export default class Brewery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      comment: ''
    }
    this.toggleModal = this.toggleModal.bind(this);
    this.commentChange = this.commentChange.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
  }
  addFavorite(e) {
    e.preventDefault();
    let favorite = this.props.brewery;
    favorite.comment = this.state.comment;
    favorite.user_id = this.props.userId;
    axios.post('/favorites', this.props.brewery)

    this.toggleModal();
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
        {this.props.userId ? <button onClick={this.toggleModal}>Favorite</button> : null}
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
