var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//获章用户信息。
router.post('/userinfo',function(req,res){
	var access_token=req.body.access_token;
	console.log("access_token="+access_token);
	res.json({
		"userId":"123456",
		"userName":"三体"
	});
})

module.exports = router;
