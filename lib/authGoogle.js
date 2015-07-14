var User =require('../models/user.js');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var credentials = require('../credentials');
var jwt = require('jsonwebtoken');

var jwtSecret = credentials.jwtSecret;

passport.serializeUser(function(user,done){
    done(null, user._id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err, user){
        if (err || !user) return done(err, null);
        done(null, user);
    });
});

module.exports = function(app, options){
    if (!options.successRedirect) options.successRedirect = '/account';
    if (!options.failureRedirect) options.failureRedirect = '/login';

    return {
        init:function(){
            var env = app.get('env');
            var config = options.providers;

            // configure Google strategy
            passport.use(new GoogleStrategy({
                clientID: config.google[env].appId,
                clientSecret:config.google[env].appSecret,
                callbackURL:'http://chuson.herokuapp.com/auth/google/callback'
            }, function(accessToken, refreshToken, profile, done){
                var authId = 'google: '+profile.id;
                console.log('Profile: ',profile);
                User.findOne({authId:authId}, function(err,user){
                    if (err) return done(err, null);
                    if (user) return done(null, user);
                    user = new User({
                        authId:authId,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value || null,
                        createdAt: Date.now(),
                        role:'customer'
                    });
                    user.save(function(err){
                        if (err) return done(err, null);
                        done(null, user);
                    });
                });
            }));
            app.use(passport.initialize());
            app.use(passport.session());
        },
        registerRoutes: function(){
            // register Google routes
            app.get('/auth/google',passport.authenticate('google',{ scope: 'https://www.googleapis.com/auth/plus.profile.emails.read' }));

            app.get('/auth/google/callback', passport.authenticate('google',
                { failureRedirect:options.failureRedirect }),
                function(req, res){
                    //console.log('req: ',req);
                    //console.log('res: ',res);
                    // success
                    res.redirect(303, options.successRedirect);
                    }
            );
        }
    };
};
//lh3.googleusercontent.com/-R8JeKFob0P8/AAAAAAAAAAI/AAAAAAAADLg/9WvRIkmrNv8/photo.jpg?sz=50