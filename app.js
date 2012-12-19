
/**
 * Module dependencies.
 */

var express = require('express')
	, http = require('http')
	, path = require('path')
	, Step = require('Step')
	, webshot = require('./webshot')


var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
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
});

app.get('/getgooglescreenshot', function(req, res){
	Step(
		function (){
			createWebshot(req.query.name, this);
		},

		function (err, filename){
			if(err){
				res.json({err: err});
				console.log(err);
			}else{
				res.json({err: null, screenshot: filename});
			}
		}
	);
});



function createWebshot(name, callback){
	var options = {
		screenSize: {
			width: 888
		, height: 506
		}
	, shotSize: {
			width: 'window'
		, height: 506
		}
	, script: function() {
			var links = document.getElementsByTagName('h2');
			for (var i=0; i<links.length; i++) {
				var link = links[i];
				link.innerHTML = 'This is an H2 heading';
			}
		}
	//, userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
	, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:18.0) Gecko/20100101 Firefox/18.0'
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
