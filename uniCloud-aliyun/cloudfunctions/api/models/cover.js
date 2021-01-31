const db = uniCloud.database();

var cover = {
    list: async () => {
		let list = await db.collection('cover').orderBy("sort", "desc").get();
		return list.data
	},
	coupons: async () => {
		let coupons = await db.collection('coupon').orderBy("sort", "desc").get();
		return coupons.data
	},
	tips: async () => {
		let tips = await db.collection('config').where({
			name: "tips"
		}).get();
		return tips.data[0].value
	},
	detail: async (req) => {
		let detail = await db.collection('cover').doc(req.id).get();
		let adLookVideo = await db.collection('ad').where({
				openid: req.openid,
				id: req.id,
				isEnded: true,
				lookType: "2"
			}).count()
		let adLookInviteVideo = await db.collection('ad').where({
				openid: req.openid,
				id: req.id,
				isEnded: true,
				lookType: "1"
			}).count()
		let invite = await db.collection('invite').where({
				inviteOpenid: req.openid,
				id: req.id,
			}).count()
			
		let record = await db.collection('record').where({
			openid: req.openid,
			id: db.command.neq(req.id)
		}).count();
		let recordSendNum = record.total
		let lookVideoLockNum = adLookVideo.total
		let lookInviteVideoLockNum = adLookInviteVideo.total
		let inviteLockNum = invite.total
		if (detail.data[0].lookVideoLockNum > 0){
			detail.data[0].lookVideoLockNum = detail.data[0].lookVideoLockNum + recordSendNum*3
		}
		
		if(detail.data[0].isFree || ((lookVideoLockNum > 0 && lookVideoLockNum >= detail.data[0].lookVideoLockNum) && (inviteLockNum > 0 && inviteLockNum >= detail.data[0].inviteLockNum))){
			var isLocked = true
			var recordQuery = await db.collection('record').where({
				_id: req.id + req.openid,
			}).count();
			let recordNum = recordQuery.total;
			if (recordNum == 0){
				var res = await db.collection('record').add({
					_id: req.id + req.openid,
					openid: req.openid,
					id: req.id,
					status: 0,
					dateStr: new Date().toLocaleString('zh', {hour12: false, timeZone: 'Asia/Shanghai'}),
					sendDate: ""
				})
				console.log('可以领取，插入成功')
				var updateCover = await db.collection('cover').doc(req.id).update({
					num: db.command.inc(-1),
					sendnum: db.command.inc(1),
				})
				console.log('可以领取，更新红包数量成功')
			}
			
		}else{
			var isLocked = false
		}
		//广告位配置
		let adConfig = await db.collection('config').where({
			name: "ad"
		}).get();
		let ad = adConfig.data[0].value.detail
		return {
			coverDetail: detail.data[0],
			lockEdInfo: {
				lookVideoLockNum,
				lookInviteVideoLockNum,
				inviteLockNum,
				isLocked,
			},
			ad,
		}
	},
}

module.exports = cover;
