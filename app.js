var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', require('./apis'));

// set start page for angularjs application
app.get('/pf',function(req,res){
    res.sendFile('./public/index-pf.html', {root: path.join(__dirname)});
});
app.get('/*',function(req,res){
    var ssoConfig = {
        isSSOEnabled: global.ssoconfig.config.active,
        ssoLinkCaption: global.ssoconfig.config.linkCaption,
    } 
    res.cookie('ssoConfig', JSON.stringify(ssoConfig), { maxAge: 900000});
    res.sendFile('./public/index-slds.html', {root: path.join(__dirname)});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).send({
        success: false,
        error: err
    });
    // res.render('error', {
    //   message: err.message,
    //   error: err
    // });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).send({
      success: false,
      error: err
  });
  // res.render('error', {
  //   message: err.message,
  //   error: {}
  // });
});


module.exports = app;
