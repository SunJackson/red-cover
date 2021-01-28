const db = uniCloud.database();

var wechat = {
    recordSearch: async (req) => {
		let record = await db.collection('record').where({
				_id: req._id,
			}).get()
		return record.data
	},
	recordProvide: async (req) => {
		let res = await db.collection('record').doc(req._id).update({
		  status: 1,
		});
		return {'status': 1}
	},
	recordSendCover: async (req) => {
		let redcover = await db.collection('redcover').where({
				coverid: req.coverid,
				status: 0,
			}).get()
		console.log(redcover)
		if (redcover.affectedDocs != 0){
			let redcoverupdate = await db.collection('redcover').doc(redcover.data[0]._id).update({
			  status: 1,
			  sendDate: new Date().toLocaleString('zh', {hour12: false, timeZone: 'Asia/Shanghai'}),
			});
			let recordupdate = await db.collection('record').doc(req._id).update({
			  status: 1,
			  sendDate: new Date().toLocaleString('zh', {hour12: false, timeZone: 'Asia/Shanghai'}),
			});
			return {'redCoverValue': redcover.data[0].value}
		}else{
			return {'redCoverValue': ''}
		}
	},
}
module.exports = wechat;
