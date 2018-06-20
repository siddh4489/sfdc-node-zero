var express = require('express');
var ssoRouter = express.Router();
var PassportLib = require('../passport-lib');
var Passport = PassportLib.Passport;
var PassportStrategyConfigurer = PassportLib.StrategyConfigurer;
const PIManager = PassportLib.InstanceManager;

PIManager._getConfig = function _getConfig(req, callback) {
    var configuration = JSON.parse(JSON.stringify(ssoconfig));
    delete configuration.config.linkCaption;
    var options = {
        realm: req.hostname,
        passport: configuration
    }
    req.passportOptions = options;
    return callback(null, req.hostname, options);
}

PIManager._createInstance = function _createInstance(options, callback) {
    options.passport.strategy = options.passport.strategy ? options.passport.strategy : 'saml'
    var StategyConfigurer = new PassportStrategyConfigurer(options.passport.strategy);
    var passportInstance = new Passport();
    StategyConfigurer.configureStrategy(passportInstance, options.passport.config, function (err, instance) {
        callback(err, instance);
    });
}

ssoRouter.use('/', PIManager.ssomiddleware());
ssoRouter.use(PIManager.attach());
ssoRouter.use(PIManager.middleware("initialize"));

ssoRouter.get('/login', PIManager.authmiddleware("authenticate", "login_get"));
ssoRouter.post('/login', PIManager.authmiddleware("authenticate", "login_post"), function (req, res) {
    console.log('>> RETURNING RESPONSE FROM POST <<');
    res.json({
        success: true,
        user: req.passport.ldapUser
    });
});

ssoRouter.post('/login/callback',
    PIManager.authmiddleware("authenticate", "loginCallback_post"),
    function (req, res, next) {
        console.info("response validation passed!!");
        next();
    },
    function (req, res) {
        if (req.isAuthenticated() && req.passport.successRedirect) {
            var config = {
                user: req.user,
                successRedirect: '/'
            }, where = {};
            where.active = true;
            where[ssoconfig.config.mappingConfig.userField] = req.user[ssoconfig.config.mappingConfig.ssoField];
            db.User.findOne({
                attributes: {
                    exclude: ['createdAt','updatedAt','RoleId','active','LanguageId']
                },
                where: where
            }).then((user)=>{
                if(user === null || user === undefined){
                    var htmlForm = ['<!DOCTYPE html>',
                        '<html>',
                        '<head>',
                        '<style>',
                        '.outer {display: table;position: absolute;height: 100%;width: 100%;}',
                        '.middle {display: table-cell;vertical-align: middle;}',
                        '.inner {text-align:center;margin-left: auto;margin-right: auto;}',
                        '</style>',
                        '</head>',
                        '<body>',
                        '<div class="outer">',
                        '<div class="middle">',
                        '<div class="inner">',
                        '<img class="logo-img" src="" style="padding:0px 25px;width: 300px;">',
                        '<h4>User : '+req.user[ssoconfig.config.mappingConfig.ssoField]+' is not set up with the system. Please contact administrator.</h4>',
                        '</div>',
                        '</div>',
                        '</div>',
                        '</body>',
                        '</html>'].join('\r\n')
                    res.send(htmlForm);
                }
                else res.redirect('/sso/login/'+user.username);
            });
        } 
        else {
            return res.json({
                status: 'fail',
                user: null
            });
        }
});

module.exports = ssoRouter;

