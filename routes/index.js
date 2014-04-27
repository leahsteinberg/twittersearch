var express = require('express');
var router = express.Router();
var get_tweets = require('../public/javascripts/api.js');
var home = require(__dirname, 'views/index');
var key = require("../public/javascripts/key.js");


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


var twitterAuth = require('twitter-oauth')({
        consumerKey: key.consumerKey, /* per appication - create a comsumer key here: https://dev.twitter.com/apps */
        domain: 'http://10.0.3.143:8080',
     consumerSecret: key.consumerSecret, /* create a comsumer key here: https://dev.twitter.com/apps */
      loginCallback: "http://10.0.3.143:8080/auth/twitter/callback",  /* internal */
   completeCallback:  "http://10.0.3.143:8080/search/beagles"  /* When oauth has finished - where should we take the user too */
});

console.log("made new OA");


router.get('/twitter/sessions/connect', twitterAuth.oauthConnect);
router.get('/twitter/sessions/callback', twitterAuth.oauthCallback);
router.get('/twitter/sessions/logout', twitterAuth.logout);

/* GET home page. */
router.get('/', function(req, res) {
	console.log("home page!");
  res.render('index', { title: 'Twitter Search' });
});


router.get('/send', function(req, res) {
	console.log(" in /auth/twitter but really send");
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret,results){
		if(error){
			console.log(error);
			res.send("uh oh didnt work");
		}
		else{
			
			req.session.oauth = {token: "thetoken"};
			console.log("set up oauth session");
			console.log("req.session.oauth is!!! ", req.session.oauth);
			req.session.oauth.token = oauth_token;
			console.log('oauth.token: '+ req.session.oauth.token);
			req.session.oauth.token_secret = oauth_token_secret;
			console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
			var responseString = 'https://twitter.com/oauth/authenticate?oauth_token='+oauth_token;
			res.json(responseString);
			//res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token);
		}
	});
// 	console.log("got a send request!");
// 	  var twitter_query = req.query.twitter_query;
// 	  console.log("twitter query is: ", twitter_query);
// //console.log("req seession", req.session);
//   // twitterAuth.search(req.query.twitter_query.split('|'),  req.session.oauthAccessToken, req.session.oauthAccessTokenSecret,  function(error, data) {
//   //   console.log("32424~~~", req.session.oauthAccessToken);
//   //   console.log("data is", data);
//   //   res.json(data);

//   // });
// console.log("djfslkjf");
// 	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
// 	if(error) {new Error(error.data);
// 		console.log( "in oa auth error");
// 	}
// 		else{
// 			//console.log(res);
// 			req.session.oauth = {}
// 			console.log("in oa auth NO error! :)");
// 			console.log("oauth_token is :", oauth_token);
// 			req.session.oauth.RequestToken = oauth_token;
// 			req.session.oauth.RequestTokenSecret = oauth_token_secret;
// 			console.log("about to send first redirect");
// 			res.status = 200;
// 			console.log("oauth toeken is: ", oauth_token);
// 			var responseString = 'https://twitter.com/oauth/authenticate?oauth_token='+oauth_token;
// 			res.json(responseString);
// 		//res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token);/// send this string back
// 	//and then 
// 	// oauth should have authenticate url generator
// 	// 
			
// 			console.log("sent the first redirect");
// 		}
// })
// 	//get_tweets.make_request(req, res, twitter_query, function(){
// 	//this is where i define the callback function of make requests
// 	//console.log("this is the callback of make_request!");
// 	//});
});

router.get('/search/beagles', function(req, res) {
	console.log("TWITTER IS TRYNA hit me!");
  res.send("hey from twitter!");
});



router.get('/search', function(req, res){
console.log("search!!!!!!");
	 var twitter_query = req.query.twitter_query;
	  console.log("twitter query is: ", twitter_query);
	  get_tweets.make_request(req, twitter_query, function(query){
	  	res.json(query);
// 	//this is where i define the callback function of make requests
// 	//console.log("this is the callback of make_request!");
});

});


router.get('/auth/twitter/callback', function(req, res, next){
	console.log("&&&&&&&&", req.session);
	console.log("////in router callback!");
	console.log("***", req.session.oauth);
	if (req.session.oauth) {
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth = req.session.oauth;

		oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
		function(error, oauth_access_token, oauth_access_token_secret, results){
			if (error){
				console.log(error);
				res.send("yeah something broke.");
			} else {
				console.log("twitter hitting auth/twitter/callback thing :)")
				req.session.oauth.access_token = oauth_access_token;
				req.session.oauth.access_token_secret = oauth_access_token_secret;
				console.log("88888", results);
				//res.send("hello moto!");
				res.render('search', { title: 'Twitter Search' });

			}
		}
		);
	} else
		next(new Error("you're not supposed to be here."))
});





module.exports = router;