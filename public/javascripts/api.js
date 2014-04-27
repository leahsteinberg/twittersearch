var key = require("./key.js");
var twitterAPI = require("node-twitter-api");
var http = require('http');


//console.log("http is", http);



var twitter = new twitterAPI({
 	consumerKey: key.consumerKey,
 	consumerSecret: key.consumerSecret,
 	callback: "10.0.3.143:8080/auth/twitter/callback"
	
 });



var make_request = function(req, query, callback){
	console.log("in make request, query is: ", query);

console.log("r.s.o  ", req.session.oauth);
var encoded_query = encodeURIComponent(query);
console.log(encoded_query);
twitter.search({q: encoded_query}, req.session.oauth.access_token, req.session.oauth.access_token_secret, function(error, data, response){
	if(error){
		console.log(error);
		console.log("there's an error in make request");
	}
	else{
		console.log("in make requesttt", data);
	}
});

// twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
// 	if(error){
// 		console.log("error getting oauth request token: " + error);
// 	}else{
// 		console.log("skjfsdlkf");
// 	}
// })


//callback(query);
};
module.exports.make_request = make_request;