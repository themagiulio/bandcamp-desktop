const { BrowserWindow } = require('electron');
const path = require('path');

const offlineWin = () => {
    let window = new BrowserWindow({
        center: true
    });
    
    window.setMenu(null);
    
    window.loadFile(path.join(__dirname, '..', 'static', 'offline.html'));
};

module.exports = offlineWin;