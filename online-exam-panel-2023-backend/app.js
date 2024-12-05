var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var session = require('express-session');
/*const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();*/
var upload = require('express-fileupload');
var logger = require('morgan');
var db_connect = require('./application/config/db.connect'); // connection string
const errorHandler = require('./routes/middlewares/error-handler');

var app = express();
var indexRouter = require('./routes/index')(app.io); // commen router index.js
app.use(cors());
app.use(upload());
app.use(
	session({
		secret: 'utirna_admin',
		resave: true,
		saveUninitialized: true,
	})
); // setting session*/
/*app.use(session({
  secret: 'ssshhhhh',
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
  saveUninitialized: false,
  resave: false
}));    */
// create a single instance or database
app.use(db_connect.myConnection(db_connect.mysql, db_connect.dbOptions, 'single'));

// view engine set

app.set('views', path.join(__dirname, 'application/views'));
app.set('view engine', 'pug');
app.use(function (req, res, next) {
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter.index);
app.use('/admin', indexRouter.users);

// attendance routes
app.use('/api', indexRouter.apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
