// Load all strategies
var LocalStrategy = require('passport-local').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;

// Load up the user model
var bcrypt = require('bcrypt-nodejs');
var models  = require('../models');

module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    // Find username
    models.User.findOne({
      where: {id: id}
    }).then(function(user){
      done(null, user);
    }).error(function(err){
      done(err, null);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-signup',
    new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {
        // Find username
        models.User.findOne({
          where: {username: username}
        }).then(function(user){
          // If username already found in database
          if (user !== null) {
            return done(null, false, {message: 'That username is already taken.'});
          }
          // Groupname validation
          var regex = /^[a-zA-Z0-9]+$/;
          if(!username.match(regex)) {
            return done(null, false, {message: 'Please only use alpha-numeric characters with no spaces'});
            
          }
          // Create if not
          models.User.create({
            username: username,
            password: bcrypt.hashSync(password, null, null) // use the generateHash function in our user model
          }).then(function(user) {
            return done(null, user);
          }).error(function(err) {
            done(err);
          })
        }).error(function(err){
          done(err);
        });
      })
  );

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-login',
    new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {
        // Search for username
        models.User.findOne({
          where: {username: username}
        }).then(function(user){
          // Check if username is found
          if (user == null)
            return done(null, false, {message: 'No user found.'}); // req.flash is the way to set flashdata using connect-flash
          // Check if passwords match
          if (!bcrypt.compareSync(password, user.password))
            return done(null, false, {message: 'Oops! Wrong password.'}); // create the loginMessage and save it to session as flashdata
          // If all well
          return done(null, user);
        }).error(function(err){
          done(err);
        });

      })
  );

  // =========================================================================
  // REMEMBER ME =============================================================
  // =========================================================================

  passport.use(new RememberMeStrategy(
    function(token, done) {
      Token.consume(token, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
      });
    },
    function(user, done) {
      var token = utils.generateToken(64);
      Token.save(token, { userId: user.id }, function(err) {
        if (err) { return done(err); }
        return done(null, token);
      });
    }
  ));

};