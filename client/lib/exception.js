var exception = {
    createApiError:function(code, msg) {
        var err = new Error(msg);
        err.error_code = code;
        err.error_message = msg;
        return err;
    },
    // 缺少参数错误
    missingParameterError:function(name) {
        return this.createApiError('MISSING_PARAMETER', '缺少参数`' + name + '`');
    },
    //回调地址不正确错误
    redirectUriNotMatchError:function(url) {
        return this.createApiError('REDIRECT_URI_NOT_MATCH', '回调地址不正确：' + url);
    },
    //参数错误
    invalidParameterError:function(name) {
        return this.createApiError('INVALID_PARAMETER', '参数`' + name + '`不正确');
    },
    //超出请求频率限制错误
    outOfRateLimitError:function() {
        return this.createApiError('OUT_OF_RATE_LIMIT', '超出请求频率限制');
    },
    //账单验证码
    verifyBillAuthCodeError:function(clacAuthcode,billAuthCode){
        console.log("clacAuthcode="+clacAuthcode+",billAuthCode="+billAuthCode);
        return this.createApiError("INVALID_BILLAUTHCODE","账单验证码校验失败");
    },
    errorHandle: function(err, req, res, next) {
        console.error((err && err.stack) || err.toString());
        res.status(500);
        res.json({
            status: 'Error',
            error_code: err.error_code || 'UNKNOWN',
            error_message: err.error_message || err.toString()
        });
        next();
    }
}
module.exports = exception;