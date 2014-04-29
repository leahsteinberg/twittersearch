var express = require('express');
var path = require('path');
var jade = require('jade');
var key = require("./server/key.js");
var bodyParser = require('body-parser');
var routes = require('./server/index');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();

app.use(cookieParser());
app.use(expressSession({secret: 'somesecret'}));
app.use(bodyParser());





app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'views')));
app.use('/', routes);


if(process.env.PORT){
	console.log("using their port!");
}
else{
	console.log("not using their port");
}
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Listening on ' + port);
});

module.exports = app;
