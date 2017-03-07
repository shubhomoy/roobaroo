var express = require('express');
var path = require('path')
var fs = require('fs');
var request = require('request');
var ytdl = require('youtube-dl');
var ffmpeg = require('fluent-ffmpeg');
var Utils = require('./utils');

var app = express();

app.use(express.static('output'))

app.get('/', function (request, response){
  response.sendFile(path.resolve(__dirname, 'index.html'))
});
app.get('/top-artists', function (request, response){
  response.sendFile(path.resolve(__dirname, 'index.html'))
});

app.get('/api/fetchsong', function(req, res) {
	var mp4 = './video.mp4';
	var outputFile = './output/music/' + req.query.name + '.mp3';
	var stream = fs.createWriteStream(mp4);
	request(Utils.youtubeSearchUrlBuilder(req.query.name), function(error, response, body) {
		response = JSON.parse(body);
		if(response.items.length > 0) {
			var item = response.items[0];
			console.log('Please wait...');
			var url = encodeURI('https://youtube.com/watch?v=' + item.id.videoId);
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
						res.send('finish');
					}).saveToFile(outputFile);
				});

			});
		}
	});	
});

app.listen(8080, function() {
	console.log('Listening to port ' + 8080);
});