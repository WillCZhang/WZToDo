var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
var cors = require('cors');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

let UserManager = require('./app/user');
let userManager = new UserManager();
let TodoApp = require('./app/todo');
let todo = new TodoApp();

var app = express();

app.use(session({
  secret: 'ljdsJWfidsm932rufnaJAr',
  store: new FileStore(),
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 100000000 }
}));

function checkAuth(req, res, next) {
  req.session.loginUser === req.params.user ? res.send('username issue') : next();
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('combined'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routers:
app.post('/login', function (req, res, next) {
  if (userManager.exist(req.body.user)) {
    req.session.regenerate(function (err) {
      if (err) {
        res.json({ code: 400, msg: "Username doesn't exist" })
      } if (!req.body.user || !req.body.password || !userManager.login(req.body.user, Buffer.from(req.body.password, 'base64').toString())) {
        res.json({ code: 400, msg: "Wrong username or password" })
      } else {
        req.session.loginUser = req.body.user;
        console.log(req.session.loginUser)
        res.json({ code: 200, msg: "Success!" });
      }
    });
  } else {
    res.json({ code: 400, msg: "Wrong username" });
  }
});

app.get('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      res.json({ code: 400, msg: "Logout failed" });
      return;
    }
    res.clearCookie(identityKey);
  });
});

app.get('/user/:user/list', checkAuth, (req, res, next) => {
  try {
    if (!req.params || !req.params.user || !userManager.exist(req.params.user))
      throw 'Invalid request';
    console.log("Received user " + req.params.user + " loading todo list request");
    res.status(200);
    res.json(todo.loadTodoList(req.params.user));
  } catch (err) {
    res.json({ code: 400, msg: err })
  }
});

app.post('/user/:user/list', checkAuth, (req, res, next) => {
  try {
    if (!req.params || !req.params.user || !userManager.exist(req.params.user) || !req.body.text)
      throw 'Invalid request';
    console.log("Received user " + req.params.user + " adding todo list " + req.body.text + " request");
    todo.addItem(req.params.user, req.body.text, req.body.detail? req.body.detail : "");
    res.status(200);
    let response = todo.loadTodoList(req.params.user);
    console.log(response);
    res.json(response);
  } catch (err) {
    res.json({ code: 400, msg: err })
  }
});

app.put('/user/:user/:uuid', checkAuth, (req, res, next) => {
  try {
    if (!req.params || !req.params.user || !req.params.uuid || !userManager.exist(req.params.user))
      throw 'Invalid request';
    console.log("Received user " + req.params.user + " deleting todo list item request");
    todo.changeStatus(req.params.user, req.params.uuid);
    res.status(200);
    res.json(todo.loadTodoList(req.params.user));
  } catch (err) {
    res.json({ code: 400, msg: err })
  }
});

app.delete('/user/:user/:uuid', (req, res, next) => {
  try {
    if (!req.params || !req.params.user || !req.params.uuid || !userManager.exist(req.params.user))
      throw 'Invalid request';
    console.log("Received user " + req.params.user + " deleting todo list item request");
    todo.deleteItem(req.params.user, req.params.uuid);
    res.status(200);
    res.json(todo.loadTodoList(req.params.user));
  } catch (err) {
    res.json({ code: 400, msg: err })
  }
});

module.exports = app;
