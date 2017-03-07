var MusicSearcher = require('./MusicSearcher');
var ytdl = require('youtube-dl');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path')
var fs = require('fs');
var Config = require('../config');

module.exports = {
	download: function(name, callback) {
		if(fs.existsSync(Config.MUSIC_OUTPUT_PATH + '/' + name + '.mp3')) {
			console.log('exists');
			callback('done');
		}else{
			var mp4 = '../video.mp4';
			var outputFile = Config.MUSIC_OUTPUT_PATH + '/' + name + '.mp3';
			var stream = fs.createWriteStream(mp4);

			MusicSearcher(name, function(videoId) {
				var url = encodeURI('https://youtube.com/watch?v=' + videoId);
				ytdl.getInfo(url, function(err, info) {
					var minFormat = null;
					var minSize = Number.MAX_SAFE_INTEGER;
					info.formats.forEach(function(format) {
						if(format.filesize < minSize) {
							minFormat = format;
							minSize = minFormat.filesize;
						}
					});
					console.log('File size of ' + (minFormat.filesize/(1024*1024)).toFixed(2) + ' mb will be downloaded');
					var video = ytdl(url, ['--format=' + minFormat.format_id]);
					console.log('Downloading...');
					video.pipe(stream);
					stream.on('finish', function() {
						console.log('Download completed');
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
	}
}