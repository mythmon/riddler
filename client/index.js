import React from 'react';

const App = React.createClass({
  displayName: 'App',

  render() {
    return (
      <html>
        <head>
          <meta charSet="UTF-8"/>
          <title>Riddler Puzzle Server</title>
          <link rel="stylesheet" href="/static/style/base.css"/>
        </head>
        <body>
          <h1>It works!</h1>
          <Counter/>

          <script type="text/javascript" src="/static/script/bundle.js"></script>
        </body>
      </html>
    );
  }
});

const Counter = React.createClass({
  displayName: 'Counter',

  getInitialState() {
    return {
      count: 0,
    };
  },

  addOne() {
    this.setState({count: this.state.count + 2});
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

if (typeof window !== 'undefined') {
  window.onload = function() {
    React.render(<App/>, document);
  }
}

export default App;

