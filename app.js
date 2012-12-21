
/**
 * Module dependencies.
 */

var express = require('express')
	, http = require('http')
	, path = require('path')
	, webshot = require('./webshot')
	, fs = require('fs');


var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	//app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});


app.get('/', function(req, res){
	res.render('index', { name: req.query.name });
	logPerson(req.query.name, req.headers['user-agent'], 'main');
});

app.get('/youtube', function(req, res){
	res.render('youtube', { name: req.query.name });
	logPerson(req.query.name, req.headers['user-agent'], 'youtube');
});

app.get('/getgooglescreenshot', function(req, res){
	createWebshot(req.query.name, function (err, filename){
		if(err){
			res.json({err: err});
			console.log(err);
		}else{
			res.json({err: null, screenshot: filename});
		}
	});
});


function logPerson(name, useragent, page){
	var data = {
		time: (new Date()).getTime(),
		name: name,
		page: page,
		useragent: useragent
	};

	fs.appendFile('log.txt', JSON.stringify(data) + "\n", function (err) {
	});
}


function createWebshot(name, callback){
	var options = {
		screenSize: {
			width: 960,
			height: 2000
		},
		shotSize: {
			width: 'window',
			height: 2000
		},
		//userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
		userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:18.0) Gecko/20100101 Firefox/18.0'
	}

	var filename =  __dirname + '/public/googleshots/'+ cleanName(name) +'.png';
	var onlineFilename = '/googleshots/'+ cleanName(name) +'.png';

	webshot('https://www.google.be/search?q=' + escape(name), filename, options, function(err) {
		callback(err, onlineFilename);
	});
}

// kuist de naam op zodat het filename-waardig is
function cleanName(str)
{
	var s=str.toLowerCase().replace(/\s/g, '_');

	var rExps=[ /[\xC0-\xC2]/g, /[\xE0-\xE2]/g,
	/[\xC8-\xCA]/g, /[\xE8-\xEB]/g,
	/[\xCC-\xCE]/g, /[\xEC-\xEE]/g,
	/[\xD2-\xD4]/g, /[\xF2-\xF4]/g,
	/[\xD9-\xDB]/g, /[\xF9-\xFB]/g ];

	var repChar=['A','a','E','e','I','i','O','o','U','u'];

	for(var i=0; i<rExps.length; i++)
		s=s.replace(rExps[i],repChar[i]);

	return s;
}
