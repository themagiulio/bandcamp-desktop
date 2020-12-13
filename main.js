const cheerio = require('cheerio');
const electron = require('electron');
const electonStore = require('electron-store');
const downloadManager = require('electron-download-manager');
const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow, dialog, ipcMain, Menu, shell } = electron;
const fs = require('fs');
const isOnline = require('is-online');
const path = require('path');
const progressBar = require('electron-progressbar');
const request = require('request');
const unzip = require('unzipper');
const url = require('url');
const windowStateKeeper = require('electron-window-state');

let mainWindow;
const store = new electonStore();
const downloadFolder = app.getPath('downloads') + '/bandcamp-desktop/';

if(!fs.existsSync(downloadFolder)){
  fs.mkdirSync(downloadFolder);
}

downloadManager.register({
    downloadFolder: downloadFolder
});

app.setName('Bandcamp Desktop');
app.allowRendererProcessReuse = true;
app.on('ready', function(){
  (async () => {
  	if(await isOnline() == false){
      const options = {
        type: 'error',
        buttons: ['OK'],
        title: 'Connection Error',
        message: 'Bandcamp Desktop failed to connect to bandcamp.com',
        detail: 'Check your internet connection and try to restart the application.'
      };
      dialog.showMessageBox(null, options)
    }else{
      createWindow();
    }
  })();
});

function createWindow(){

  let mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 700
  });
  
  mainWindow = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height
  });

  mainWindowState.manage(mainWindow);
    
  mainWindow.loadURL(url.format({
    pathname: 'bandcamp.com',
    protocol: 'https:',
    slashes: true
  }));

  autoUpdater.checkForUpdatesAndNotify();

function openDialog(title, message){
  const response = dialog.showMessageBox(mainWindow,
  {
    title: title,
    message: message
  });
}
  function about(){
    openDialog('Bandcamp Desktop - About', 'Bandcamp Desktop is a crossplatform desktop application which allows you to use bandcamp.com in an easy and quick way.\n\nVersion: v' + app.getVersion() + '\nDeveloped by: Giulio De Matteis <giuliodematteis@icloud.com>\n\nBuilt using cheerio, electron framework, electron-builder, electron-download-manager, electron-progressbar, electron-store, electron-updater, electron-window-state, fs, is-online, request, unzipper and url packages with their dependecies.');
  }

  function tag(tag){
    mainWindow.loadURL(url.format({
      pathname: 'bandcamp.com/tag/'+tag,
      protocol: 'https:',
      slashes: true
    }));
  }

  const isMac = process.platform === 'darwin'

  var template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        {
          label: 'About Bandcamp Desktop',
          click(){
            about();
          }
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'Mini Player',
          accelerator: process.platform == 'darwin' ? 'Command+Space' : 'Ctrl+Space',
          click(){
            let webPageUrl = mainWindow.webContents.getURL();

            if(webPageUrl !== 'https://bandcamp.com/')
            request({
                uri: webPageUrl,
                }, function(error, response, body) {
                
                const $ = cheerio.load(body);
                if(store.get('bandCampDesktopPlayer') === undefined || store.get('bandCampDesktopPlayer') === true){
                  const scripts = $('script');
                  //const imgs = $('img');
                  const data = JSON.parse(scripts[3]['attribs']['data-tralbum']);

                  const trackInfo = data['trackinfo'];

                  player = new BrowserWindow({
                    width: 385,
                    height: 600,
                    center: true,
                    webPreferences: {
                      nodeIntegration: true
                    }
                  });
  
                  var title = $('title').text();
  
                  let tracks = {
                    title: title,
                    tracks: trackInfo
                  }
  
                  let album = {
                    title: data['current']['title'],
                    artist: data['artist']
                  }

                  player.loadURL(url.format({
                    pathname: path.join(__dirname, 'player.html'),
                    protocol: 'file:',
                    slashes: true
                  }));
                  player.setMenu(null);
                  player.setResizable(false);
  
                  setTimeout(() => {
                    player.webContents.send('playerConfig', tracks, album, store.get('volume'));
                  }, 1000) 

                }else{
                  var meta = $('meta');
                  var title = $('title').text();
                  var id = meta[20]['attribs']['content'].replace('https://bandcamp.com/EmbeddedPlayer/v=2/album=', '').replace('/size=large/tracklist=false/artwork=small/', '');
  
                  if(id != ''){
                    player = new BrowserWindow({
                                                  width: 385,
                                                  height: 600,
                                                  center: true
                                                });
  
                    const loadView = ({title}) => {
                      return (`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>${title}</title>
                            <meta charset="UTF-8">
                          </head>
                          <body>
                            <iframe style="border: 0; width: 350px; height: 600px;" src="https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=ffffff/tracklist=true/transparent=true/" seamless>
                            </iframe>
                          </body>
                        </html>
                      `)
                    }
  
                    var file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(loadView({
                      title: title,
                    }));
  
                    player.loadURL(file);
                    player.setMenu(null);
                    player.setResizable(false);
                  }
                }

              });
          },
        },
        {
          label: 'Search',
          submenu:[
            {
              label: 'Tags',
              submenu:[
                {
                  label: 'Acoustic',
                  click(){
                    tag('acoustic');
                  }
                },
                {
                  label: 'Alternative',
                  click(){
                    tag('alternative');
                  }
                },
                {
                  label: 'Alternative Rock',
                  click(){
                    tag('alternative-rock');
                  }
                },
                {
                  label: 'Ambient',
                  click(){
                    tag('ambient');
                  }
                },
                {
                  label: 'Electronic',
                  click(){
                    tag('electronic');
                  }
                },
                {
                  label: 'Experimental',
                  click(){
                    tag('experimental');
                  }
                },
                {
                  label: 'Folk',
                  click(){
                    tag('folk');
                  }
                },
                {
                  label: 'Hip-Hop',
                  click(){
                    tag('hip-hop');
                  }
                },
                {
                  label: 'House',
                  click(){
                    tag('house');
                  }
                },
                {
                  label: 'Indie',
                  click(){
                    tag('indie');
                  }
                },
                {
                  label: 'Indie Rock',
                  click(){
                    tag('indie-rock');
                  }
                },
                {
                  label: 'Jazz',
                  click(){
                    tag('jazz');
                  }
                },
                {
                  label: 'Metal',
                  click(){
                    tag('metal');
                  }
                },
                {
                  label: 'Noise',
                  click(){
                    tag('noise');
                  }
                },
                {
                  label: 'Pop',
                  click(){
                    tag('pop');
                  }
                },
                {
                  label: 'Punk',
                  click(){
                    tag('punk');
                  }
                },
                {
                  label: 'Rap',
                  click(){
                    tag('rap');
                  }
                },
                {
                  label: 'Rock',
                  click(){
                    tag('rock');
                  }
                },
                {
                  label: 'Ska Punk',
                  click(){
                    tag('ska-punk');
                  }
                },
                {
                  label: 'Techno',
                  click(){
                    tag('Techno');
                  }
                },
                { type: 'separator' },
                {
                  label: 'More...',
                  click(){
                    tag('');
                  }
                },
              ]
            },
            {
              label: 'Filters',
              accelerator: process.platform == 'darwin' ? 'Command+F' : 'Ctrl+F',
              click(){
                mainWindow.loadURL(require('url').format({
                  pathname: 'bandcamp.com',
                  hash: '#discover',
                  protocol: 'https:',
                  slashes: true
                }));
              }
            }
          ]
        },
        {
          label: 'Library',
          accelerator: process.platform == 'darwin' ? 'Command+L' : 'Ctrl+L',
          click(){
            shell.openPath(downloadFolder)
          }
        },
        {
          label: 'Bandcamp Desktop Player',
          type: 'checkbox',
          checked: store.get('bandCampDesktopPlayer') === undefined ? true : store.get('bandCampDesktopPlayer'),
          click(){
            if(store.get('bandCampDesktopPlayer') === undefined){
              store.set('bandCampDesktopPlayer', false)
            }else{
              store.set('bandCampDesktopPlayer', !store.get('bandCampDesktopPlayer'))
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Open in Browser Window',
          accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
          click: async () => {
            await shell.openExternal(mainWindow.webContents.getURL())
          }
        },
        isMac ? { role: 'close', accelerator: 'Command+Q', } : { role: 'quit', accelerator: 'Ctrl+Q', }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startspeaking' },
              { role: 'stopspeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
        ] : [
          { role: 'close' }
        ])
      ]
    },
    {
      role: 'help',
      submenu: [
        ...(!isMac ? [
          {
            label: 'About Bandcamp Desktop',
            click(){
              about();
            }
          },
          { type: 'separator' },
        ] : []),
        {
          label: 'GitHub Repository',
          click: async () => {
            await shell.openExternal('https://github.com/themagiulio/bandcamp-desktop')
          }
        }
      ]
    }
  ]


const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)


  mainWindow.webContents.on('new-window', (event, url) => {
      event.preventDefault()
      mainWindow.loadURL(url)
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    var domain = require('url').parse(url).hostname;
      if(!domain.includes('bandcamp.com') && !domain.includes('bcbits.com')){
        shell.openExternal(url);
        event.preventDefault();
      }else if(domain.includes('bcbits.com')){


        var downloadBar = new progressBar({
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
        .on('completed', function() {
          downloadBar.detail = 'The download is complete! You can find your music in File > Library';
          downloadBar.text = 'Download completed';
        })
        .on('aborted', function(value) {
          const response = dialog.showMessageBox(mainWindow,
            {
              type: 'error',
              title: 'Bandcamp Desktop - Download Manager',
              message: "There was an error and Bandcamp Desktop couldn't download your music."
            });
        })
        
        downloadManager.download({
          url: url
        }, function (error, info) {
            if (error) {
              downloadBar.close();
              return;
            }
            
            fs.readdir(downloadFolder, (err, files) => {
              
              files.forEach(file => {
                var filePath = path.join(downloadFolder, file)
                let folderPath;
                const stat = fs.lstatSync(filePath);

                if(stat.isFile()){
                  
                  if(file.includes('.zip')){
                    folderPath = path.join(downloadFolder, file.replace('.zip',''));
                    if(!fs.existsSync(folderPath)){
                      fs.mkdirSync(folderPath);
                    }
                  }
                  
                  fs.createReadStream(downloadFolder + file).pipe(unzip.Extract({ path: `${downloadFolder}/${file.replace('.zip','')}` }));
                  if(file.includes('.png') || file.includes('.zip')){
                    fs.unlinkSync(downloadFolder + file);
                  }

                }
              });
            });
              
            downloadBar.setCompleted();

        });
        event.preventDefault();
      }
  })

  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault();
  });

}

ipcMain.on('setVolume', (e, volume) => {
    store.set('volume', volume);
})

// Updater
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});