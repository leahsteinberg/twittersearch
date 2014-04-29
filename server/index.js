var express = require('express');
var router = express.Router();
var get_tweets = require('../server/api.js');
var home = require(__dirname, 'views/index');
var key = require("../server/key.js");
var sys = require('sys');
var twitterAPI = require('node-twitter-api');
var http = require('http');

var twitter = new twitterAPI({
	consumerKey: key.consumerKey,
	consumerSecret: key.consumerSecret,
	callback: "http://sheltered-crag-4575.herokuapp.com/auth/twitter/callback"
});

var OAuth = require('oauth').OAuth;

var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	key.consumerKey,
	key.consumerToken,
	"1.0",
	"http://sheltered-crag-4575.herokuapp.com/auth/twitter/callback",
	"HMAC-SHA1"
	);
router.get('/'), function(req, res){
	 res.render('index', { title: 'Express' });

});
router.get('/tweets'), function(req, res){
	 res.render('searching', { title: 'Express' });

});

router.get('/send', function(req, res) {
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret,results){
		if(error){
			console.log(error);
		}
		else{
			
			req.session.oauth = {};
			req.session.oauth.token = oauth_token;
			req.session.oauth.token_secret = oauth_token_secret;
			var responseString = 'https://twitter.com/oauth/authorize?oauth_token='+oauth_token;
			res.json(responseString);
		}
	});

});


router.get('/search', function(req, res){
	var twitter_query = req.query['searchtwitter'];
	get_tweets.make_request(oa, req, twitter_query, function(tweets){
		res.json(tweets);
	});
});

router.get('/fave', function(req, res){
	var tweet_id = req.query['id'].trim();
	var encoded_id = encodeURIComponent(tweet_id);
	oa.post("https://api.twitter.com/1.1/favorites/create.json",
		req.session.oauth.access_token, 
		req.session.oauth.access_token_secret,
		{'id': tweet_id}, "application/x-www-form-urlencoded",
		function(error, data, response){
		if(error){
			console.log(error);
		}
		else{
			res.json(JSON.parse(data));
		}
	});

});


router.get('/unfave', function(req, res){
	var tweet_id = req.query['id'].trim();
	var encoded_id = encodeURIComponent(tweet_id);
	oa.post("https://api.twitter.com/1.1/favorites/destroy.json",
		req.session.oauth.access_token, 
		req.session.oauth.access_token_secret,
		{'id': tweet_id}, "application/x-www-form-urlencoded",
		function(error, data, response){
		if(error){
			console.log(error);
		}
		else{
			res.json(JSON.parse(data));
		}
	});

});


router.get('/auth/twitter/callback', function(req, res, next){	
	if (req.session.oauth) {
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth = req.session.oauth;
		oa.getOAuthAccessToken(oauth.token,oauth.token_secret,req.session.oauth.verifier, 
		function(error, oauth_access_token, oauth_access_token_secret, results){
			if (error){
				console.log(error);
				res.send("yeah something broke.");
			} else {
				req.session.oauth.access_token = oauth_access_token;
				req.session.oauth.access_token_secret = oauth_access_token_secret;
				res.redirect("/tweets");
			}
		}
		);
	} else
		next(new Error("you're not supposed to be here."))
});


module.exports = router;
