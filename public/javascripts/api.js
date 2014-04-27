var key = require("./key.js");
var twitterAPI = require("node-twitter-api");
var http = require('http');


var twitter = new twitterAPI({
 	consumerKey: key.consumerKey,
 	consumerSecret: key.consumerSecret,
 	callback: "10.0.3.143:8080/auth/twitter/callback"
	
 });



var make_request = function(oa, req, query, callback){
	console.log("in make request, query is: ", query);

console.log("r.s.o  ", req.session.oauth);
var encoded_query = encodeURIComponent(query);
console.log(encoded_query);
var parameters = {q: encoded_query};
oa.get("https://api.twitter.com/1.1/search/tweets.json?q="+encoded_query, req.session.access_token, req.session.access_token_secret, function(error, data, response){
	if(error){
	console.log( error);
	}
	else{
		console.log(data);
		//console.log(response);
	}
});



//callback(query);
};


module.exports.make_request = make_request;


