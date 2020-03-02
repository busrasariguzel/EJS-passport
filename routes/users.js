const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const passport = require('passport');
const { check } = require('express-validator');



router.get("/api/users/register", userController.registerPage)
router.post('/api/users/register', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please include valid password').isLength({ min: 3 })
], userController.registerPost);

router.get('/api/users/login', userController.loginPage)
router.get('/api/users/logout', userController.logout);

router.post('/api/users/login', 
passport.authenticate('local-login', {
    successRedirect: '/loggedIn',
    failureRedirect: '/api/users/login',
    failureFlash: true
})
);
router.get('/logout', userController.logoutMessage);

router.get('/options', (req, res) => {
    return res.render('options');

})
router.get('/', userController.home)

router.get('/options', userController.optionPage);
router.get('/', userController.indexPage);
router.get('/loggedIn',userController.loggedIn );
router.get('/registered', userController.registered);




module.exports = router