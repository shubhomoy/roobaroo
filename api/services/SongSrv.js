var ytdl = require('youtube-dl');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path')
var fs = require('fs');
var request = require('request');

module.exports = {
	donwload: function(name, callback) {
		if(fs.existsSync(sails.config.globals.MUSIC_OUTPUT_PATH + '/' + name + '.mp3')) {
			console.log('exists');
			callback('done');
		}else{
			var mp4 = './assets/video.mp4';
			var outputFile = sails.config.globals.MUSIC_OUTPUT_PATH + '/' + name + '.mp3';
			var stream = fs.createWriteStream(mp4);

			SongSrv.MusicSearcher(name, function(videoId) {
				var url = encodeURI('https://youtube.com/watch?v=' + videoId);
				ytdl.getInfo(url, function(err, info) {
					var minFormat = null;
					var minSize = Number.MAX_SAFE_INTEGER;
					info.formats.forEach(function(format) {
						console.log(format.format + '\t' + format.vcodec + '\t' + format.format_id + '\t' + format.acodec + '\t' + format.filesize);
						if(format.filesize < minSize && format.acodec != 'none') {
							minFormat = format;
							minSize = minFormat.filesize;
						}
					});
					console.log('downloading this');
					console.log(minFormat.format + '\t' + minFormat.vcodec + '\t' + minFormat.format_id + '\t' + minFormat.acodec + '\t' + minFormat.filesize);
					console.log('File size of ' + (minFormat.filesize/(1024*1024)).toFixed(2) + ' mb will be downloaded');
					var video = ytdl(url, ['--format=' + minFormat.format_id]);
					console.log('Downloading...');
					video.pipe(stream);
					stream.on('finish', function() {
						console.log('Download completed '+mp4);
						console.log('Converting...');
						proc = new ffmpeg({
							source: mp4
						}).toFormat('mp3').on('end', function() {
							console.log('Done!');
							fs.unlink(mp4);
							callback('done');
						}).saveToFile(outputFile);
					});

				});
			})
		}
	},

	MusicSearcher: function(name, callback) {
		console.log('Searching...');
		request(UrlSrv.youtubeSearchUrlBuilder(name), function(error, response, body) {
			response = JSON.parse(body);
			if(response.items.length > 0) {
				var item = response.items[0];
				callback(item.id.videoId);
			}
		});	
	}
}