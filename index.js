const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if(!isProduction) {
    app.use(errorHandler());
}
//Models and Routes

require('./models/Users');
require('./config/passport');
app.use(require('./routes'));

//Configure Mongoose

mongoose.connect('mongodb://localhost:27017/passport-tutorial',{useNewUrlParser: true});
mongoose.set('debug', true);

//Error handlers & middlewares
if(!isProduction) {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        console.log("2222222")
        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
        // next();
    });
}

app.use(function(err, req, res, next)  {
    res.status(err.status || 500);

    console.log("111111111");
    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
    // next();
});

app.listen(8000, () => console.log('Server running on http://localhost:8000'));