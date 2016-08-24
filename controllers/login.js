var passport = require('passport');

module.exports = function(req, res, next) {
	// If not authenticate
	passport.authenticate('local-login', function(err, user, info) {
		if (err) return next(err);
		if (!user) return res.json(info);
		req.logIn(user, function(err) {
			if (err) return next(err);
			return res.json({redirect: '/groups'});
		});
	}) (req, res, next)
}, function(req, res, next) {
  // issue a remember me cookie if the option was checked
  if (!req.body.remember_me) { return next(); }

  var token = utils.generateToken(64);
  Token.save(token, { userId: req.user.id }, function(err) {
    if (err) { return done(err); }
    res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
    return next();
  });
}, function(req, res) {
  res.redirect('/');
}