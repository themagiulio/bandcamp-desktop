const { app, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');
const fs = require('fs');
const isOnline = require('is-online');
const path = require('path');
const showDialog = require('./lib/dialog');
const { downloadFolder } = require('./lib/download');
const appWin = require('./windows/app');
const offlineWin = require('./windows/offline');

const store = new Store();

if(!fs.existsSync(downloadFolder)) fs.mkdirSync(downloadFolder);

const shortcutsPath = path.join(downloadFolder, '.shortcuts.json');

if(!fs.existsSync(shortcutsPath)) {
  fs.copyFileSync(path.join(__dirname, 'static', 'default-shortcuts.json'), shortcutsPath);
}

fs.watchFile(shortcutsPath, () => {
  showDialog('Bandcamp Desktop', 'You need to restart the app in order to apply the changes.');
});

app.setName('Bandcamp Desktop');

app.on('ready', function(){
  (async () => {
  	if(await isOnline()) return appWin();
    return offlineWin();
  })();
});

ipcMain.on('setVolume', (e, volume) => {
  store.set('volume', volume);
})

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});