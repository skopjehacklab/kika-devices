var mongodb = require('../models/db.js'),
    auth = require('../models/auth.js'),
    twitterAdmin = require('../models/twitter-admin.js'),
    config = require('../models/config.js');

module.exports = function (app) {
    app.get('/admin/twitter-test', auth.admin, function (req, res) {
        twitterAdmin.postMessage(true, function (a, b, c) {
            console.log([a, b, c]);
            res.end("Test message posted");
        });
    })
    app.get('/admin/dbindex', auth.admin, function (req, res) {
        var db = mongodb();
        db.counters.ensureIndex({time:1});
        db.users.ensureIndex({'twitter.id':1});
        db.users.ensureIndex({id:1});
        res.send("OK\n");
    });
    app.get('/admin/remove', auth.admin, function (req, res) {
        var db = mongodb();
        db.counters.remove({count:0});
        res.send("OK\n");
    });
    app.get('/admin/users', auth.admin, function (req, res) {
        var db = mongodb();
        db.users.find().toArray(function (err, users) {
            res.render('/admin/users', {users:users, lang:config.domain(req).lang});
        });
    });
};
