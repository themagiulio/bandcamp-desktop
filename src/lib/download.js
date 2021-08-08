const { app, dialog, shell } = require('electron');
const downloadManager = require('electron-download-manager');
const ProgressBar = require('electron-progressbar');
const Store = require('electron-store');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
const path = require('path');
const Url = require('url');
const unzip = require('unzipper');

const store = new Store();

const downloadFolder = store.get('downloadFolder') === undefined ? app.getPath('downloads') + '/bandcamp-desktop/' : store.get('downloadFolder');

downloadManager.register({ downloadFolder: downloadFolder });

function download(url, preventDefault) {
    var domain = Url.parse(url).hostname;

    if (domain.includes('bcbits.com')) {
        preventDefault();

        var downloadBar = new ProgressBar({
            title: 'Bandcamp Desktop - Download Manager',
            text: 'Bandcamp Desktop is downloading and extracting your music...',
            closeOnComplete: false,
            browserWindow: {
                modal: true,
                closable: true,
                webPreferences: {
                    nodeIntegration: true
                }
            }
        });

        downloadBar
            .on('completed', () => {
                downloadBar.detail = 'The download is complete! You can find your music in File > Library';
                downloadBar.text = 'Download completed';
            })
            .on('aborted', () => {
                dialog.showMessageBox(mainWindow, {
                    type: 'error',
                    title: 'Bandcamp Desktop - Download Manager',
                    message: "There was an error and Bandcamp Desktop couldn't download your music."
                });
            });

        downloadManager.download({ url: url }, (err) => {
            if (err) {
                console.error(err);
                return downloadBar.close();
            }

            fs.readdir(downloadFolder, (err, files) => {
                if (err) return console.error(err);

                files.forEach(file => {
                    var filePath = path.join(downloadFolder, file);
                    let folderPath;
                    const stat = fs.lstatSync(filePath);

                    if (stat.isFile() && file.includes('.zip')) {
                        folderPath = path.join(downloadFolder, file.replace('.zip',''));

                        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

                        fs.createReadStream(path.join(downloadFolder, file)).pipe(unzip.Extract({ path: folderPath }));
                        if (file.includes('.png') || file.includes('.zip')) {
                            fs.unlinkSync(filePath);
                        }
                    }
                });
            });

            downloadBar.setCompleted();
        });

    } else {
        request({ uri: url }, (err, res, body) => {
            const $ = cheerio.load(body);
            const favicon = $('link')[0]['attribs']['href'];
            
            if (!favicon.includes('bcbits.com')) {
                shell.openExternal(url);
                preventDefault();
            }
        })
    }
}

module.exports = { download, downloadManager, downloadFolder };