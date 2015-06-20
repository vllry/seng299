var express = require('express');
var router = express.Router();


router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

module.exports = router;