import express from 'express';

import git from './git';
import api from './api';
import frontend from './frontend';

const app = express();

// These will be tried in order.
app.use('/', git);
app.use('/api/', api);
app.use('/static', express.static('static'));
app.use('/static', function(req, res, next) {
  // If the above static handler did not find anything, return a 404.
  res.status(404);
  res.end();
});
app.use('/', frontend);

app.listen(7000);
