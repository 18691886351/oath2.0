var express = require('express');
var router = express.Router();
var Service = require('./service1.js');
var service = new Service();
//var Taxi=require('./taxi.js');
//var taxi=new Taxi();
//var Promise = require("bluebird");
//var serveice=Promise.promisifyAll(new Service());


var appConfig = require('.././lib/appConfig2.js');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var parseUrl = require('url').parse;
var formatUrl = require('url').format;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser()); //使用cookie
var session = require('express-session'); //使用session
router.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, }));


function addQueryParamsToUrl(url, params) {
    var info = parseUrl(url, true);
    for (var i in params) {
        info.query[i] = params[i];
    }
    delete info.search;
    return formatUrl(info);
}


//用户客户端，客户端有授权则直接访问资源，如果没有则重定向到授权认证服务器。
router.get('/sample', function(req, res) {
    //从session中获取用户信息
    if (req.session.userId) {
        res.send("用户Id=" + req.session.userId);
    } else {
        /*
    	taxi.execute().then(function(value){
    		console.log(value);
    	},function(err){
			console.log(err);
    	}).then(function(value){
    		console.log(value);
    	});
    	*/
        res.redirect(addQueryParamsToUrl(appConfig.get("auth_authorize_uri"), {
            "redirect_uri": appConfig.get("client_redirect_uri"),
            "response_type": "code",
            "client_id": appConfig.get("client_id")
        }));
    }
})

//用户完成授权,重定向到客户端redirect_uri
//用户使用授权码，获取令牌,获取令牌后获取用户信息。
router.get('/sample/callback', function(req, res) {
    var code = req.body.code || req.query.code;
    var auth_token_uri = appConfig.get("auth_token_uri");
    var redirect_uri = appConfig.get("client_redirect_uri");
    var client_id = appConfig.get("client_id");
    var resource_userinfo_uri = appConfig.get("resource_userinfo_uri");
    //获取令牌(callback)

    /*
    service.accessTokenApply(auth_token_uri,code,redirect_uri,client_id,function(err,response,body){
    	service.getLoginUserInfo(body.access_token,resource_userinfo_uri,function(err,response,body){
    			req.session.cookie.maxAge = 10*1000;
    			req.session.cookie.expires =new Date(Date.now() + 10*1000);
    		    req.session.userId=body.userId;
    			res.redirect("/client/sample");
    	});
    });
    */
    service.accessTokenApply(auth_token_uri, code, redirect_uri, client_id).then(function(data) {
    	console.log(data.body);
    	console.log(data.httpResponse);
    	console.log(data.err);
        service.getLoginUserInfo(data.body.access_token, resource_userinfo_uri).then(function(data) {
            req.session.cookie.maxAge = 10 * 1000;
            req.session.cookie.expires = new Date(Date.now() + 10 * 1000);
            req.session.userId = data.body.userId;
            res.redirect("/client/sample");
        }).catch(function(err) {
            console.error(err);
        })
    }).catch(function(err) {
        console.error(err);
    });
    /*
   	serveice.accessTokenApplyAsync(auth_token_uri,code,redirect_uri,client_id).then(function(data){
   		console.log("data="+data);
   		serveice.getLoginUserInfoAsync(data.access_token,resource_userinfo_uri).then(function(data){
   			    req.session.cookie.maxAge = 10*1000;
    			req.session.cookie.expires =new Date(Date.now() + 10*1000);
    		    req.session.userId=data.userId;
    			res.redirect("/client/sample");
   		}).catch(function(err){
   			console.error(err.stack);
   		})
   	}).catch(function(err){
   		console.error(err);
   	});
   	*/

})
module.exports = router;