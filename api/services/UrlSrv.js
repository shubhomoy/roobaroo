const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=";
module.exports = {
	youtubeSearchUrlBuilder: function(query) {
		return encodeURI(YOUTUBE_SEARCH_URL + query + '&key=' + sails.config.globals.API_KEYS.YOUTUBE_API_KEY)
	}
}