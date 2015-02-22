import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import {App, Welcome, Counter} from './components';

const routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute name="welcome" handler={Welcome}/>
    <Route name="counter" path="counter" handler={Counter}/>
  </Route>
);

export default routes;

