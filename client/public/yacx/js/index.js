/*
对这部分代码进行重构,选择将页面进行模块化，为其添加
方法、订阅事件等
*/
//全局变量

var spin = new Spinner({ radius: 10, length: 20 });
var mid = "";
var tid = "";
var merName = "";
var orderId = "";
var busiType = "YACX";
var getMerinfoUrl = "/ebps/yacx/merinfo.json";
var getBillInfoUrl = "/ebps/yacx/billinfo.json";
var getOrderUrl = "/ebps/pay/confirmPay.json";

//订阅发布模块
//listen用于订阅,trigger用于发布
var eventer = {
    clientlist: {},
    listen: function(key, fn) {
        if (!this.clientlist[key]) {
            this.clientlist[key] = [];
        }
        this.clientlist[key].push(fn);
    },
    trigger: function() {
        var key = Array.prototype.shift.call(arguments);
        var fns = this.clientlist[key];

        if (!fns || fns.length === 0) {
            return false;
        }
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }

    },
    remove: function(key, fn) {
        var fns = this.clientlist[key];
        if (!fns) {
            return false;
        }
        if (!fn) {
            fns && (fns.length = 0);
        } else {
            for (var i = fns.length; i >= 0; i--) {
                var _fn = fns[i];
                if (fn === _fn) {
                    fns.splice(i, 1);
                }
            }
        }
    }
};

//获取url地址中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
/*
模块名称:账单页面模块(billPage)
方法:loaded,show,hide,getmerinfo
订阅:
页面加载完成的事件(pageLoaded)
账单信息获取成功事件(billInfoLoaded)
*/
var billPage = (function() {
    //订阅billPageLoaded事件
    eventer.listen('pageLoaded', function() {
        billPage.loaded();
        billPage.show();
        billPage.getMerInfo();
    })
    //订阅billInfoLoaded事件
    eventer.listen('billInfoLoaded', function() {
        billPage.hide();
    })
    return {
        loaded: function() {
            $("#s_mid").html("");
            $("#s_tid").html("");
            $("#s_merName").html("");
            $("#s_orderId").val("");
            //取url的参数值
            mid = getUrlParam("mid");
            tid = getUrlParam("tid");
            console.log("mid=" + mid);
            console.log("tid=" + tid);
        },
        show: function() {
            $("#selectPage").removeClass("sr-only");
        },
        hide: function() {
            $("#selectPage").addClass("sr-only");
        },
        getBillInfo: function() {
            var data = {};
            data.mid = mid;
            data.tid = tid;
            orderId = $("#s_orderId").val().trim();
            data.billNo = orderId;
            data.busiType=busiType;
            $.ajax({
                type: "post",
                url: getBillInfoUrl,
                data: data,
                dataType: "json",
                error: function(msg) {
                    var erromsg = msg.responseText;
                    erromsg = erromsg.split(",")[1].split(":")[1].split(" ")[0].split("\"")[1] + "!!!";
                    $("#tips2").show();
                    $("#tips2").html(erromsg);
                    $("#s_orderId").val("");
                    $("#s_orderId").focus();
                },
                beforeSend: function(data) {
                    $("#s_findbtn").addClass("sr-only")
                    spin.spin(document.getElementById('spin'));
                },
                success: function(data) {
                    console.log();
                    eventer.trigger("billInfoLoaded", data);
                },
                complete: function(data) {
                    spin.stop("getBillInfo:data" + data);
                    $("#s_findbtn").removeClass("sr-only")
                }
            });
        },
        getMerInfo: function() {
            var data = {};
            data.mid = mid;
            data.tid = tid;
            $.ajax({
                type: "post",
                url: getMerinfoUrl,
                data: data,
                error: function(msg) {
                    var erromsg = msg.responseText;
                    console.log(erromsg);
                    erromsg = erromsg.split(",")[1].split(":")[1].split(" ")[0].split("\"")[1] + "!!!";
                    $("#tips2").show();
                    $("#tips2").html(erromsg);
                    $("#s_orderId").val("");
                    $("#s_orderId").focus();
                },
                beforeSend: function(data) {
                    $("#s_findbtn").addClass("sr-only")
                    spin.spin(document.getElementById('spin'));
                },
                success: function(data) {
                    $("#s_mid").html(data.mid);
                    $("#s_tid").html(data.tid);
                    merName = data.merName;
                    $("#s_merName").html(data.merName);
                    //$("#target5").hide();
                },
                complete: function(data) {
                    spin.stop();
                    $("#s_findbtn").removeClass("sr-only")
                },
                dataType: "json"
            });
        }
    }
})();

/*
模块名称:支付页面模块(payPage)
方法:loaded,show,hide,confirmPay
页面加载完成的事件(pageLoaded)
账单信息获取成功事件(billInfoLoaded)
*/
var payPage = (function() {
    //订阅billPageLoaded事件
    var originAmt, payAmt, discountAmt;
    eventer.listen('pageLoaded', function() {
        payPage.hide();
    })
    //订阅billInfoLoaded
    eventer.listen('billInfoLoaded', function(data) {
        payPage.loaded(data);
        payPage.show();
    })
    return {
        loaded: function(data) {
            $("#p_merName").html(merName);
            $("#p_tid").html(tid);
            $("#p_mid").html(mid);
            $("#p_orderId").html(orderId);
            $("#p_userName").html(data.userName);
            this.originAmt = (Number(data.tAmt) / 100).toFixed(2); //原始金额
            this.discountAmt = (Number(data.amtgive) / 100).toFixed(2); //折扣金额
            this.payAmt = (Number(data.aftAmt) / 100).toFixed(2); //实际支付金额
            if (payAmt <= discountAmt) {
                alert("优惠金额大于实际金额，优惠异常");
                clos();
                return;
            }
            $("#p_amount").html(this.originAmt);
            $("#p_disamt").html(this.discountAmt);
            $("#p_aftamt").html(this.payAmt);
            $("#p_billAuthCode").html(data.billAuthCode);
        },
        show: function() {
            $("#payPage").removeClass("sr-only");
        },
        hide: function() {
            $("#payPage").addClass("sr-only");
        },
        confirmPay: function() {
            var data = {};
            data.mid = mid;
            data.tid = tid;
            data.billNo = orderId;
            data.billInfo = merName;
            data.busiType = busiType;
            data.payAmt = this.payAmt;
            data.originAmt = this.originAmt;
            data.discountAmt = this.discountAmt;
            data.billAuthCode = $("#p_billAuthCode").html();
            $.ajax({
                type: "post",
                url: getOrderUrl,
                data: data,
                error: function(msg) {
                    var erromsg = msg.responseText;
                    erromsg = erromsg.split(",")[1].split(":")[1].split(" ")[0].split("\"")[1] + "!!!";
                },
                beforeSend: function(data) {
                    spin.spin(document.getElementById('spin'));
                },
                success: function(data) {
                    console.log(data.midOrderNo);
                    console.log(data.payUrl);
                    window.location.href = data.payUrl;
                },
                complete: function(data) {
                    spin.stop();
                },
                dataType: "json"
            });
        }
    }
})();

$(document).ready(function() {

    //发布billPageLoaded事件
    eventer.trigger('pageLoaded');
    
    $("#s_findbtn").click(function() {
        billPage.getBillInfo();
    })

    $("#p_paybtn").click(function() {
        payPage.confirmPay();
    })

});