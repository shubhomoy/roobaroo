module.exports.fetchSong = function(req, res) {
	SongSrv.donwload(req.query.name, function(result) {
		return res.json({
			msg: result
		});
	});
}