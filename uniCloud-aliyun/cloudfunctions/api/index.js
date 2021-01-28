'use strict';
const response = require('response')
const coverModel = require('./models/cover')
const loginModel = require('./models/login')
const adModel = require('./models/ad')
const inviteModel = require('./models/invite')
const wechatModel = require('./models/wechat')

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	var resp = {}
	//简单路由判断
	switch (event.path) {
		//授权登录
		case '/login':
			var loginModelData = await loginModel(event.queryStringParameters.code)
			resp.user = loginModelData
			return response.success(resp)
			break;
		//首页
		case '/cover':
			resp.couponList = await coverModel.coupons()
			resp.coverList = await coverModel.list()
			resp.tips = await coverModel.tips()
			return response.success(resp)
			break;
		//封面详情
		case '/cover/detail':
			var coverModelList = await coverModel.detail(event.queryStringParameters)
			resp = coverModelList
			return response.success(resp)
			break;
		//看视频上报
		case '/look/video':
			var adAdd = await adModel.add(event.queryStringParameters)
			resp = adAdd
			return response.success(resp)
			break;
		//邀请关系
		case '/invite/track':
			var inviteAdd = await inviteModel.add(event.body)
			resp = inviteAdd
			return response.success(resp)
			break;
		case '/wechat/search':
			var recordSearch = await wechatModel.recordSearch(event.queryStringParameters)
			resp = recordSearch
			return response.success(resp)
			break;
		case '/wechat/provide':
			var recordProvide = await wechatModel.recordProvide(event.queryStringParameters)
			resp = recordProvide
			return response.success(resp)
			break;
		case '/wechat/getcode':
			var recordSendCover = await wechatModel.recordSendCover(event.queryStringParameters)
			resp = recordSendCover
			return response.success(resp)
			break;
		default:

	}
	//返回数据给客户端
	return response.success()
};
