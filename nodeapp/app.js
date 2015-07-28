/**
 * Module dependencies.
 */

var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    config = require('./config.js'),
    http = require('http'),
    mongodb = require('./models/db.js');

var app = module.exports = express(); //.createServer();

// Configuration

app.configure(function(){

	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');

	app.set('view options', {
		layout: false
	});


	app.use(express.cookieParser());
	app.use(express.session({ secret: config.sessionSecret }));

	var bodyParser = express.bodyParser();
	app.use(function(req, res, next) {
		var ctype = req.header('content-type');
		if (ctype == 'application/x-www-form-urlencoded'
			|| ctype == 'application/json'
			|| ctype == 'multipart/form-data') {
			bodyParser(req, res, next);
		}
		else {
			var data=[];
			req.setEncoding('utf8');
			req.on('data', function(chunk) { 
				data.push(chunk);
			});
			req.on('end', function() {
				req.rawBody = data.join('');
				next();
			});
		}
	});

	app.use(express.methodOverride());

	app.use(passport.initialize());
	app.use(passport.session());

    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', 'http://api.cosm.com');
        next();
    });

    app.use('/public', express.static(__dirname + '/public'));
	app.use(app.router);
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});


// Routes


var files = fs.readdirSync(__dirname + '/routes')
    .filter(function (f) {
        return f.indexOf('.') != 0
    });
for (var k = 0; k < files.length; ++k) {
    var router = require("./routes/" + files[k]);
    router(app);
}


var hPort = process.env.PORT || 8080;


if (process.env.NODE_ENV != 'test') {
    app.listen(hPort, function () {
        console.log("Express server in %s mode", app.settings.env);
    });
}

module.exports = app;

