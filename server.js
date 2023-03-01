const express = require("express");
const app = express();
const cors = require('cors');

var session  = require('express-session');
var cookieParser = require('cookie-parser');

var passport = require('passport');
var flash    = require('connect-flash');


const PORT = process.env.PORT || 8080;
// require('dotenv').config();
//more notes
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const mysql = require('mysql2');
app.use(cors({
  origin: ['https://audrevui.herokuapp.com', 'http://localhost:3000']
}));


require('./passport')(passport); // pass passport for configuration



// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
app.use(express.json());
app.use(session({
	secret: 'abpondersfile',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions



// create the connection to database
const connection = mysql.createPool({
  host:process.env.host,
  user:process.env.user,
  database:process.env.database,
  password:process.env.password
});

require('./routes/route.js')(app, passport, connection); // load our routes and pass in our app and fully configured passport


app.listen(PORT, () => console.log(`server listening on ${PORT}`));


