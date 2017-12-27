'use strict'

var sha1 = require('sha1')
var getRawBody = require('raw-body')
var Wechat = require('../wechat/wechat')
var util = require('./util')


module.exports = function(opts, handler){
	
var wechat = new Wechat(opts)
	
return function *(next){
	var that = this
	console.log(this.query);

	var token = opts.token

	var signature = this.query.signature

	var noce = this.query.nonce
	var timestamp = this.query.timestamp
	var echostr = this.query.echostr
	var str = [token, timestamp, noce].sort().join('')
	var sha = sha1(str)

	
	if(this.method === 'GET') {
		if(sha === signature){
			this.body = echostr + ''
			console.log('验证成功')
		}else{
			this.body = 'GEtworng'
			console.log('验证失败')
		}
	 
  }else if(this.method === 'POST'){
  	 if(sha !== signature){
			this.body = 'POSTworng'
			console.log('验证失败')
			return false
	}
  	console.log('__')
  	console.log(this.body)
  	console.log('__')
  	
  	var data = yield getRawBody(this.req, {
  		length: this.length,
  		limit: '1mb',
  		encoding: this.charset		
  	})
  
  	//console.log(data.toString())
  	
  	var content = yield util.parseXMLAsync(data)
  	
  	console.log('_______________________')
  	console.log(content)
  	
  	console.log('_______________________')
  	
  	
  	var message = util.formateMessage(content.xml)
  	
  	console.log(message)
  	
  	this.weixin = message
  	
  	console.log('晚上来陪我')
	console.log(message)
	console.log('晚上来陪我')
  	
    this.body = message.MsgType
  	
  	yield handler.call(this, next)
  	
  	console.log(this.body)
  	
  	wechat.reply.call(this)
  	
  	/*if(message.MsgType === 'event'){
  		if(message.Event === 'subscribe'){
  			var now = new Date().getTime()
  			
  			that.status = 200
  			that.type = 'application/xml'
  			var reply = '<xml>'+
							 '<ToUserName><![CDATA[' + message.FromUserName + ']]></ToUserName>'+
							 '<FromUserName><![CDATA[' + message.ToUserName + ']]></FromUserName>'+
							 '<CreateTime>' + now + '</CreateTime>'+	 
							 '<MsgType><![CDATA[text]]></MsgType>'+
							 '<Content><![CDATA[Hi, Imooc 你老姐也不错!]]></Content>'+
  						'</xml>'
			console.log(reply)
  			that.body = reply			
  			return			
  		}
  	}*/
  	
  	
  }	
 }
}
 
