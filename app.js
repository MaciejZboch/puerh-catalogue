if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//requires
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const path = require('path');
const ExpressError = require('./utilities/ExpressError')
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash')
const User = require('./models/user')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/users')
const teaRoutes = require('./routes/tea')
const reviewRoutes = require('./routes/review')


const dbUrl = 'mongodb://localhost:27017/test'
//connecting to mongoDB
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log('Mongo connection succesful!')
    })
    .catch(err => {
        console.log('damn, Mongo error!')
        console.log(err)
    })

const db = mongoose.connection;

//misc setup stuff
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());



const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'lolbadsecret'
    }
})

store.on('error', function (e) {
    console.log('session store error!', e)
})


const sessionConfig = {
    secret: 'lolbadsecret',
    store,
    resave: false,
    saveUintintialilzed: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(helmet({ contentSecurityPolicy: false }))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.filters = req.query;
    next()
})



//routes

app.use('/', userRoutes);
app.use('/tea', teaRoutes);
app.use('/tea/', reviewRoutes);



//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, something went wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(8080, () => {
    console.log('Listening on port 8080!')
})