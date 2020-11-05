var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var authRouter = require('./routes/auth');
var fileRouter = require('./routes/file');
var indexRouter = require('./routes/index');
var sessionManager = require('./common/sessionManager');
var requestIp = require('request-ip');
const favicon = require('serve-favicon');
const config = require('./config');

var app = express();
app.use(session({
    secret: '!@#mypasswordisnothing!@#',
    resave: false,
    saveUninitialized: true,
}));

app.set('views', path.join(__dirname, '../views'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(favicon(path.resolve(__dirname, '../public/images/favicon.png')))
app.use((req, res, next) => {
    let clientIp = requestIp.getClientIp(req);
    let ip = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.exec(clientIp);
    if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1') req.isAdmin = true;
    else if (ip && ip.length > 0 && config.adminAuthIp.indexOf(ip[0]) >= 0) {
        req.isAdmin = true;
    }
    next();
})
app.use('/__auth', authRouter);
app.use((req, res, next) => {
    if (config.useLogin) {
        if (sessionManager.isValid(req.session.id)) next();
        else res.render('login');
    } else {
        next();
    }
});
app.use('/__file', fileRouter);
app.use('/', indexRouter);

// error handler
app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;