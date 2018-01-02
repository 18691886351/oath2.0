var express = require('express');
var router = express.Router();
var service=require('./service.js')
var parseUrl = require('url').parse;
var formatUrl = require('url').format;
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

function addQueryParamsToUrl (url, params) {
  var info = parseUrl(url, true);
  for (var i in params) {
    info.query[i] = params[i];
  }
  delete info.search;
  return formatUrl(info);
}


//客户端导向到授权服务端,服务端返回授权页面
router.get('/authorize',function(req, res){
	var response_type=req.query.response_type;
	var client_id=req.query.client_id;
	var redirect_uri=req.query.redirect_uri;
	var appInfo= service.getAppInfo(client_id);
	res.locals.loginUserId ="三体";
  	res.locals.appInfo = appInfo;
	res.render('authorize');
})

//用户完成授权,重定向到客户端redirect_uri
router.post('/authorize',function(req,res){
	var redirect_uri=req.body.redirect_uri||req.query.redirect_uri;
	var client_id=req.body.client_id||req.query.client_id;
	var response_type=req.body.response_type||req.query.response_type;
	console.log("redirect_uri="+redirect_uri+" client_id="+client_id+" response_type="+response_type);
	var authCode=service.createAuthCode(redirect_uri,client_id);
	res.redirect(addQueryParamsToUrl(redirect_uri,{"code":authCode}));
})


//获取令牌
router.post('/token',function(req,res){
	
	var grant_type=req.body.grant_type;
	var code=req.body.code;
	var redirect_uri=req.body.redirect_uri;
	var client_id=req.body.client_id;
	console.log("grant_type="+grant_type+" code="+code+" redirect_uri="+redirect_uri+" client_id="+client_id);
	var token=service.createAccessToken(code,redirect_uri,client_id);
	res.json(token);
})



module.exports = router;
