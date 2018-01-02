module.exports={
	getAppInfo:function(client_id){
		return{
			name:'三体',
			description:'三体问题不可解'
		}
	},
	createAuthCode:function(redirect_uri,client_id){
		return '123456';
	},
	createAccessToken:function(code,redirect_uri,client_id){
		return {
			access_token:'12345678',
			token_type:'mac',
			expires_in:'600',
			refresh_token:'888888'
		}
	}
}