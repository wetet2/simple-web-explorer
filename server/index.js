

require('./nodeArgs');
const path = require('path');
const express = require('express');
const app = express();
const port = process.nodeArgs.port || 80;
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const middleware = require('./common/middleware');

const authRouter = require('./router/authRouter')
const apiRouter = require('./router/apiRouter')
const fileRouter = require('./router/fileRouter')
const fs = require('fs');

const logger = require('./common/logger')();
const config = require('./config');
const moment = require('moment');
moment.defaultFormat = config.dateFormat;

app.disable('x-powered-by');
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser());

app.use(middleware.precompose);
app.use(middleware.redirectLogin);

app.use('/__repo/*', (req, res, next) => {
   let filePath = path.join(config.rootStorage, decodeURIComponent(req.originalUrl).replace(/\/__repo/g, ''))
   let file = fs.lstatSync(filePath);
   if (file.isFile()) {
      res.sendFile(filePath);
   } else {
      next();
   }
});
app.use('/__repo', express.static(path.resolve(config.rootStorage)));

app.use(express.static(path.resolve(__dirname, '../client_dist')));
app.use(express.static(path.resolve(__dirname, '../public'), { etag: false }));

app.use(favicon(path.resolve(__dirname, '../public/images/favicon.png')))
app.use('/auth', authRouter)
app.use(middleware.checkSession);

app.use('/api/file', fileRouter)
app.use('/api', apiRouter)

app.use((req, res, next) => {
   res.sendFile(path.resolve(__dirname, '../client_dist/main.html'));
})

// Error Handler
app.use((err, req, res, next) => {
   logger.error(err);
   if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      res.status(err.status || 500).send(err.message)
   } else {
      res.status(500).send({ message: err.message, redirect: '/error.html' });
   }
})

app.listen(port, () => {
   logger.info(`[${process.env.NODE_ENV} Server] is listening to port ${port} `);
});


