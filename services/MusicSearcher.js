var Utils = require('../utils');
var request = require('request');

var searcher = function(name, callback) {
	console.log('Searching...');
	request(Utils.youtubeSearchUrlBuilder(name), function(error, response, body) {
		response = JSON.parse(body);
		if(response.items.length > 0) {
			var item = response.items[0];
			callback(item.id.videoId);
		}
	});	
}

module.exports = searcher;