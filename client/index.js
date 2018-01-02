var express=require('express');
var path = require('path');
var exception=require('./lib/exception.js');
var app=express();

//读取配置文件
var appConfigFile=path.resolve(__dirname, 'appConfig.json');
//var appConfig=require("./lib/appConfig.js");
//appConfig.init(appConfigFile);
var appConfig=require("./lib/appConfig2.js");
appConfig.init(appConfigFile);


//静态文件处理
app.use("/client/public/",express.static(path.resolve(__dirname, 'public')));

//动态页面处理
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));


var client=require('./client');
app.use("/client",client);

//异常处理
app.use(exception.errorHandle);

app.listen(8001);