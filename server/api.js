var key = require("./key.js");
var twitterAPI = require("node-twitter-api");
var http = require('http');


var make_request = function(oa, req, query, callback){
	console.log("in make request, query is: ", query);

console.log("r.s.o  ", req.session.oauth);
var encoded_query = encodeURIComponent(query);
console.log(encoded_query);
//var parameters = {q: encoded_query};
console.log("in get1", req);
console.log("in get2 ", req.session);
	console.log("in get3", req.session.oauth.access_token);
		console.log("in get4", req.session.oauth.access_token_secret);
oa.get("https://api.twitter.com/1.1/search/tweets.json?q="+encoded_query, req.session.access_token, req.session.access_token_secret, function(error, data, response){
	if(error){
	console.log( error);
	}
	else{

		//console.log(data);
		var jsonData = JSON.parse(data);
		console.log("got tweets back in api");
		//console.log("got back in make request,", jsonData["statuses"][0]);
		callback(jsonData["statuses"]);
		//console.log(response);
	}
});


};


exports.make_request = make_request;


