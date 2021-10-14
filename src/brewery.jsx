import React from 'react';


export default class Brewery extends React.Component {
  constructor(props) {
    super(props);

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
      </div>
    )
  }
}
