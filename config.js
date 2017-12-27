'use strict'

var path = require('path')
var util = require('./libs/util')
var wechat_file = path.join(__dirname, './config/wechat.txt')

var config = {
	wechat:{
		appID:'wxe60534c814d1c7b2',
		appSecret:'cb86ff557b6b64862873526b9f822e13',
		token:'wemoiveup',
		getAccessToken: function(){
			return util.readFileAsync(wechat_file)
		},
		saveAccessToken: function(data){
			data = JSON.stringify(data)
			
			console.log("大号")
			console.log(util.writeFileAsync(wechat_file, data))
			console.log("大号")
			return util.writeFileAsync(wechat_file, data)
		} 
		
	}
}	

module.exports = config

/*https://mybatice.localtunnel.me
wemoiveup*/