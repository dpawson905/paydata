require('dotenv').config();

const debug = require('debug')('paydata:main');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const methodOverride = require('method-override');
const helmet = require('helmet');

const winston = require('./config/winston');

const User = require('./models/user');

const indexRouter = require('./routes/index');
const payRouter = require('./routes/pay');
const usersRouter = require('./routes/users');

const app = express();

const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: 'sessions'
});
const csrfProtection = csrf();

// Connect to db
mongoose.connect(process.env.DB_URL, {
  useCreateIndex: true,
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  debug('Connected to MongoDB');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.locals.moment = require('moment');
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(helmet());
app.locals.moment = require('moment');

var sess = {
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, expires: Date.now() + 1000 * 60 * 60 * 24 * 7, maxAge: 1000 * 60 * 60 * 24 * 7},
  store: store
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(flash());
app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.title = 'Pay Data';
  // res.locals.csrfToken = req.csrfToken();
  res.locals.query = req.query;
  res.locals.week = req.query.week;
  res.locals.currentUser = req.user;
  res.locals.isAuthenticated = req.user ? true : false;
  next();
});

app.use('/pay', payRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  console.log(err.stack);
  req.flash('error', err.message);
  res.redirect('/');
});

const port = process.env.PORT || 3000;

app.listen(port, process.env.IP, function() {
  debug("Customers!");
});
