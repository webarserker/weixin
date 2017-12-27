'use strict'

var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var util = require('./util')
var fs = require('fs')
var prefix = "https://api.weixin.qq.com/cgi-bin/"
var api = {
	accessToken: prefix + 'token?grant_type=client_credential',
	upload: prefix + 'media/upload?access_token=ACCESS_TOKEN&type=TYPE'
}

function Wechat(opts){
	var that = this
	this.appID = opts.appID
	this.appSecret = opts.appSecret
	this.getAccessToken = opts.getAccessToken
	this.saveAccessToken = opts.saveAccessToken
	 
}

Wechat.prototype.fetchAccessToken = function(data){
	var that = this
	var title = 123
	
	if(this.access_token && this.expires_in){
		if(this.isValidAccessToken(this)) {
			return Promise.resolve(this)
		}
	}
 
 return new Promise(function(resolve, reject){
 var HHH = 132456
 	
 		that.getAccessToken().then(function(data){
					try{
						data = JSON.parse(data)
					}
					catch(e) {
						console.log('没有数据准备跟新')  
						return that.updateAccessToken()
				       
					}
					
					if(that.isValidAccessToken(data)){
						/*console.log('拥有数据准备跟新1')
						console.log(Promise.resolve(data))
						console.log('拥有数据准备跟新1')*/
						return resolve(data)
					}
					else{
						console.log('拥有数据准备跟新2')
						return that.updateAccessToken()
					} 		
			}).then(function(data){
				console.log(data);
				that.access_token = data.access_token
				that.expires_in = data.expires_in	
				that.saveAccessToken(data) 
				
				console.log('xxxxxxxxxx')
				console.log(data)
				console.log('xxxxxxxxxx')
				 
				HHH = data
		
			}) 
 		
 		setTimeout(function(){
			return resolve(HHH)
		}, 3000)
 		
 })
 
	 
 
}

Wechat.prototype.isValidAccessToken = function(data){
	if(!data || !data.access_token || !data.expires_in){
		return false
	}
	
	var access_token = data.access_token
	var expires_in = data.expires_in
	var now = (new Date().getTime()) + 28800000 //GTM 东8区

	
	if(now < expires_in){
		return true
	}
	else{
		return false
	}
}

Wechat.prototype.updateAccessToken = function(data){
	var appID = this.appID
	var appSecret = this.appSecret
	var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret

    return new Promise(function(resolve, reject){
    	request({url: url, json: true}).then(function(response){
		console.log(response.body.expires_in) 
		var data = response.body
		var now = (new Date().getTime())		
		var expires_in = now + (data.expires_in - 20) * 1000
		
		data.expires_in = expires_in
		
		resolve(data)
	})	
  })
}

Wechat.prototype.uploadMaterial = function(type, filepath){
	var that = this;
	var form = {
		media: fs.createReadStream(filepath)
	}

console.log(type + '-------' + filepath)
/*console.log("-----黄天------")
console.log(this.fetchAccessToken())
console.log("-----黄天------")*/

    return new Promise(function(resolve, reject){
    	//console.log(that.fetchAccessToken())
    	
    	that.fetchAccessToken()	 
    		.then(function(data){
    			console.log("-----黄天------")
    			console.log(data.access_token)
    			console.log("-----黄天------")
    			
    			var url = api.upload + '&access_token=' + data.access_token + '&type=' + type    			
    		
    		request({method:'POST', url: url, formData: form, json: true}).then(function(response){
    			
    			//console.log(response)
				var _data = response
							 
				if(_data){
					resolve(_data)
				}else{
					throw new Error('Upload material fails')
				}
    		}).catch(function(err){
    			reject(err)
    		})
	})	
  })
}



Wechat.prototype.reply = function(){
	var content = this.body
	//this.body
	var message = this.weixin
	
	console.log('我的下一个市政中心')
	console.log(content)
	console.log(message)
	console.log('我的下一个市政中心')
	
	var xml = util.tpl(content, message)
	console.log(xml)
	this.status = 200
	this.type = 'application/xml'
	this.body = xml
}

module.exports = Wechat