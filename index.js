const { app, BrowserWindow, session } = require('electron')

app.on("ready", () => {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': ["script-src 'self' https:"]
          }
        })
    })

    const window = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false
    });

    window.setMenu(null);
    window.loadFile('src/index.html');
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});