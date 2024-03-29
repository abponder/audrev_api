// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql2');
var bcrypt = require('bcrypt-nodejs');
const connection = mysql.createPool({
    host:process.env.host,
    user:process.env.user,
    database:process.env.database,
    password:process.env.password
  });
// connection.connect();
connection.query('USE ' + process.env.database);
// // connection.end();
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log('serializeUser:', user)
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        // connection.connect();
        console.log('deserializeUser:',id)
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
        // connection.end();
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            // connection.connect();
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    console.log(rows)
                    return done(null);
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";
                    // connection.connect();
                    console.log(username, password)
                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        console.log(rows, err)
                        newUserMysql.id = rows.insertId;
                        
                        return done(null, newUserMysql);
                    });
                    // connection.end();
                }
            });
            // connection.end();
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            // connection.connect();
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    // wrong user name
                    return done(null); 
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    //wrong username
                return done(null); 
                console.log(rows[0])
                // all is well, return successful user
                return done(null, rows[0]);
            });
            // connection.end();
        })
    );
};
