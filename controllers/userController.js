const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');

module.exports = {
    registerPage: (req, res) => {
        return res.render('register');
    },
    registerPost: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.render('register', { errors: 'All inputs must be filled' })
        }

        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    return console.log('user exists')
                } else {
                    const user = new User();
                    const salt = bcrypt.genSaltSync(10)
                    const hash = bcrypt.hashSync(req.body.password, salt)

                    user.name = req.body.name;
                    user.email = req.body.email;
                    user.password = hash;

                    user.save().then(user => {
                        // return res.status(200).json({message: 'user created' ,user})
                        req.login(user, (err) => {
                            if (err) {
                                return res.status(500).json({ message: 'server error' });

                            } else {
                                return res.redirect('/registered');
                                // next();
                            }
                        })
                    }).catch(err => console.log(err));
                }
            });
    },
    loginPage: (req, res) => {
        return res.render('login');
    
    },

    home: (req, res) => {
    return res.render('index');

},
    logout: (req, res) => {
        if (req.user === undefined) {
            req.flash('successMessage', 'no one to log out');
            return res.redirect('/');
        }
        req.logout();
        req.flash('successMessage', 'you are now logged out')
        return res.redirect('/')
    },

logoutMessage: (req, res) => {
    if (req.user === undefined) {
        req.flash('successMessage', 'no one to log out');
        return res.redirect('/');
    }
    req.logout();
    req.flash('successMessage', 'you are now logged out')
    return res.redirect('/')
},
optionPage:  (req, res) => {
    return res.render('options');
},
indexPage: (req, res) => {
    return res.render('index');

},
loggedIn: (req, res) => {
    if (req.isAuthenticated()) {
        return res.render('loggedIn')
    }
    return res.redirect('/login')

},
registered: (req, res) => {
    if (req.isAuthenticated()) {
        return res.render('registered')
    }
    return res.redirect('/register')
},
}