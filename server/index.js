var express = require('express');
var router = express.Router();
var get_tweets = require('../server/api.js');
var home = require(__dirname, 'views/index');
var key = require("../server/key.js");
var sys = require('sys');
var twitterAPI = require('node-twitter-api');
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
//     // want it to serve static files.
//     res.send("index.html");
// });


router.get('/send', function(req, res) {
	console.log(" in /auth/twitter but really send");

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
	console.log("search!!!!!!");
	var twitter_query = req.query.twitter_query;
	console.log("twitter query is: ", twitter_query);
	get_tweets.make_request(oa, req, twitter_query, function(tweets){
		res.json(tweets);
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
				/// change this line so it goes to index.html!! (also how to pass in session info)
				res.cookie("logged_in", true);
				res.redirect("/index.html");
				//res.render('search', { title: 'Twitter Search' });

			}
		}
		);
	} else
		next(new Error("you're not supposed to be here."))
});





module.exports = router;
