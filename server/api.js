var key = require("./key.js");
var twitterAPI = require("node-twitter-api");
var http = require('http');


var make_request = function(oa, req, query, callback){
	var encoded_query = encodeURIComponent(query);
		oa.get("https://api.twitter.com/1.1/search/tweets.json?q="+encoded_query, req.session.access_token, req.session.access_token_secret, function(error, data, response){
			if(error){
			console.log( error);
			}
			else{
				var jsonData = JSON.parse(data);
				callback(jsonData["statuses"]);
			}
		});
};


exports.make_request = make_request;


