var request = require('request');

var service = function() {

}

service.prototype.getLoginUserInfo = function(token, url,callback) {
    var me = this;
    this._request(url, {
        access_token: token
    }, function(err, httpResponse, body) {
        if (err) {
            throw err;
        }
        if (httpResponse.statusCode == 200) {
            console.log("body=" + JSON.stringify(body));
            callback(body);
        }
    });
}
//从授权服务器申请授权
service.prototype.accessTokenApply = function(url, code, redirect_uri, client_id, callback) {
    this._request(url, {
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri,
        "client_id": client_id
    }, function(err, httpResponse, body) {
        if (err) {
            throw err;
        }
        if (httpResponse.statusCode == 200) {
            console.log("body=" + JSON.stringify(body));
            callback(body);
        }
    });
}
/*
service.prototype._request = function(method, url, params, callback) {
    method = method.toUpperCase();
    //根据不同的请求方法，生成用于request模块的参数
    var requestParams = {
        method: method,
        url: url
    };
    if (method === 'GET' || method === 'HEAD') {
        requestParams.qs = params;
    } else {
        requestParams.formData = params;
    }

    request(requestParams, function(err, res, body) {
        if (err) return callback(err);

        // 解析返回的数据
        try {
            var data = JSON.parse(body.toString());
        } catch (err) {
            return callback(err);
        }

        // 判断是否出错
        if (data.status !== 'OK') {
            return callback({
                code: data.error_code,
                message: data.error_message
            });
        }

        callback(null, data.result);
    });
};
*/
service.prototype._request = function(url, params, callback) {
    console.log("params=" + JSON.stringify(params));
    request({
        url: url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: params
    }, callback);
};


module.exports = service;