const express = require('express');
const router = express.Router();
const passport = require('passport');
router.get('/signup', (req, res) => {
    res.render('auth/signup');
});
router.get('/login', (req, res) => {
    res.render('auth/login');
});
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

router.post('/login', (req, res,next) => {
    passport.authenticate('local.login',{
        successRedirect:'/profile',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next);
});
router.get('/profile',(req,res)=>{
    res.send('Your Profile')
});
module.exports = router;