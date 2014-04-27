var express = require('express');
var path = require('path');
var jade = require('jade');
var key = require("./public/javascripts/key.js");
var bodyParser = require('body-parser');

var app = express();




var expressSession = require('express-session');
var cookieParser = require('cookie-parser');

//console.log("cookie parse is", cookieParser);
app.use(cookieParser());
app.use(expressSession({secret: 'somesecret'}));
app.use(bodyParser());

var routes = require('./routes/index');




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Listening on ' + port);
});

module.exports = app;