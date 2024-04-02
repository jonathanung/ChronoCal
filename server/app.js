var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('./bin/mongoose.config');

var userRouter = require('./routes/user-routes');
var calendarRouter = require('./routes/calendar-routes');
var eventRouter = require('./routes/event-routes');
var expenseRouter = require('./routes/expense-routes');
var paymentMethodRouter = require('./routes/payment-method-routes');
var expenseTypeRouter = require('./routes/expense-type-routes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use('/api/user', userRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/event', eventRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/payment-method', paymentMethodRouter);
app.use('/api/expense-type', expenseTypeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return the error in json format
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: res.locals.error
  });
});


module.exports = app;
