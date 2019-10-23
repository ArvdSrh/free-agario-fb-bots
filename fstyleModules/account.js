var https = require('https');
var EventEmitter = require('events').EventEmitter;
var WebSocket    = require('ws');
var agar_client_id = '677505792353827';
function Account(name) {
    this.name           = name; //debug name
    this.token          = null; //token after requestFBToken()
    this.token_expire   = 0;    //timestamp after requestFBToken()
    this.token_provider = 1;    //provider ID after requester
    this.c_user         = null; //cookie from www.facebook.com
    this.datr           = null; //cookie from www.facebook.com
    this.xs             = null; //cookie from www.facebook.com
    this.agent          = null; //connection agent
    this.debug          = 1;
    this.server         = 'wss://web-live-v3-0.agario.miniclippt.com/ws'; //todo doc
    this.ws    = null;
}
Account.prototype.log = function(text) {
    if(this.name) {
        console.log('Account(' + this.name + '): ' + text);
    }else{
        console.log('Account: ' + text);
    }
};
Account.prototype.requestFBToken = function(cb) {
    var account = this;
    if(this.debug >= 1) {
    }
    var ret = {
        error: null,
        res: null,
        data: null
    };

    var c_user = this.c_user;
    var datr = this.datr;
    var xs = this.xs;
    if(c_user && c_user.indexOf('%')) c_user = decodeURIComponent(c_user);
    if(datr && datr.indexOf('%')) datr = decodeURIComponent(datr);
    if(xs && xs.indexOf('%')) xs = decodeURIComponent(xs);
    var cookies = 'c_user=' + encodeURIComponent(c_user) + ';' +
        'datr=' + encodeURIComponent(datr) + ';' +
        'xs=' + encodeURIComponent(xs) + ';';
    var options = {
        host: 'www.facebook.com',
        path: '/dialog/oauth?client_id=' + agar_client_id + '&redirect_uri=https://agar.io&scope=public_profile,%20email&response_type=token',
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
            'Cookie': cookies
        },
        agent: this.agent || null
    };
    var req = https.request(options, function(res) {
        var data = '';
        ret.res = res;
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function() {
            ret.data = data;
            if(res && res.headers && res.headers.location) {
                res.headers.location.replace(/access_token=([a-zA-Z0-9-_]*)&/, function(_, parsed_token) {
                    if(parsed_token) {
                        account.token = parsed_token;
                        account.token_provider = 1;
                    }
                });
                res.headers.location.replace(/expires_in=([0-9]*)/, function(_, expire) {
                    if(expire) {
                        account.token_expire = (+new Date) + expire*1000;
                    }
                });
            }
            cb(account.token, ret);
        });
    });
    req.on('error', function(e) {
        ret.error = e;
		
		console.log(e);
		
        if(cb) cb(null, ret);
    });

    req.end();
};
module.exports = Account;