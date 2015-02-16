import express from 'express';

import git from './git';
import api from './api';

const app = express();

app.use('/', git);
app.use('/api/', api);

app.listen(7000);
