const db = uniCloud.database();

var wechat = {
    recordSearch: async (req) => {
		let record = await db.collection('record').where({
				_id: req._id,
				status: 0,
			}).get()
		return record
	},
	recordProvide: async (req) => {
		let res = await db.collection('record').doc(req._id).update({
		  status: 1,
		});
		return {'status': 1}
	},
}
module.exports = wechat;
