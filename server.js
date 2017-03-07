var express = require('express');
var path = require('path');
var Services = require('./services/index');

var app = express();

app.use(express.static('output'))

app.get('/', function (request, response){
  response.sendFile(path.resolve(__dirname, 'index.html'))
});
app.get('/top-artists', function (request, response){
  response.sendFile(path.resolve(__dirname, 'index.html'))
});

app.get('/api/fetchsong', function(req, res) {
	Services.download(req.query.name, function(result) {
		res.send(result);
	});
});

app.listen(8080, function() {
	console.log('Listening to port ' + 8080);
});