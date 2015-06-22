var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
var routes = require('./routes/index');
var users = require('./routes/users');
var _ = require('underscore');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//Cookies
var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));
// MongoDB Session
var MongoSessionStore = require('session-mongoose')(require('connect'));
var sessionStore = new MongoSessionStore({url: credentials.mongo.development.connectionString});
// Sessions
app.use(require('express-session')({
  secret:credentials.cookieSecret,
  // MongoDB.....
  store: sessionStore,
  saveUninitialized: true, // (default: true)
  resave: true
}));
var mongoose = require('mongoose');
var opts = {
  server:{
    socketOptions:{keepAlive:1}
  }
};
switch(app.get('env')){
  case 'development':
    mongoose.connect(credentials.mongo.development.connectionString, opts);
    break;
  case 'production':
    mongoose.connect(credentials.mongo.production.connectionString, opts);
    break;
  default:
    throw new Error('Unknown execution environment: '+app.get('env'));
}
app.set('port', process.env.PORT || 3000);
app.use(function(req,res,next){
  // create a domain for the request
  var domain = require('domain').create();
  //handle errors on this domain
  domain.on('error',function(err){
    console.error('DOMAIN ERROR CAUGHT\n', err.stack);
    try{
      setTimeout(function(){
        console.error('Failsafe shutdown');
        process.exit(1);
      },5000);

      // disconnect from the cluster
      var worker = require('cluster').worker;
      if (worker) worker.disconnect();
      // stop taking new request by closing the server
      server.close();
      // attempt to use Express error route
      try{
        next(err);
      }catch(err){
        console.log('Express error mechanism failed./n', err.stack);
        res.statusCode = 500;
        res.type('text/plain');
        res.end('Server error.');
      }
    }catch(err){
      console.log('Unable to send 500 response./n', err.stack);
    }
  });
  domain.add(req);
  domain.add(res);

  domain.run(next);
});
app.use(function(req, res, next){

  // Cluster....
  var cluster = require('cluster');
  if (cluster.isWorker) console.log('Worker %d received request', cluster.worker.id);

  next();
});



//app.use('/', routes);
//app.use('/users', users);

app.use('/speedvocab', function(req,res,next){
  //console.log('req.session.passport: ',_.isUndefined(req.session.passport));
  if ( _.isUndefined(req.session.passport) || _.isUndefined(req.session.passport.user) || _.isNull(req.session.passport.user))
    return res.redirect(303,'/unauthorized');
  next();
});


app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
app.get('/account',function(req,res){
    if (!req.session.passport.user)
        return res.redirect(303,'/unauthorized');
    //res.type('text/plain').send(req.session.passport.user);
    var User = require('./models/user.js');
    User.findOne({_id: req.session.passport.user},function(err,user){
        if (err) throw err;
        //console.log(user);
        req.session.detail = {
            name: user.name,
            email: user.email
        };
        res.redirect('/speedvocab');
    });

});
var speedvocabRoutes = require('./routes/routes.js');
app.use('/speedvocab', speedvocabRoutes);
//routes(app);

var soundcloudRoutes = require('./routes/soundcloud.js');
app.use('/soundcloud', soundcloudRoutes);

var practiceRoutes = require('./routes/practice.js');
app.use('/practice', practiceRoutes);

// Facebook Authentication
var authFacebook = require('./lib/authFacebook.js')(app,{
  providers: credentials.authProviders,
  successRedirect: '/account',
  failureRedirect: '/unauthorized'
});
authFacebook.init();
authFacebook.registerRoutes();

// Google Authentication
var authGoogle = require('./lib/authGoogle.js')(app,{
  providers: credentials.authProviders,
  successRedirect: '/account',
  failureRedirect: '/unauthorized'
});
authGoogle.init();
authGoogle.registerRoutes();

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
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var http = require('http').Server(app);


function startServer(){
  //console.log(app.get('port'));
  //console.log(app.get('env'));
  http.listen(app.get('port'), function(){
    console.log('Express start in '+app.get('env')+' mode on http://localhost:'+app.get('port')+'; Ctrl + C to terminate');
  });
}



if (require.main === module){
  startServer();
}else{
  module.exports = startServer;
}