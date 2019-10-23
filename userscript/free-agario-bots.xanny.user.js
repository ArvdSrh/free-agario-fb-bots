// ==UserScript==
// @name        Xanny [PRODUCTION]
// @version      1.0.5
// @author       Nebula & Nel
// @match        *://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// ==/UserScript==
if (location.host === "agar.io" && location.pathname === "/") {
    window.stop();
    location.href = "https://agar.io/xanny" + location.hash;
    return;
}

window.stop();
document.documentElement.innerHTML = "";
GM_xmlhttpRequest({
    method: "GET",
    url: "http://xn3bula.xyz/xanny/",
    onload: function (e) {
        document.open();
        document.write(e.responseText);
        document.close();
    }
});
