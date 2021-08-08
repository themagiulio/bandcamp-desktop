const { BrowserWindow } = require('electron');
const Store = require('electron-store');
const path = require('path');
const Url = require('url');

const store = new Store();

const miniPlayerWin = (trackInfo, album) => {
    const window = new BrowserWindow({
        width: 385,
        height: 600,
        center: true,
        resizable: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        },
    });

    window.loadURL(Url.format({
        pathname: path.join(__dirname, '..', 'static', 'player.html'),
        protocol: 'file:',
        slashes: true
    }));

    window.setMenu(null);

    setTimeout(() => {
        window.webContents.send('playerConfig', trackInfo, album, store.get('volume'));
    }, 1000);
}

module.exports = miniPlayerWin;