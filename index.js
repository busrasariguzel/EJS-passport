const express = require('express');
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path');
const session = require('express-session')
const bcrypt = require('bcryptjs');
const User = require('./models/Users');
const flash = require('connect-flash');
const peopleList = require('./data/userList');
const displayMovie = require('./data/movies');
const { check, validationResult } = require('express-validator');
// const User = require(‘./models/Users’)
let MongoStore = require('connect-mongo')(session)
const passport = require('passport');
const userRoutes = require('./routes/users')



require('dotenv').config();
require('./lib/passport');
const port = process.env.PORT || 8000;


mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch(err => console.log(`Mongodb Error: ${err}`));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))// in order to get the data from the client

app.use(express.static(path.join(__dirname, 'public')))

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());



app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        mongooseConnection: mongoose.connection,
        autoReconnect: true
    }),
    cookie: {
        secure: false,
        maxAge: 6000000

    }
}));
// this has to go after app.session/middleware

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash('successMessage');
    res.locals.errors = req.flash('errors');
    next();
})

app.use('/', userRoutes)

app.get("/random", (req, res) => {
    res.render("random", { peopleList });
});


app.get("/movies", (req, res) => {
    res.render("movies", { displayMovie });
});




// app.get('/register', (req,res) => {

//     return res.render('register');
// })

// app.get('/', (req, res) => {
//     return res.render('index');

// }); // could not move it , it didnt work 

// app.get('/api/users/login', (req, res) => {
//     return res.render('login');

// })
// app.get('/options', (req, res) => {
//     return res.render('options');

// })
// app.get('/loggedIn', (req, res) => {
//     if (req.isAuthenticated()) {
//         return res.render('loggedIn')
//     }
//     return res.redirect('/login')

// })
// app.get('/registered', (req, res) => {
//     if (req.isAuthenticated()) {
//         return res.render('registered')
//     }
//     return res.redirect('/register')
// })



// app.post('/register', [
//     check('name', 'Name is required')
//         .not()
//         .isEmpty(),
//     check('email', 'Please include a valid email').isEmail(),
//     check('password', 'Please include valid password').isLength({ min: 3 })
// ], (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         console.log(errors);
//         return res.render('register', { errors: 'All inputs must be filled' })
//     }

//     User.findOne({ email: req.body.email })
//         .then((user) => {
//             if (user) {
//                 return console.log('user exists')
//             } else {
//                 const user = new User();
//                 const salt = bcrypt.genSaltSync(10)
//                 const hash = bcrypt.hashSync(req.body.password, salt)

//                 user.name = req.body.name;
//                 user.email = req.body.email;
//                 user.password = hash;
//                 ``
//                 user.save().then(user => {
//                     // return res.status(200).json({message: 'user created' ,user})
//                     req.login(user, (err) => {
//                         if (err) {
//                             return res.status(500).json({ message: 'server error' });

//                         } else {
//                             return res.redirect('/registered');
//                             // next();
//                         }
//                     })
//                 }).catch(err => console.log(err));
//             }
//         });
// });

// app.post('/api/users/login', passport.authenticate('local-login', {
//     successRedirect: '/loggedIn',
//     failureRedirect: '/login',
//     failureFlash: true
// }))
// app.get('/api/user/login', (req, res) => {
//     if (req.user === undefined) {
//         req.flash('successMessage', 'no one to log in');
//         return res.redirect('/');
//     }
//     // req.logout();
//     // req.flash('successMessage', 'you are now logged out')
//     return res.redirect('/')
// })

// app.get('/logout', (req, res) => {
//     if (req.user === undefined) {
//         req.flash('successMessage', 'no one to log out');
//         return res.redirect('/');
//     }
//     req.logout();
//     req.flash('successMessage', 'you are now logged out')
//     return res.redirect('/')
// })





// flash tests

// app.get('/flash', (req,res)=> {
//     return res.render('flash',{message: req.flash('info')})
// })

// app.get('/single-flash', (req,res)=>{
//     req.flash('info', 'hi single flash');
//     return res.redirect('/flash')
// });
// app.get('/no-flash', (req,res)=>{
//     return res.redirect('/flash')
// });
// app.get('/multiple-flash', (req,res)=>{
//     req.flash('info',['message1', 'message2']);
//     return res.redirect('/flash')
// });
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});