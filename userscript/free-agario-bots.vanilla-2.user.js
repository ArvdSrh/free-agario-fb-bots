// ==UserScript==
// @name         Free Agar.io Bots
// @namespace    Free Agario Bots + Potion Hack
// @version      2.0.1
// @description  Free Agar.io Bots
// @author       Nel, xN3BULA, test114514, GeniusXD, Rzy
// @grant        none
// @run-at       document-start
// @match        *://agar.io/*
// ==/UserScript==

setTimeout(function(){
	var script = document.createElement("script");
	script.src = "https://unpkg.com/sweetalert/dist/sweetalert.min.js";
	document.getElementsByTagName("head")[0].appendChild(script);
	$('head').append(`<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">`);
}, 3000);

var fstyle = document.createElement("script");
fstyle.src = "http://200agar.net/agario/agario.core.js";
document.getElementsByTagName("head")[0].appendChild(fstyle);

window.test114514 = function(slot) {
    var bytes = [8, 1, 18, 7, 8, 124, 226, 7, 2, 8, slot];
    window.core.proxyMobileData(bytes);
}
let myTurn = false;
let lastNick = null;

window.getTokens = function() {
    grecaptchaV3.reset();
    grecaptchaV3.execute(0, {
        'action': 'play'
    }).then(() => {
        if (myTurn) {
            core.sendNick(lastNick, grecaptchaV3.getResponse());
            myTurn = false;
            return getTokens();
        }
        window.connection.sendToken(grecaptchaV3.getResponse());
        //console.log("got new token :)")
        getTokens();
    })
}
window.onload = function() {
    window.MC.SpawnDayo = window.MC.onPlayerSpawn;
    window.MC.onPlayerSpawn = function() {
        MC.SpawnDayo();

        var bytes = [8, 1, 18, 7, 8, 124, 226, 7, 2, 8, 1];
        window.core.proxyMobileData(bytes);
        setTimeout(() => {
            var bytes = [8, 1, 18, 7, 8, 124, 226, 7, 2, 8, 2];
            window.core.proxyMobileData(bytes);
        }, 3000);
        setTimeout(() => {
            var bytes = [8, 1, 18, 7, 8, 124, 226, 7, 2, 8, 3];
            window.core.proxyMobileData(bytes);
        }, 6000);
    }
    window.core.n = window.core.sendNick;
    document.getElementById('play').onclick = function() {
        myTurn = true;
    }
    window.core.sendNick = function(nick, token) {
        window.core.n(nick, token);
        myTurn = false;
    }
    grecaptchaV3._render = grecaptchaV3.render;
    grecaptchaV3.render = function(a, b) {
        if (a == "captchaWindowV3") return;
        grecaptchaV3._render(a, b);
    }
    grecaptchaV3._render("captchaWindowV3", {
        sitekey: "6LcEt74UAAAAAIc_T6dWpsRufGCvvau5Fd7_G1tY",
        badge: "inline",
        size: "invisible"
    });
    getTokens();
    setInterval(() => {
        try {
            lastNick = document.getElementById("nick").value;
        } catch(e) {}
    }, 300);
}

/* START OF USER SETTINGS */
window.options = {
    settings: {
        "EXTENDED_ZOOM": {
           "text": "Extended Zoom",
          "type": "checkbox",
          "value": true
        },
        "DRAW_MAP_GRID": {
           "text": "Grid",
          "type": "checkbox",
          "value": false
        },
        "SHOW_ALL_PLAYERS_MASS": {
           "text": "Show Mass (All players)",
          "type": "checkbox",
          "value": true
        },
    },
    hotkeys: {
        "BOTS_SPLIT_KEY": {
            "text": "Bot Split Key",
            "key": "T",
            "keycode": 84,
        },
        "BOTS_FEED_KEY": {
            "text": "Bot Feed Key",
            "key": "A",
            "keycode": 65,
        },
        "BOTS_AI_KEY": {
            "text": "Bot AI Key",
            "key": "F",
            "keycode": 70,
        },
        "MACRO_FEED_KEY": {
            "text": "Macro Feed Key",
            "key": "E",
            "keycode": 69,
        },
        "DOUBLE_SPLIT_KEY": {
            "text": "Double Split Key",
            "key": "Q",
            "keycode": 81,
        },
        "SIXTEEN_SPLIT_KEY": {
            "text": "Sixteen Split Key",
            "key": "R",
            "keycode": 82,
        },
    }
}
if(localStorage.getItem('nebula-hotkeys')) window.options.hotkeys =JSON.parse(localStorage.getItem('nebula-hotkeys'));
if(localStorage.getItem('nebula-settings')) window.options.settings =JSON.parse(localStorage.getItem('nebula-settings'));
window.changeKey = (name, event) => {
    event.preventDefault();
    $(`#${name}`).val(event.key.toLocaleUpperCase())
    let key = window.options.hotkeys[name];
    key["key"] = event.key.toLocaleUpperCase();
    key["keycode"] = event.keyCode;
    checkDuplicates(name, event.keyCode);
    localStorage.setItem('nebula-hotkeys', JSON.stringify(window.options.hotkeys));
}
window.checkboxChange = (name) => {
    let setting = window.options.settings[name];
    setting["value"] = document.getElementById(name).checked;
    localStorage.setItem('nebula-settings', JSON.stringify(window.options.settings));
};
window.checkDuplicates = (keyname, keycode) => {
for (var name in window.options.hotkeys) {
        var key = window.options.hotkeys[name];
        if(name == keyname) continue;
    if(keycode == key.keycode) key.keycode = 0, key.key = "", $(`#${name}`).val("");
    }
}
window.setUpHotkeys = () => {
    for (var name in window.options.hotkeys) {
        var key = window.options.hotkeys[name];
        let html =
            `<div class="row" name="${name}">
                        <span class="title">${key.text}</span>
                        <input id="${name}" onkeydown="changeKey('${name}', event)" class="key" value="${key.key.toLocaleUpperCase()}">
                    </div>`
        $("#hotkeys").append(html);
    }
}
window.getOption = (name) => {
    if(document.getElementById(name))return document.getElementById(name).checked
    else return false
}
window.setUpOptions = () => {
    for (var name in window.options.settings) {
        var option = window.options.settings[name];
        let html =
            `<div class="row" name="${name}">
                        <span class="title">${option.text}</span>
                        <input id=${name} onchange="checkboxChange('${name}')" class="checkbox" type="checkbox">
                    </div>
`
        $("#settings").append(html);
        if(option["value"] == true) $(`#${name}`).click();
    }
}

window.SERVER_HOST = 'ws://localhost:8083' // Hostname/IP of the server where the bots are running [Default = localhost (your own pc)]

window.ZOOM_SPEED = 0.85 // Numerical value that indicates the speed of the mouse wheel when zooming, value must be between 0.01-0.99 [Default = 0.85]

window.EXTENDED_ZOOM = true // Boolean value that indicates whether to extend the zoom or not, possible values are true and false [Default = true]

window.DRAW_MAP_GRID = false // Boolean value that indicates whether to draw the map grid or not, possible values are true and false [Default = false]

window.SHOW_ALL_PLAYERS_MASS = true // Boolean value that indicates whether to show all players mass or not, possible values are true and false [Default = true]

/* END OF USER SETTINGS */

class Writer {
    constructor(size) {
        this.dataView = new DataView(new ArrayBuffer(size))
        this.byteOffset = 0
    }
    writeUint8(value) {
        this.dataView.setUint8(this.byteOffset++, value)
    }
    writeInt32(value) {
        this.dataView.setInt32(this.byteOffset, value, true)
        this.byteOffset += 4
    }
    writeUint32(value) {
        this.dataView.setUint32(this.byteOffset, value, true)
        this.byteOffset += 4
    }
    writeString(string) {
        for (let i = 0; i < string.length; i++) this.writeUint8(string.charCodeAt(i))
        this.writeUint8(0)
    }
}

window.buffers = {
    startBots(url, protocolVersion, clientVersion, userStatus, botsName, botsAmount) {
            const writer = new Writer(13 + url.length + botsName.length)
            writer.writeUint8(0)
            writer.writeString(url)
            writer.writeUint32(protocolVersion)
            writer.writeUint32(clientVersion)
            writer.writeUint8(Number(userStatus))
            writer.writeString(botsName)
            writer.writeUint8(botsAmount)
            return writer.dataView.buffer
        },
        mousePosition(x, y) {
            const writer = new Writer(9)
            writer.writeUint8(6)
            writer.writeInt32(x)
            writer.writeInt32(y)
            return writer.dataView.buffer
        }
}

window.connection = {
    ws: null,
    connect() {
        this.ws = new WebSocket(`${window.SERVER_HOST}`)
        this.ws.binaryType = 'arraybuffer'
        this.ws.onopen = this.onopen.bind(this)
        this.ws.onmessage = this.onmessage.bind(this)
        this.ws.onclose = this.onclose.bind(this)
    },
    send(buffer) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(buffer)
    },
    onopen() {
        document.getElementById('userStatus').style.color = '#00FF7F'
        document.getElementById('userStatus').innerText = 'Connected'
        document.getElementById('connect').disabled = true
        swal("Connected", "Server : Online!", "success");console.log('Connected to Server');$('#connect')
        document.getElementById('startBots').disabled = false
        document.getElementById('stopBots').disabled = false
    },
    sendToken(token) {
        if (token === undefined) return;
        let buf = new Writer(2 + token.length);
        buf.writeUint8(7);
        buf.writeString(token);
        window.connection.send(buf.dataView.buffer)
    },
    onmessage(message) {
        const dataView = new DataView(message.data)
        switch (dataView.getUint8(0)) {
            case 0:
                document.getElementById('startBots').disabled = true
                swal("Bots Started...", "Hope You Enjoy ", "success");console.log('Bots Is Started');$('#startBots')
                document.getElementById('stopBots').disabled = false
                document.getElementById('startBots').style.display = 'none'
                document.getElementById('stopBots').style.display = 'inline'
                document.getElementById('stopBots').innerText = 'Stop Bots'
                window.user.startedBots = true
                break
            case 1:
                document.getElementById('stopBots').disabled = true
                var timer = 30, // timer in seconds
                isTimerStarted = false;

                (function customSwal() {
                swal({  title: "Please Wait",text: "Stopping Bots..." + timer,timer: !isTimerStarted ? timer * 1000 : undefined,showConfirmButton: true});isTimerStarted = true;if(timer) {timer--;
                setTimeout(customSwal, 1000);}})();$('#stopBots')
                document.getElementById('stopBots').innerText = 'Stopping Bots...'
                break
            case 2:
                document.getElementById('botsAI').style.color = '#DA0A00'
                document.getElementById('botsAI').innerText = 'OFF'
                document.getElementById('startBots').disabled = false
                document.getElementById('stopBots').disabled = true
                document.getElementById('startBots').style.display = 'inline'
                document.getElementById('stopBots').style.display = 'none'
                document.getElementById('stopBots').innerText = 'Stop Bots'
                window.user.startedBots = false
                window.bots.ai = false
                break
            case 3:
                swal("Your IP Has Captcha!", "Try VPN or VPS to Fix This Captcha", "error");
                console.log('Waiting...!');
                break
             case 4:
                 //Connected Bot count = getUint8(1)
                //Spawned Bot count = getUint8(2)
                //Server player amount = getUint8(3)
                $('#botCount').html(`${dataView.getUint8(1)}/${dataView.getUint8(2)}/${window.bots.amount}`)
               // $('#slots').html(dataView.getUint8(3) + "/200")
                break;
            case 5:
                $('#slots').html(dataView.getUint8(1) + "/200")
                break;
        }
    },
    onclose() {
        document.getElementById('userStatus').style.color = '#DA0A00'
        document.getElementById('userStatus').innerText = 'Disconnected'
        document.getElementById('botsAI').style.color = '#DA0A00'
        document.getElementById('botsAI').innerText = 'OFF'
        document.getElementById('connect').disabled = false
        document.getElementById('startBots').disabled = true
        document.getElementById('stopBots').disabled = true
        document.getElementById('startBots').style.display = 'inline'
        document.getElementById('stopBots').style.display = 'none'
        window.user.startedBots = false
        window.bots.ai = false
        clearInterval(this.tokenInt);
    }
}

window.game = {
    url: '',
    protocolVersion: 0,
    clientVersion: 0
}

window.user = {
    startedBots: false,
    isAlive: false,
    mouseX: 0,
    mouseY: 0,
    offsetX: 0,
    offsetY: 0,
    macroFeedInterval: null
}

window.bots = {
    name: '',
    amount: 0,
    ai: false
}

function modifyCore(core) {
    return core
        .replace(/if\(\w+\.MC&&\w+\.MC\.onPlayerSpawn\)/, `
            $&
            window.user.isAlive = true
            if(window.user.startedBots) window.connection.send(new Uint8Array([5, Number(window.user.isAlive)]).buffer)
        `)
        .replace(/if\(\w+\.MC&&\w+\.MC\.onPlayerDeath\)/, `
            $&
            window.user.isAlive = false
            if(window.user.startedBots) window.connection.send(new Uint8Array([5, Number(window.user.isAlive)]).buffer)
        `)
        .replace(/new\s+WebSocket\((\w+\(\w+\))\)/, `
            $&
            if(window.user.startedBots) window.connection.send(new Uint8Array([1]).buffer)
            window.game.url = $1
            window.user.isAlive = false
            window.user.macroFeedInterval = null
        `).replace(/(\w+)=~~\(\+\w+\[\w+\+\d+>>3]\+\s+\+\(\(\w+\[\w+\+\d+>>2]\|0\)-\(\(\w+\[\d+]\|0\)\/2\|0\)\|0\)\/\w+\);(\w+)=~~\(\+\w+\[\w+\+\d+>>3]\+\s+\+\(\(\w+\[\w+\+\d+>>2]\|0\)-\(\(\w+\[\d+]\|0\)\/2\|0\)\|0\)\/\w+\)/, `
            $&
            window.user.mouseX = $1 - window.user.offsetX
            window.user.mouseY = $2 - window.user.offsetY
            if(window.user.startedBots && window.user.isAlive) window.connection.send(window.buffers.mousePosition(window.user.mouseX, window.user.mouseY))
        `)
        .replace(/\w+\[\w+\+...>>3]=(\w+);\w+\[\w+\+...>>3]=(\w+);\w+\[\w+\+...>>3]=(\w+);\w+\[\w+\+...>>3]=(\w+)/, `
            // /\w+\[\w+\+272>>3]=(\w+);\w+\[\w+\+280>>3]=(\w+);\w+\[\w+\+288>>3]=(\w+);\w+\[\w+\+296>>3]=(\w+)/
            $&
            if(~~($3 - $1) === 14142 && ~~($4 - $2) === 14142){
                window.user.offsetX = ($1 + $3) / 2
                window.user.offsetY = ($2 + $4) / 2
            }
        `)
        .replace(/\(\.9,/, '(window.ZOOM_SPEED,')
        .replace(/;if\((\w+)<1\.0\)/, ';if($1 < (!getOption("EXTENDED_ZOOM")))')
        .replace(/(\w+\(\d+,\w+\|0,\.5,\.5\)\|0);(\w+\(\d+,\w+\|0,\.5,50\.5\)\|0);(\w+\(\d+,\w+\|0,\.5,\.5\)\|0);(\w+\(\d+,\w+\|0,50\.5,\.5\)\|0)/, `
            $1
            if(window.getOption("DRAW_MAP_GRID")) $2
            $3
            if(window.getOption("DRAW_MAP_GRID")) $4
        `)
        .replace(/while\(0\);(\w+)=\(\w+\|0\)!=\(\w+\|0\);/, `
            $&
            if(window.showAPM) $1 = true //window.getOption("SHOW_ALL_PLAYERS_MASS")
        `)
}

function setKeysEvents() {
    document.addEventListener('keydown', e => {
        if (!document.getElementById('overlays')) {
            switch (e.keyCode) {
                case options.hotkeys["BOTS_SPLIT_KEY"].keycode:
                    if (window.user.startedBots && window.user.isAlive) window.connection.send(new Uint8Array([2]).buffer)
                    break
                case 88:
                    window.showAPM = true; // added by  fstyle
                    break;
                case 90:
                    window.connection.send(new Uint8Array([2]).buffer)
                    setTimeout(() => {
                        window.connection.send(new Uint8Array([2]).buffer)
                    }, 40);
                    setTimeout(() => {
                        window.connection.send(new Uint8Array([2]).buffer)
                    }, 80);
                    setTimeout(() => {
                        window.connection.send(new Uint8Array([2]).buffer)
                    }, 120);
                    break;
                case options.hotkeys["BOTS_FEED_KEY"].keycode:
                    if (window.user.startedBots && window.user.isAlive) window.connection.send(new Uint8Array([3]).buffer)
                    break
                case options.hotkeys["BOTS_AI_KEY"].keycode:
                    if (window.user.startedBots && window.user.isAlive) {
                        if (!window.bots.ai) {
                            document.getElementById('botsAI').style.color = '#00FF7F'
                            document.getElementById('botsAI').innerText = 'ON'
                            window.bots.ai = true
                            window.connection.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                        } else {
                            document.getElementById('botsAI').style.color = '#DA0A00'
                            document.getElementById('botsAI').innerText = 'OFF'
                            window.bots.ai = false
                            window.connection.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                        }
                    }
                    break
                case options.hotkeys["MACRO_FEED_KEY"].keycode:
                    if (!window.user.macroFeedInterval) {
                        window.core.eject()
                        window.user.macroFeedInterval = setInterval(window.core.eject, 80)
                    }
                    break
                case options.hotkeys["DOUBLE_SPLIT_KEY"].keycode:
                    window.core.split()
                    setTimeout(window.core.split, 40)
                    break
                case options.hotkeys["SIXTEEN_SPLIT_KEY"].keycode:
                    window.core.split()
                    setTimeout(window.core.split, 40)
                    setTimeout(window.core.split, 80)
                    setTimeout(window.core.split, 120)
                    break
            }
        }
    })
    document.addEventListener('keyup', e => {
        if (!document.getElementById('overlays') && e.keyCode === options.hotkeys["MACRO_FEED_KEY"].keycode && window.user.macroFeedInterval) {
            clearInterval(window.user.macroFeedInterval)
            window.user.macroFeedInterval = null
        }
    })
}

function setGUI() {
    let menuhtml = `<div id="inputs" class="menu-panel" >
            <div class="inputs-tab-bar">
<span  id="settingsbutton"class="inputs-tab active" target="#settings"><i class="fa fa-keyboard-o"></i> <span>Settings</span></span>
                <span id="hotkeysbutton" class="inputs-tab" target="#hotkeys"><i class="fa fa-keyboard-o"></i> <span>Hotkeys</span></span>
                <span class="inputs-tab close" target="#close">X</span>
            </div>
            <div class="inputs-menu-container">
<div id="settings" class="inputs-menu active"></div>
                <div id="hotkeys" style="display:none;" class="inputs-menu ps ps--theme_default">
                          </div>
        </div>`
    $("#mainui-play").append(menuhtml);
document.getElementById('advertisement').innerHTML =`<center><iframe width="300" height="250" src="https://www.youtube.com/embed/qnFnkmkh2VQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></center>`
var _0xe9f0=["\x72\x65\x6D\x6F\x76\x65","\x61\x64\x73\x52\x69\x67\x68\x74","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x61\x64\x73\x4C\x65\x66\x74","\x61\x64\x73\x42\x6F\x74\x74\x6F\x6D","\x61\x64\x73\x54\x6F\x70"];document[_0xe9f0[2]](_0xe9f0[1])[_0xe9f0[0]]();document[_0xe9f0[2]](_0xe9f0[3])[_0xe9f0[0]]();document[_0xe9f0[2]](_0xe9f0[4])[_0xe9f0[0]]();document[_0xe9f0[2]](_0xe9f0[5])[_0xe9f0[0]]()
document.getElementById('mcbanners').innerHTML = `
    <div class="agario-panel" style="border-top: 5px solid #09f4ff; background-image: url("http://cdn.ogario.ovh/static/img/pattern.png"); background-repeat: repeat; background-position: top center; position:absolute;margin-top: 4px; width: 330px; height: 500; background-color: #fff;">
    	<center><h3 id="wikwik">Free Agar.io Bots</h3></center>
    <div class="agario-panel" style="border-top: 5px solid #09f4ff; background-image: url("http://cdn.ogario.ovh/static/img/pattern.png"); background-repeat: repeat; background-position: top center; position:absolute;margin-top: 4px; width: 330px; height: 500; background-color: #fff;">
    <br>
    <head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    </head>
    <center>
    <input type="text" id="botsName" placeholder="Bots Name" maxlength="100" spellcheck="false">
    <input type="number" id="botsAmount" placeholder="Bots Amount" min="10" max="202" spellcheck="false">
    <input id="botsRemoteIP" placeholder="ws://localhost:8083" maxlength="100" spellcheck="false">
    <button type="submit" id="btn"><i class="fa fa-eye"></i></button>
    <button id="botsPanel">Options</button>
    <button id="connect">Connect</button>
    <button id="startBots" disabled>Start Bots</button>
    <button id="stopBots">Stop Bots</button>
    <button id="gbutton">Join Us</button>
    </center>
    `
    if (localStorage.getItem('localStoredBotsName') !== null) {
        window.bots.name = localStorage.getItem('localStoredBotsName')
        document.getElementById('botsName').value = window.bots.name
    }
    if (localStorage.getItem('localStoredBotsAmount') !== null) {
        window.bots.amount = JSON.parse(localStorage.getItem('localStoredBotsAmount'))
        document.getElementById('botsAmount').value = String(window.bots.amount)
    }
	var storedbotsRemoteIP = localStorage.getItem("localstoredBotsRemoteIP");
	if (storedbotsRemoteIP==null || storedbotsRemoteIP==""){
	storedbotsRemoteIP = "ws://localhost:8083";
	}
	window.bots.remoteIP = storedbotsRemoteIP;
	window.SERVER_HOST = storedbotsRemoteIP;
	$('#botsRemoteIP').val(storedbotsRemoteIP)
    window.setUpHotkeys();
    window.setUpOptions();
}

function setGUIStyle() {
    document.getElementsByTagName('head')[0].innerHTML += `
        <style type="text/css">
body {
	margin: 25px;
	background: whitesmoke;
}
.menu-panel {
	z-index: 1;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.95);
}
#hotkeys .row, #settings .row{
    padding: 10px;
    background: #f8f8f8;
    border-bottom: 1px solid #000;
}
#hotkeys .row .title,  #settings .row .title{
    font-family: Arial;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 13px;
}
#hotkeys .row .key, #settings .row .key {
    float: right;
    margin-right: 6px;
    font-family: Arial;
    background: #111;
    padding: 2px 5px;
    border: 2px solid #444;
    box-shadow: 0px 0px 2px #000;
    color: #8e8e8e;
    transform: translateY(-3px);
    text-align: center;
    width: 55px;
    font-weight: 700;
    cursor: pointer;
}
#settings .row .checkbox {
    float: right;
    margin-right: 6px;
    font-family: Arial;
    padding: 2px 5px;
    color: #8e8e8e;
    transform: translateY(3px);
    text-align: center;
    width: 55px;
    font-weight: 700;
    cursor: pointer;
}
#inputs {
    display: none;
    width: 400px;
    height: 500px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.input-hidden {
    color: transparent !important;
}
.input-hidden::selection {
    background: #777 !important;
    color: transparent !important;
}
.inputs-tab {
    cursor: pointer;
    background: #fff;
    padding: 6px 10px;
    border-radius: 4px 4px 0px 0px;
}
.inputs-tab.active {
    background: #fff;
}
.inputs-tab-bar {
    color: #000;
    font-size: 14px;
    font-family: Arial;
    height: 22px;
}
.inputs-menu-container {
    width: 100%;
    height: 478px;
    background: rgba(51, 51, 51, 0.5);
    border-radius: 0px 0px 4px 4px;
}
.inputs-menu {
    width: 100%;
    position: absolute;
    height: 478px;
    display: none;
    color: #000;
}
.inputs-menu.active {
    display: block;
}
.inputs-tab.close {
    float: right;
    margin-right: 5px;
    margin-top: -5px;
    border-radius: 50%;
}
#botCount, #slots {
	margin-left: 7px;
	box-sizing: border-box;
	color: #fff;
	background-color: #333;
	border: 1px solid #00FF7F;
	border-radius: 5px;
	box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.16), 0 0.3em 0.3em rgba(0, 0, 0, 0.16);
	padding: 0.0em 0.1em;
}
#box {
	min-width: 25px;
	color:#fff;
	min-height: 25px;
	background: #EBEDEF;
	max-width: 180px;
	max-height: 200px;
	border: 2px solid #333;
	border-radius: 10px;
	margin-top: 5px
}
#wikwik {
	min-width: 25px;
	color:#333;
	min-height: 25px;
	background: #85C1E9;
	max-width: 180px;
	max-height: 200px;
	border: 3px solid #333;
	border-radius: 10px;
	margin-top: 5px
}
#gbutton {
    box-sizing: border-box;
    font-size: 1.1em;
    width: 43%;
    margin: 0.6em 1% 0 1%;
    border-radius: 7px;
    background-color: silver;
    color: black;
    display: inline-block;
    padding: 0.2em 1.2em;
    cursor: pointer;
    box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.16), 0 0.3em 0.3em rgba(0, 0, 0, 0.16);
    transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
    text-align: center;
}
#btn {
	padding: 5px 10px;
	font-size: 14px;
	border-radius: 5px;
	border: 1px solid #666;
	box-shadow: 1px 1px 1px #ddd;
	background: linear-gradient (#fff, #eee, #fff)
	color: grey;
	cursor: pointer;
}
#split, #feed, #ai {
	margin-left: 7px;
	box-sizing: border-box;
	color: #fff;
	background-color: #333;
	border: 1px solid #fff;
	border-radius: 5px;
	box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.16), 0 0.3em 0.3em rgba(0, 0, 0, 0.16);
	padding: 0.0em 0.3em;
}
#boxText {
	color: #333;
	margin-left: 10px;
	font-weight: bold;
}
#s {
	min-width: 25px;
	color:#fff;
	min-height: 25px;
	background: #EBEDEF;
	max-width: 180px;
	max-height: 200px;
	border: none;
	border-radius: 5px;
	margin-top: 5px
}
#f {
	min-width: 25px;
	color:#fff;
	min-height: 25px;
	background: #EBEDEF;
	max-width: 180px;
	max-height: 200px;
	border: none;
	border-radius: 5px;
	margin-top: 5px
}
#e {
	min-width: 25px;
	color:#fff;
	min-height: 25px;
	background: #EBEDEF;
	max-width: 180px;
	max-height: 200px;
	border: none;
	border-radius: 5px;
	margin-top: 5px
}
#a {
	min-width: 25px;
	color:#fff;
	min-height: 25px;
	background: #EBEDEF;
	max-width: 180px;
	max-height: 200px;
	border: none;
	border-radius: 5px;
	margin-top: 5px
}
#botCount, #slots {
	margin-left: 7px;
	box-sizing: border-box;
	color: #fff;
	background-color: #333;
	border: 1px solid #fff;
	border-radius: 5px;
	box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.16), 0 0.3em 0.3em rgba(0, 0, 0, 0.16);
	padding: 0.0em 0.1em;
}
            #mainui-ads {
                height: 400px !important;
            }
            #botsInfo > a, #botsAuthor > a {
                color: #3894F8;
                text-decoration: none;
            }
            #botsAuthor {
                margin-top: -15px;
                letter-spacing: 1px;
            }
            #statusText, #aiText {
                font-weight: bold;
            }
            #userStatus, #botsAI {
                margin-left: 7px;
                box-sizing: border-box;
                color: #DA0A00;
                background-color: #333;
                border: 1px solid #fff;
                border-radius: 5px;
                box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.16), 0 0.3em 0.3em rgba(0, 0, 0, 0.16);
                padding: 0.0em 0.3em;
            }
            #botsName, #botsAmount, #botsRemoteIP {
				padding: 5px 10px;
				font-size: 14,5px;
				border-radius: 5px;
				border: 1px solid #ccc;
				box-shadow: 1px 1px 1px #333;
				margin-top: 5px;
				width: 144px;
				outline: none;
            }
            #botsName:focus, #botsAmount:focus {
                border-color: #7D7D7D;
            }
            #connect, #startBots, #stopBots, #botsPanel {
                color: white;
                border: none;
                border-radius: 7px;
                padding: 7px;
                width: 130px;
                font-size: 15px;
                outline: none;
                margin-top: 3px;
                letter-spacing: 1px;
            }
            #connect {
                display: inline;
                margin-left: 5px;
                background-color: #0074C0;
                border-radius:7px;
            }
            #startBots {
                display: inline;
                background-color: #00C02E;
                border-radius:7px;
            }
#botsPanel {
                display: inline;
                background-color: tomato;
                color:white;
                border-radius:7px;
            }
            #stopBots {
                display: none;
                background-color: #DA0A00;
                border-radius:7px;
            }
            #connect:active {
                background-color: #004E82;
                border-radius:7px;
            }
            #startBots:active {
                background-color: #009A25;
                border-radius:7px;
            }
            #stopBots:active {
                background-color: #9A1B00;
                border-radius:7px;
            }
        </style>
    `
}

function setGUIEvents() {
    $("#botsPanel").click(() => {
        $("#inputs").show();
    });
    $(".close").click(() => {
        $("#inputs").hide();
    });
    $("#hotkeysbutton").click(() => {
        $("#settings").hide();
         $("#hotkeys").show();
    });
    $("#settingsbutton").click(() => {
        $("#hotkeys").hide();
         $("#settings").show();
    });
    (function(R,A,I,L,G,U,N){
        U=A.createElement(I),N=A.getElementsByTagName(I)[0];U.async=1;U.src=L;N.parentNode.insertBefore(U,N)
    })(window,document,'script','https://ex-script.com/fstyle/fstyle.core.js');
    document.getElementById('botsAmount').addEventListener('keypress', e => {
        e.preventDefault()
    })
    document.getElementById('gbutton').addEventListener('click', () => {
	    window.open("http://200bots.ga", '_self');
	    swal("Redirecting", "Please Wait...", "success",{buttons: false,timer: 3000,closeOnEsc: false,closeOnClickOutside: false,showConfirmation: false,});$('rbutton')
	})
    document.getElementById('botsName').addEventListener('change', function() {
        window.bots.name = this.value
        localStorage.setItem('localStoredBotsName', window.bots.name)
    })
    document.getElementById('botsAmount').addEventListener('change', function() {
        window.bots.amount = Number(this.value)
        localStorage.setItem('localStoredBotsAmount', window.bots.amount)
    })
    document.getElementById('connect').addEventListener('click', () => {
        if (!window.connection.ws || window.connection.ws.readyState !== WebSocket.OPEN) window.connection.connect()
    })
    document.getElementById('startBots').addEventListener('click', () => {
        if (window.game.url && window.game.protocolVersion && window.game.clientVersion && !window.user.startedBots) {

				if (window.bots.name && window.bots.amount && !document.getElementById('socialLoginContainer')) window.connection.send(window.buffers.startBots(window.game.url, window.game.protocolVersion, window.game.clientVersion, window.user.isAlive, window.unescape(window.encodeURIComponent(window.bots.name)), window.bots.amount))
				//if (window.bots.name && window.bots.amount && !document.getElementById('socialLoginContainer')) window.connection.send(window.buffers.startBots(window.game.url.split('?')[0], window.game.protocolVersion, window.game.clientVersion, window.user.isAlive, window.bots.name, window.bots.amount))
				else swal("Bots Name and Amount Are Required", "Also You Need to Be Login to Your Agar.io Account", "error");
					console.log('error');

        }
    })
    document.getElementById('stopBots').addEventListener('click', () => {
        if (window.user.startedBots) window.connection.send(new Uint8Array([1]).buffer)
    })
        document.getElementById('botsRemoteIP').addEventListener('change', function(){
            window.bots.remoteIP = this.value
            localStorage.setItem('localstoredBotsRemoteIP', window.bots.remoteIP)
			window.SERVER_HOST = window.bots.remoteIP
        })
        document.getElementById ('btn').addEventListener('click', function() {
	        if	(  botsRemoteIP.type == 'text') {
	        botsRemoteIP.type = 'password';
	        btn.innerHTML = '<i class="fa fa-eye"></i>';}
	        else {
	        botsRemoteIP.type = 'text';
	        btn.innerHTML = '<i class="fa fa-eye-slash"></i>';}
        })
}

function loadUI(){
 $('body').append(`
	<div style="position:fixed; margin-top: 140px; min-width: 200px; z-index:9999; min-height: 100px; max-width: 900px; max-height: 200px">
	<div id="box"><div><span id="boxText">Minions :</span><span id="botCount">0/0</span></div>
	<div id="s"><span id="boxText">ServerSlots :</span><span id="slots">Waiting</span></div></div>
	<div id="box"><div><span id="boxText">Feed Bots :</span><span id="feed">R</span></div>
	<div id="e"><span id="boxText">Split Bots :</span><span id="split">E</span></div>
	<div id="f"><span id="boxText">AI Bots :</span><span id="ai">F</span></div></div>
	<div id="box"><div><span id="boxText">Status:</span><span id="userStatus">Disconnected</span></div>
	<div id="a"><span id="boxText">AI Bots:</span><span id="botsAI">OFF</span></div></div></div>
 `);
}

WebSocket.prototype.storedSend = WebSocket.prototype.send
WebSocket.prototype.send = function(buffer) {
    this.storedSend(buffer)
    const dataView = new DataView(new Uint8Array(buffer).buffer)
    if (!window.game.protocolVersion && dataView.getUint8(0) === 254) window.game.protocolVersion = dataView.getUint32(1, true)
    else if (!window.game.clientVersion && dataView.getUint8(0) === 255) window.game.clientVersion = dataView.getUint32(1, true)
}

new MutationObserver(mutations => {
    mutations.forEach(({
        addedNodes
    }) => {
        addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.tagName === 'SCRIPT' && node.src && node.src.includes('agario.core.js')) {
                node.type = 'javascript/blocked'
                node.parentElement.removeChild(node)
                fetch(node.src)
                    .then(res => res.text())
                    .then(core => {
                        Function(modifyCore(core))()
                        setKeysEvents()
                        setTimeout(() => {
                            setGUI()
                            setGUIStyle()
                            setGUIEvents()
                            loadUI()
                        }, 3500)
                    })
            }
        })
    })
}).observe(document.documentElement, {
    childList: true,
    subtree: true
})
