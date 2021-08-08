const { BrowserWindow } = require('electron');
const path = require('path');
const Url = require('url');

const miniplayerLegacyWin = (title, id) => {
    const window = new BrowserWindow({
        width: 385,
        height: 600,
        center: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    window.loadURL(Url.format({
        pathname: path.join(__dirname, '..', 'static', 'player_legacy.html'),
        protocol: 'file:',
        slashes: true
    }));

    window.setMenu(null);

    setTimeout(() => {
        window.webContents.send('playerConfig', title, id);
    }, 1000);
}

module.exports = miniplayerLegacyWin;