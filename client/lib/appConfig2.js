var path = require('path');
//var fs = require('fs');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
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

/*
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
*/
/*
var appConfig=(function(){
	var data={};
	return {
		init:function(file){
			console.log(file);
			this.data = JSON.parse(fs.readFileSync(file));
			console.log("初始化应用配置:"+JSON.stringify(this.data));
		},
		get:function(key){
			return this.data[key];
		}
	}
})();
*/
//采用Promise方式重构
var appConfig = (function() {
    var data = {};
    return {
        init: function(file) {
            console.log(file);
            me=this;
            //this.data = JSON.parse(fs.readFileSync(file));
            //console.log("初始化应用配置:"+JSON.stringify(this.data));
            fs.readFileAsync(file).then(JSON.parse).then(function(json) {
                me.data=json;
                return JSON.stringify(json);
            }).then(function(jsonString){
            	console.log("初始化应用配置:"+jsonString);
            }).catch(function(err) {
                console.error(err);
            });
        },
        get: function(key) {
            return this.data[key];
        }
    }
})();

module.exports = {
    init: appConfig.init,
    get: appConfig.get
};