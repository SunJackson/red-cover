<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>

<script>
import { login, inviteTrack } from "./request"

export default {
	onLaunch: async function(e) {
		console.log(e)
		console.log('App Launch');
		var openid = uni.getStorageSync('openid');
		if (openid) {
			console.log('获取到本地openid')
			this.globalData.openid = openid;
			this.globalData.inviteOpenid = e.query.openid;
			this.inviteTrack(e.query.openid, openid, e.query.id, false);
		} else {
			// 登录
			console.log('登录')
			const [loginError, loginRes] = await uni.login();
			console.log(loginError, loginRes)
			// 发送 res.code 到后台换取 openId, sessionKey, unionId
			if (!loginError){
				const res = await login({code: loginRes.code})
				this.globalData.openid = res.result.data.user.openid;
				uni.setStorageSync('openid', res.result.data.user.openid);
				this.inviteTrack(e.query.openid, this.globalData.openid, e.query.id, false);
			}else{
				
			}
		}
		
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	globalData: {
		api: {
			login: 'https://3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd.bspapp.com/http/api/login',
			cover: 'https://3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd.bspapp.com/http/api/cover',
			coverDetail: 'https://3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd.bspapp.com/http/api/cover/detail',
			lookVideo: 'https://3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd.bspapp.com/http/api/look/video',
			inviteTrack: 'https://3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd.bspapp.com/http/api/invite/track',
		},
		openid: '',
		inviteOpenid:'',
		inviteStatus: null,
	},
	methods: {
		shareConfig(){
			var messages = [
				{
					title: '送你个性微信红包封面，发红包时可用',
					path: '/pages/index/index?openid=' + this.globalData.openid,
				},
			];
			return messages[Math.floor(Math.random()*messages.length)];
		},
		shareTimelineConfig(){
			var messages = [
				{
					title: '送你个性微信红包封面，发红包时可用',
					query: 'openid=' + this.globalData.openid,
					path: '/pages/index/index'
				},
			];
			return messages[Math.floor(Math.random()*messages.length)];
		},
		//邀请上报
		inviteTrack(inviteOpenid, openid, id, adinvite){
			console.log('邀请上报')
			console.log(inviteOpenid, openid)
			if(inviteOpenid && openid && inviteOpenid != openid){
				wx.request({
					url: this.globalData.api.inviteTrack,
					method: "POST",
					data: {
						inviteOpenid,
						openid,
						id,
						adinvite,
					},
					success: (res) => {
						console.log(res)
						this.globalData.inviteStatus = res.data.data
					}
				});
			}
		},
	}
};
</script>

<style>
/*每个页面公共css */
</style>
