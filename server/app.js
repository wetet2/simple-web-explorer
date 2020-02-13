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
const config = require('./config');

var app = express();
app.use(session({
    secret: '!@#mypasswordisnothing!@#',
    resave: false,
    saveUninitialized: true,
}));

app.set('views', path.join(__dirname, '../views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use((req, res, next) => {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204);
    } else {
        next();
    }
});
app.use((req, res, next) => {
    req.remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if(req.remoteIp.indexOf(config.adminAuthIp) >= 0){
        req.isAdmin = true;
    }
    next();
})
app.use('/__auth', authRouter);
app.use((req, res, next) => {
    if(config.useLogin){
        if(sessionManager.isValid(req.session.id)){
            next();
        }else{
            res.render('login.html');
        }   
    }else{
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
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error.html');
});
module.exports = app;
