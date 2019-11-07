var Account = require("./account.js");
var extend = require("extend");
var fs = require("fs");
var AgarioClient = {};

AgarioClient.Account = Account;
function facebookManager() {
    this.activeAccounts = [];
    this.usedAccounts = [];
    this.accounts = [];
    this.check = {};
    this.doneChecking = false;
}
facebookManager.prototype.getCheckAccs = function(settings, callback) {
    defaultOptions = {
        owned: false,
        maxMass: false,
        minLevel: 0,
        maxLevel: 100
    };
    options = defaultOptions;
    if (typeof settings != "undefined") {
        options = extend(options, settings);
        console.log(options);
    }
    var manager = this;
    if (this.accounts.length < 1) {
        console.log("NO ACCOUNTS TO GENERATE TOKEN");
        return;
    }    var amountOfAccounts = this.accounts.length;
   
 var amountOfTriedAccounts = 0;
    var loopIndex = 0;
    this.accounts.map(function(cookie) {
        if (typeof cookie.owned != "undefined" && options.owned && !cookie.owned) return;
        if (typeof cookie.lvl != "undefined" && options.maxMass && cookie.lvl < 34) return;
        if (typeof cookie.lvl != "undefined" && cookie.lvl < options.minLevel) return;
        if (typeof cookie.lvl != "undefined" && cookie.lvl > options.maxLevel) return;
        var account = new Account();
        account.c_user = cookie.c_user;
        account.datr = cookie.datr;
        account.xs = cookie.xs;
        account.requestFBToken(function(token, info) {
            //if (token && !manager.check[cookie.c_user]) console.log("\n" + cookie.c_user)
            if (token && !manager.check[cookie.c_user]) {
                manager.check[cookie.c_user] = cookie;
                manager.activeAccounts.push({
                    cookie: cookie,
                    token: token
                });
            } else {
            };
            newAccountValidated();
        });
    });

    function newAccountValidated() {
        amountOfTriedAccounts++;
        //process.stdout.write('\x1B[2J\x1B[0f');
        process.stdout.write(`\r[FaceBookManager]`.green + ` Checking... ${Math.floor((amountOfTriedAccounts / amountOfAccounts) * 100)}% (Checked accounts: ${amountOfTriedAccounts} / ${amountOfAccounts})`.yellow);
        //console.log(`[FaceBookManager] Checking... ${Math.floor((amountOfTriedAccounts / amountOfAccounts) * 100)}%`);
        if (amountOfAccounts == amountOfTriedAccounts) {
            if (typeof callback == "function") {
                manager.doneChecking = true;
                callback();
                let me = [];
                for(let ip in manager.check) {
                    me.push(manager.check[ip]);
                }
                fs.writeFileSync("./checkedTokens.json", JSON.stringify(me), "utf-8")
            };
        };
    };
};
facebookManager.prototype.generateToken = function(singleAccount) {
    var manager = this;
    [singleAccount].map(function(cookie) {
        var account = new AgarioClient.Account();
        account.c_user = cookie.c_user;
        account.datr = cookie.datr;
        account.xs = cookie.xs;
        account.requestFBToken(function(token, info) {
            if (token) {
            } else {
            }
        });

    });
};
facebookManager.prototype.setAccounts = function(accounts) {
    this.accounts = accounts;
};

facebookManager.prototype.hasAvailableToken = function() {
    if (this.activeAccounts.length > 0) {
        return true;
    }
    return false;
};

facebookManager.prototype.getToken = function() {
    var account = this.activeAccounts.pop();
    this.usedAccounts.push(account);
	if(account == undefined) return null;
	if(account.token == undefined) return null;
    return account.token;
};

facebookManager.prototype.returnToken = function(token) {
	var isThere = false;
	var that = this;
	
	for (var i = 0; i < that.usedAccounts.length; i++) {
		
		if(that.usedAccounts[i] == undefined) return;
		
		if (that.usedAccounts[i].token == token) {
			
			isThere = true;
			that.activeAccounts.push(that.usedAccounts[i]);
			that.usedAccounts.splice(i, 1);
			return;
			
		};
		
	};

};

var manager = new facebookManager();

manager.setAccounts(JSON.parse(fs.readFileSync("./facebookTokens3.json", "utf-8")));

module.exports = manager;