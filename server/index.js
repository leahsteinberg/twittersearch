var express = require('express');
var router = express.Router();
var get_tweets = require('../server/api.js');
var home = require(__dirname, 'views/index');
var key = require("../server/key.js");
var sys = require('sys');
var twitterAPI = require('node-twitter-api');
console.log("requiring index");
var twitter = new twitterAPI({
	consumerKey: key.consumerKey,
	consumerSecret: key.consumerSecret,
	callback: "http://10.0.3.143:8080/auth/twitter/callback"
});

var OAuth = require('oauth').OAuth;

var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	key.consumerKey,
	key.consumerToken,
	"1.0",
	"http://10.0.3.143:8080/auth/twitter/callback",
	"HMAC-SHA1"
	);
/* GET home page. */
// router.get('/', function(req, res) {
// 	console.log("trying to serv home");

//     //want it to serve static files.
//    res.redirect("/index.html");
// });


router.get('/send', function(req, res) {
	console.log(" in send ");


	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret,results){
		if(error){
			console.log(error);
			res.send("uh oh didnt work");
		}
		else{
			
			req.session.oauth = {token: "thetoken"};
			req.session.oauth.token = oauth_token;
			req.session.oauth.token_secret = oauth_token_secret;
			var responseString = 'https://twitter.com/oauth/authenticate?oauth_token='+oauth_token;
			res.json(responseString);
		}
	});

});



router.get('/search', function(req, res){
	console.log(req);
	var twitter_query = req.query['searchtwitter'];
	console.log("twitter query is: ", twitter_query);
	get_tweets.make_request(oa, req, twitter_query, function(tweets){
		console.log("got tweets back in router");
		res.json(tweets);
	});
});

router.get('/fave', function(req, res){
	var tweet_id = req.query['id'];
	console.log("tweet id is on the router. it's: ", tweet_id);

	oa.post("https://api.twitter.com/1.1/favorites/create.json"+encoded_query, req.session.access_token, req.session.access_token_secret, function(error, data, response){
	if(error){
	console.log( error);
	}
	else{

		//console.log(data);
		// var jsonData = JSON.parse(data);
		// console.log("got tweets back in api");
		// //console.log("got back in make request,", jsonData["statuses"][0]);
		// callback(jsonData["statuses"]);
		//console.log(response);
	}
});

});


router.get('/auth/twitter/callback', function(req, res, next){	
	if (req.session.oauth) {
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth = req.session.oauth;
		oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
		function(error, oauth_access_token, oauth_access_token_secret, results){
			if (error){
				console.log(error);
				res.send("yeah something broke.");
			} else {
				req.session.oauth.access_token = oauth_access_token;
				req.session.oauth.access_token_secret = oauth_access_token_secret;
				res.cookie("logged_in", "so_true");
				res.redirect("/searching.html");


			}
		}
		);
	} else
		next(new Error("you're not supposed to be here."))
});





module.exports = router;
