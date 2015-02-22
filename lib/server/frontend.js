import React from 'react';
import ReactRouter from 'react-router';

import routes from '../../client/routes';
import {Html} from '../../client/components';

export default function frontendMiddleware(req, res, next) {
  ReactRouter.run(routes, req.url, function(Handler, state) {
    var markup = React.renderToString(<Handler/>);
    var html = React.renderToStaticMarkup(<Html><Handler/></Html>);
    res.end('<!DOCTYPE html>' + html);
  });
}
