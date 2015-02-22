import React from 'react';
import {RouteHandler, Link} from 'react-router';

export const Html = React.createClass({
  render() {
    return (
      <html>
        <head>
          <meta charSet="UTF-8"/>
          <title>Riddler Puzzle Server</title>
          <link rel="stylesheet" href="/static/style/base.css"/>
          <script type="text/javascript" src="/static/script/bundle.js"></script>
        </head>
        <body>
          {this.props.children}
        </body>
      </html>
    );
  },
});

export const App = React.createClass({
  render() {
    return (
      <div>
        <Nav/>
        <RouteHandler/>
      </div>
    );
  }
});

export const Nav = React.createClass({
  render() {
    return (
      <ul>
        <li><Link to="welcome">Welcome</Link></li>
        <li><Link to="counter">Counter</Link></li>
      </ul>
    );
  },
});

export const Welcome = React.createClass({
  render() {
    return (
      <div>
        <h1>Welcome!</h1>
      </div>
    );
  },
});

export const Counter = React.createClass({
  getInitialState() {
    return {
      count: 0,
    };
  },

  addOne() {
    this.setState({count: this.state.count + 1});
  },

  render() {
    return (
      <div>
        <span>{this.state.count}</span>
        <button onClick={this.addOne}>+1</button>
      </div>
    );
  },
});
