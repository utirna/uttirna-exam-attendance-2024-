var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var upload = require('express-fileupload');
var logger = require('morgan');
var db_connect = require('./application/config/db.connect'); // connection string
const errorHandler = require('./routes/middlewares/error-handler');
const dotenv = require('dotenv');
const attendenceRouter = require('./routes/attendanceRouter');
const indexRouter = require('./routes/indexRouter');
const candidateRouter = require('./routes/candidateRouter.js');
dotenv.config();

var app = express();
app.use(cors());
app.use(upload());
app.use(
	session({
		secret: 'uttirna_sec',
		resave: true,
		saveUninitialized: true,
	})
);

// create a single instance or database
// app.use(db_connect.myConnection(db_connect.mysql, db_connect.dbOptions, 'single'));

// view engine set

app.set('views', path.join(__dirname, 'application/views'));
app.set('view engine', 'ejs');
app.use(function (req, res, next) {
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// attendance routes
app.use('/', indexRouter);
app.use('/candidate', candidateRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
