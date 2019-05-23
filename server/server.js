// Setup ======
const express = require('express');
const morgan = require('morgan');             // log requests to the console (express4)
const bodyParser = require('body-parser');    // pull information from HTML POST (express4)
const expressValidator = require('express-validator');
const session = require('express-session');
const methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// init app
const app = express();

app.use(express.static(__dirname + 'public'));    // set the static files location
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
  }));

  // express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

  // app.get('*', (req, res) => res.status(200).send({
  //   message: 'Welcome to the beginning of More-Recipes.',
  // }));

// APIs
app.get('/api/users/index', (req, res) =>{
    res.json({name: "Micheal Smith"});
});

// Route files
let users = require('./routes/users');
let recipes = require('./routes/recipes');
app.use('/api/users', users);
app.use('/api/recipes', recipes);

app.listen(3030, () =>{
    console.log('Express is listening on port 3030... ');
});
