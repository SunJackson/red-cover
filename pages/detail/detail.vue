<template>
	<view class="wrapper">
		<u-popup v-model="show" mode="center" width="61%" height="38%" border-radius="25" closeable=true close-icon-color="red">
			<view class="popup">
				<text class="popup-more-text">
					敲黑板！
				</text>
				<text class="popup-more-text-desc">
					您已经帮助过朋友{{inviteNum}}次，如果想再次帮助，请完成【看视频助力】任务
				</text>
				<image class="popup-bg" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-fcrle97u1myh788c20/6dd525a0-5fa5-11eb-8d54-21c4ca4ce5d7.png"></image>
			</view>
		</u-popup>
	
		<view class="cover">
			<image :src="coverDetail.pic" mode="" class="cover-img"></image>
		</view>
		<ad :unit-id="ad.two" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white" v-if="ad.two"></ad>
		<view class="func" v-if="num > 0">
			<button plain class="func-btn" @tap="lookAd" data-type="1" v-if="lookInviteVideoLockNum > 0 && ad">
				<image src="/static/video.png" mode="" class="func-btn-img"></image>
				看视频助力（再看{{lookInviteVideoLockNum}}个）
			</button>
			<button plain class="func-btn" open-type="share" v-if="coverDetail.inviteLockNum > 0">
				<image src="/static/share.png" mode="" class="func-btn-img"></image>
				邀请好友领取（{{lockEdInfo.inviteLockNum}}/{{coverDetail.inviteLockNum}}）
			</button>
			<button plain class="func-btn" @tap="lookAd" data-type="2" v-if="coverDetail.lookVideoLockNum > 0">
				<image src="/static/video.png" mode="" class="func-btn-img"></image>
				观看视频领取（{{lockEdInfo.lookVideoLockNum}}/{{coverDetail.lookVideoLockNum}}）
			</button>
			<button plain class="func-btn success" @click="openModal" v-if="lockEdInfo.isLocked">
				领取封面
			</button>
		</view>
		<view class="func" v-if="num <= 0">
			<button plain class="func-btn error">
				该封面已被领完
			</button>
		</view>
		<view class="recommand"  v-if="modalShow">更多封面👇👇👇</view>
		<ad-custom :unit-id="ad.three" v-if="ad.three"></ad-custom>
		<ad :unit-id="ad.four" ad-type="video" ad-theme="white" v-if="ad.four"></ad>
		<view class="modal" @touchmove.stop="handle" @click="closeModal" v-if="modalShow">
			<view class="modal-content" @click.stop="openModal">
				<view class="modal-content-body">
					<view class="modal-content-body-title">
						领取方式
					</view>
					<text user-select decode class="modal-content-body-getdesc">{{coverDetail.getDesc}}</text>
					<text user-select decode class="modal-content-body-getdesc">\n{{id}}\n{{openid}}</text>
					<button plain class="modal-content-body-question" open-type="contact">有疑问？</button>
				</view>
				<image src="/static/close.png" mode="" class="modal-content-cancel" @click.stop="closeModal"></image>
			</view>
		</view>
	</view>
</template>

<script>
import { coverDetail, lookVideo } from '../../request';
var rewardedVideoAd = null
// 在页面中定义插屏广告
var interstitialAd = null
export default {
	data() {
		return {
			id: '',
			num: 0,
			modalShow: '',
			coverDetail: {
				inviteLockNum: 0,
				lookVideoLockNum: 0,
				getDesc: "",
			},
			lockEdInfo: {
				inviteLockNum: 0,
				lookVideoLockNum: 0,
				lookInviteVideoLockNum: 0,
				isLocked: false,
			},
			ad: '',
			lookType: '',
			lookInviteVideoLockNum: 0,
			inviteNum: 0,
			openid: '',
			show: false
		};
	},
	onLoad(e) {
		this.id = e.id
		this.num = parseInt(e.num)
		this.openid = getApp().globalData.openid
		this.getCoverDetail(true)
		wx.showShareMenu({
		  withShareTicket: true,
		  menus: ['shareAppMessage', 'shareTimeline']
		})
	},
	onShow(e) {
		this.getCoverDetail(false)
	},
	onShareAppMessage(res) {
		let shareConfig = {
			title: '送你个性微信红包封面，发红包时可用',
			path: `/pages/detail/detail?openid=${openid}&id=${id}`,
			imageUrl: this.coverDetail.pic
		}
		return shareConfig
	},
	onShareTimeline() {
		let shareConfig = {
			title: '送你个性微信红包封面，发红包时可用',
			query: `openid=${openid}&id=${id}`,
			imageUrl: this.coverDetail.pic
		}
		return shareConfig
	},
	methods: {
		handle(){
			return
		},
		async getCoverDetail(isFirst){
			const res = await coverDetail({
				id: this.id,
				openid: getApp().globalData.openid,
			})
			console.log(res.result)
			this.coverDetail = res.result.data.coverDetail
			this.lockEdInfo = res.result.data.lockEdInfo
			this.ad = res.result.data.ad
			console.log('inviteStatus', getApp().globalData.inviteStatus)
			if (getApp().globalData.inviteStatus && getApp().globalData.inviteStatus.status == 1){
				this.lookInviteVideoLockNum = getApp().globalData.inviteStatus.inviteNum * 2 - this.lockEdInfo.lookInviteVideoLockNum - 1;
				this.inviteNum = getApp().globalData.inviteStatus.inviteNum
				if (this.lookInviteVideoLockNum > 0 && isFirst && this.ad){
					this.show = true
				}
			}else{
				this.lookInviteVideoLockNum = 0;
			}
			console.log('this.coverDetail', this.coverDetail)
			if(isFirst && this.ad){
				//激励视频和插屏广告
				if(this.ad.one && !this.lookInviteVideoLockNum){
					this.adinsertInit(this.ad.one)
				}
				if(this.ad.five){
					this.adInit(this.ad.five);
				}
			}
			if(this.lockEdInfo.isLocked && isFirst){
				this.modalShow = true
			}
			uni.hideLoading()
		},
		lookAd: function(event) {
			console.log('观看广告', event)
			let lookType = event.currentTarget.dataset['type'];
			this.lookType = lookType;
			rewardedVideoAd.show().catch(() => {
				rewardedVideoAd
					.load()
					.then(() => rewardedVideoAd.show())
					.catch(err => {
						uni.showToast({
							title: '调起视频失败，请稍后再试',
							icon: 'none',
							duration: 2000
						});
						console.log('激励视频 广告显示失败');
					});
			});
		},
		//初始化视频广告
		adInit(adUnitId) {
			if (wx.createRewardedVideoAd) {
				rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: adUnitId });
				rewardedVideoAd.onLoad(() => {
					console.log('Ad onLoad event emit');
				});
				rewardedVideoAd.onError(err => {
					console.log('Ad onError event emit', err);
				});
				rewardedVideoAd.onClose(res => {
					console.log('Ad onClose event emit', res);
					console.log('观看广告类型', this.lookType)
					if (res && res.isEnded) {
						if (this.lookType === "1"){
							this.lookInviteVideoLockNum--
							console.log('还需观看广告数', this.lookInviteVideoLockNum)
							if (this.lookInviteVideoLockNum == 0){
								uni.showToast({
									title: '助力成功',
									icon: 'success',
									duration: 2000
								});
								getApp().inviteTrack(getApp().globalData.inviteOpenid, getApp().globalData.openid, this.id, true);
							}
						}else{
							this.lockEdInfo.lookVideoLockNum++
						}
						console.log('正常播放结束，可以下发游戏奖励');
					} else {
						console.log('播放中途退出，不下发游戏奖励');
					}
					this.trackLookVideo(res.isEnded)
				});
			}
		},
		//初始化插屏广告
		adinsertInit(adUnitId) {
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: adUnitId
				})
				interstitialAd.onLoad(() => {
					interstitialAd.show().catch((err) => {
						console.error(err)
					})
				})
				interstitialAd.onError((err) => {})
				interstitialAd.onClose(() => {})
			}
		},
		//看视频上报
		async trackLookVideo(isEnded){
			await lookVideo({
				openid: getApp().globalData.openid,
				id: this.id,
				isEnded: isEnded,
				lookType: this.lookType,
			})
		},
		openModal(){
			this.modalShow = true
		},
		closeModal(){
			this.modalShow = false
		},
	}
};
</script>

<style lang="scss">
.wrapper {
	.cover {
		background-image: url(https://res.wx.qq.com/a/wx_fed/money-envelope-cover/res/img/skin_bg.59803d00.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		padding: 40rpx 0;
		margin: 10rpx 60rpx;
		&-img {
			width: 300rpx;
			height: 500rpx;
			margin: auto;
			border-radius: 8px;
			display: block;
		}
	}
	.func {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		width: 600rpx;
		margin: auto;
		margin-bottom: 30rpx;
		&-btn {
			border: none;
			padding: 0 40rpx;
			height: 90rpx;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			background-color: #fbd926;
			border-radius: 90rpx;
			margin-top: 30rpx;
			font-size: 34rpx;
			font-weight: 700;
			&.success{
				background-color: #07c160;
				color: #FFFFFF;
			}
			&.error{
				background-color: #9a9a9a;
				color: #FFFFFF;
			}
			&-img {
				width: 34rpx;
				height: 34rpx;
				display: block;
				margin-right: 6rpx;
			}
		}
		&-or{
			width: 100%;
			text-align: center;
			margin-top: 30rpx;
			font-size: 26rpx;
		}
	}
	.recommand {
		margin-left: 20rpx;
	}
	.modal{
		width: 100%;
		height: 100%;
		background-color: rgba(000, 000, 000, 0.7);
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		&-content{
			&-body{
				width: 600rpx;
				padding: 60rpx 0;
				background-color: #FFFFFF;
				border-radius: 8px;
				&-title{
					font-size: 34rpx;
					color: #333333;
					font-weight: 700;
					text-align: center;
					margin-bottom: 30rpx;
				}
				&-getdesc{
					text-align: center;
					margin: auto;
					display: block;
				}
				&-question{
					margin: auto;
					display: block;
					border: none;
					font-size: 28rpx;
					color: #576b95;
					margin-top: 30rpx;
				}
			}
			&-cancel{
				width: 50rpx;
				height: 50rpx;
				margin: auto;
				display: block;
				margin-top: 60rpx;
			}
		}
		
	}
}
.popup-bg{
   background-color: #ffffff;
   position: absolute;
   top:0;
   left:0;
   width:100%;
   height:100%;
   z-index:-1;
   padding: 0;
   margin: 0;
}
.popup {
	border-radius: 40rpx; 
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}
.popup-more-text {
    width: 61%;
    height: 40px;
	
	font-size: 40rpx;
	font-weight: bold;
	text-align: center;

}
.popup-more-text-desc {
    width: 90%;
    height: 40px;
	font-size: 30rpx;
	font-weight: bold;
	text-align: center;

}
</style>
