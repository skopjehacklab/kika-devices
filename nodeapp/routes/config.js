var auth = require('../models/auth.js'),
    mongodb = require('../models/db.js');

module.exports = function(app) {
	app.get('/config', auth.user, function(req, res) {
		res.render('config', {user:req.user});
	});
	app.post('/config/update', auth.user, function(req, res) {
		var db = mongodb();
		req.user.macs = req.body.macs.split(/[\n\s\r\t]+/);
		db.users.save(req.user);
		res.redirect('/');
	});
};


//[1, 2, 3]::map(x => x + 1)::reduce((x, y) => x + y);
