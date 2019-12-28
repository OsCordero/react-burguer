import React, { Component } from 'react';
import jsonServer from '../../api/json-server';
import './sidebar.css';
export default class SideBar extends Component {
  state = {
    isSideBarShowed: false,
  };

  closeSideBar = () => {
    this.setState({ isSideBarShowed: false });
  };

  showSideBar = async () => {
    const burguers = await jsonServer.get('/burguers?sort=id&_order=desc');
    const ingredients = Object.keys(burguers.data).map(burguer => {
      return burguers.data[burguer].ingredients;
    });
    this.props.loadHistory(ingredients);
    this.setState({ isSideBarShowed: true });
  };
  render(props) {
    const { isSideBarShowed } = this.state;

    return (
      <div className="side-bar">
        <button
          onClick={this.showSideBar}
          style={{ display: !isSideBarShowed ? 'flex' : 'none' }}
          className="open-side-bar"
        >
          ☰
        </button>
        <div
          className="side-bar-content"
          style={{ display: isSideBarShowed ? 'grid' : 'none' }}
        >
          <button className="close-side-bar" onClick={this.closeSideBar}>
            Close &times;
          </button>
          {this.props.children}
        </div>
      </div>
    );
  }
}
