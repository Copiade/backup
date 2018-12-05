var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (!req.session.user || req.session.user && !req.session.user.logged_in) {
    res.redirect('/login');
  } else {
    res.render('index', {
      session: req.session
    });
  }
});

module.exports = router;
