import url from 'url';

import express from 'express';
import React from 'react';

import Client from '../../client';


const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
  strict: false,
});

router.get('*', (req, res) => {
  res.end(React.renderToString(<Client/>));
});

export default router;
