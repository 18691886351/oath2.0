var path = require('path');
var fs = require('fs');

/*
var appConfig = (function(appConfigFile){
	if(data!=null){
		console.log("配置已经装载:"+JSON.stringify(data));
	}
	console.log(appConfigFile);
    //var appConfigFile = path.resolve(__dirname, 'appConfig.json');
    var data = JSON.parse(fs.readFileSync(appConfigFile));
    console.log("装载:"+JSON.stringify(data));

    var get=function(key){
    	return data[key];
    }

    return {
        get:get
    }

});
*/

var appConfig={
	data:{},
	init:function(file){
		console.log(file);
    	this.data = JSON.parse(fs.readFileSync(file));
    	console.log("初始化应用配置:"+JSON.stringify(this.data));
	},
	get:function(key){
		return this.data[key];
	}
}


module.exports = appConfig;