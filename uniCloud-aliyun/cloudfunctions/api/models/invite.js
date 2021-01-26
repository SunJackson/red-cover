const db = uniCloud.database();

var invite = {
    add: async (req) => {
		req = JSON.parse(req)
		if (req.adinvite){
			// 看广告助力
			let res = db.collection('invite').add({
				inviteOpenid: req.inviteOpenid,
				openid: req.openid,
				id: req.id,
				dateStr: new Date().toLocaleString('zh', {hour12: false, timeZone: 'Asia/Shanghai'}),
			})
			console.log("广告助力")
			return res
		}else{
			var inviteQuery = await db.collection('invite').where({
				openid: req.openid,
			}).count();
			let inviteNum = inviteQuery.total;
			if(inviteNum == 0){
				// 单条插入数据
				let res = db.collection('invite').add({
					inviteOpenid: req.inviteOpenid,
					openid: req.openid,
					id: req.id,
					dateStr: new Date().toLocaleString('zh', {hour12: false, timeZone: 'Asia/Shanghai'}),
				})
				console.log("新用户助力")
				return res
			}else{
				return {'status': 1, 'info': '非新用户', 'inviteNum': inviteNum}
			}
			// 已助力
			
		}
	},
}

module.exports = invite;
