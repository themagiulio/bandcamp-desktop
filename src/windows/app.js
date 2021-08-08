const { BrowserWindow, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const windowStateKeeper = require('electron-window-state');
const Url = require('url');
const { download } = require('../lib/download');
const buildTemplate = require('./templates/menu');

const appWin = () => {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1200,
        defaultHeight: 700
      });
      
    let mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height
    });

    mainWindowState.manage(mainWindow);
    
    mainWindow.loadURL(Url.format({
        pathname: 'bandcamp.com',
        protocol: 'https:',
        slashes: true
    }));

    Menu.setApplicationMenu(Menu.buildFromTemplate(buildTemplate({
        window: mainWindow
    })));

    autoUpdater.checkForUpdatesAndNotify();

    mainWindow.webContents.setWindowOpenHandler(details => {
        mainWindow.loadURL(details.url);
        return { action: 'deny' };
    });

    mainWindow.webContents.on('will-navigate', (event, url) => download(url, () => event.preventDefault()));

    mainWindow.on('page-title-updated', (event) => event.preventDefault());

    autoUpdater.on('update-available', () => {
        mainWindow.webContents.send('update_available');
    });
      
    autoUpdater.on('update-downloaded', () => {
        mainWindow.webContents.send('update_downloaded');
    });
}

module.exports = appWin;