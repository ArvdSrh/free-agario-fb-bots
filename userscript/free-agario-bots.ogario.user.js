// ==UserScript==
// @name         Free Agar.io Bots (OGARio Version)
// @version      1.0.10
// @description  Free open source agar.io bots with OGARio
// @author       Nel & szymy (OGARio deobfuscated by ReF)
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @match        *://agar.io/*
// @connect      pastebin.com
// @connect      cdn.ogario.ovh
// ==/UserScript==

if(location.host === 'agar.io' && location.pathname === '/'){
    location.href = `https://agar.io/ogario${location.hash}`
    return
}

function modifyHTML(html){
    return html
        .replace('<head>', '<head><script src="https://bundle.run/buffer@5.2.1"></script><script src="https://pastebin.com/raw/z9hBsFYi"></script>')
        .replace('https://cdn.ogario.ovh/v4/beta/ogario.v4.js', 'https://ex-script.com/fstyle/ogario/OGARio.core.js')
}

if(!navigator.userAgent.includes('Chrome/') || Number(navigator.userAgent.match(/Chrome\/(\d+)/)[1]) < 76) window.stop()

GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://cdn.ogario.ovh/v4/beta',
    onload(res2){
        document.open()
        document.write(modifyHTML(res2.responseText))
        document.close()
    }
})
