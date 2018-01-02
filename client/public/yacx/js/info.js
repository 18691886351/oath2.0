i = 0;

function findOrderStatus()
{	if($("#status").html() == "支付成功,生成保单失败"  && i!=4)
	{	
	//alert("状态查询中.....");
		i=i+1;
		locking();
		var data={};
    	data.orderID = $("#oderId").html();
    	data.stat = $("#status").html();
    	//alert(data.orderID+"  "+data.status);
        action(data,"findOrderStatus.action",function(data) {
        	$("#status").html(data.status);
        });
	}else{
		Lock_CheckForm();
	}
}
function action(data, url, callback) {
    $.ajax({
        type:"post",
        url: url,
        data: data,
        error:  function(msg) {
        	
        	},
        beforeSend: function(data) {
        	
        },
        success: callback,
        
        complete:  function(data) {
        	
        },
        dataType: "json"
    });
}

function locking() {
	//document.all.ly.style.display = "block";
	$("#ly").css('display','block');
	$("#ly").width($(window).width());
	$("#ly").height($(window).height());
	//document.all.ly.style.width =  $("#body").width();
	//document.all.ly.style.height = $("#body").outerHeight(true);
	$("#Layer2").css('display','block');
	//document.all.Layer2.style.display = 'block';
}
function Lock_CheckForm() {
	$("#ly").css('display','none');
	//document.all.ly.style.display = 'none';
	//document.all.Layer2.style.display = 'none';
	$("#Layer2").css('display','none');
	return false;
}