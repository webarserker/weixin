'use strick'

var config = require('./config')
var Wechat = require('./wechat/wechat')

var wechatApi = new Wechat(config.wechat)

exports.reply = function* (next){
	var message = this.weixin
	
	console.log('晚上来陪我')
	console.log(message)
	console.log('晚上来陪我')
	
	
	
	if(message.MsgType === 'event'){
		if(message.Event === 'subscribe'){
			if(message.EventKey){
				console.log('扫码进来' + message.EventKey + ' ' + message.ticket)
			}
			
			this.body = '哈哈,你订阅了这个号\r\n' + '消息ID:' + message.ToUserName
		}
	else if(message.Event === 'unsubscribe'){
		console.log('无情取关')
		this.body = '我还是回你一点消息吧!'
		
		  }else if(message.Event === 'LOCATION'){
			this.body = '您已经被定位' + message.Latitude + '/' + message.Longitude + '-' + message.Precision
			
		  }else if( message.Event === 'CLICK'){
		  	this.body = '您点击了的菜单' + message.EventKey 
		  }else if(message.Event === 'SCAN'){
		  	console.log('关注后扫二维码' + message.EventKey + '' + message.Ticket)
		  	this.body = '老子开了天眼，看到你扫码了'
		  }else if(message.Event === 'VIEW'){
		  	this.body = '您点击了菜单中的连接辣：' + message.EventKey
		  }

	}else if(message.MsgType === 'text') {
		var content = message.Content
		var reply = '额，你说的' + message.Content + '太复杂辣'
 		
 		if(content === '1'){
 			reply = '你老婆很不错'
 		}else if(content === '2'){
 			reply = '你女儿也不错'
 		}else if(content === '3'){
 			reply = '你姐也不赖'
 		}else if(content === '你老婆也不错'){
 			reply = '你老婆也很棒'	
 		}else if(content === '4'){
 			reply = [
 			{
 				title: "我好！",
 				description: '只是个描述而已', 
 				picUrl:'http://res.cloudinary.com/moveha/image/upload/v1441184110/assets/images/Mask-min.png',
 				url: "https://github.com/" 			
 			},
 			{
 				title: "Node.js 开发微信",
 				description: '还是可以的',
 				picUrl:'http://res.cloudinary.com/moveha/image/upload/v1431337192/index-img2_fvzeow.png',
 				url: "https://nodejs.org/"
 			}
 			
 			]
 		}else if(content === '5'){
 			var data = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg')
 			console.log('大坑')
 			//console.log(data)
			console.log('大坑')

 			reply = {
						type:'image',
						mediaId:data.media_id
		 			}
 			 
 		}
 		
 		this.body = reply
 		
	}

  yield next
}

