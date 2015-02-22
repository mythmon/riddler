import React from 'react';
import ReactRouter from 'react-router';

import {App} from './components';
import routes from './routes';

const {RouterHandler} = ReactRouter;

// If this is running in the browser, then kick off React, which will turn
// the static markup the server gave us into live markup with event listeners
// and React bindings.
if (typeof window !== 'undefined') {
  window.onload = function() {
    ReactRouter.run(routes, ReactRouter.HistoryLocation, function(Handler, state) {
      React.render(<Handler/>, document.body);
    });
  }
}
