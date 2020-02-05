var createError = require('http-errors');
var express = require('express');
var session = require('express-session');

var path = require('path');
var cookieParser = require('cookie-parser');

var authRouter = require('./routes/auth');
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
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use((req, res, next) => {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204);
    } else {
        next();
    }
});

app.use('/__auth', authRouter);
app.use((req, res, next) => {
    if(config.needLogin){
        if(sessionManager.isValid(req.session.id)){
            next();
        }else{
            res.render('login');
        }   
    }else{
        next();
    }
});
app.use('/', indexRouter);

// app.use(function (req, res, next) {
//     next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
