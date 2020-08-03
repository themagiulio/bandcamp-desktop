const cheerio = require('cheerio');
const electron = require('electron');
const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow, dialog, ipcMain, Menu, shell } = electron;
const path = require('path');
const request = require('request');
const url = require('url');
const isOnline = require('is-online');

let mainWindow;

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
  mainWindow = new BrowserWindow({
                                    width: 1200,
                                    height: 700,
                                    center: true,
                                    titleBarStyle: 'hidden',
                                    frame: process.platform == 'darwin' ? false : true,
                                  });

  mainWindow.loadURL(url.format({
    pathname: 'bandcamp.com',
    protocol: 'https:',
    slashes: true
  }));

  autoUpdater.checkForUpdatesAndNotify();

  function about(){
    const response = dialog.showMessageBox(mainWindow,
    {
      title: 'Bandcamp Desktop - About',
      message: 'Bandcamp Desktop is a crossplatform desktop application which allows you to use bandcamp.com in an easy and quick way.\n\nVersion: v' + app.getVersion() + '\nDeveloped by: Giulio De Matteis <giuliodematteis@icloud.com>\n\nBuilt using cheerio, electron framework, electron-builder, electron-updater, request and url packages with their dependecies.'
    });
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
            request({
                uri: mainWindow.webContents.getURL(),
                }, function(error, response, body) {

                var $ = cheerio.load(body);
                var meta = $('meta');
                var title = $('title').text();
                var id = meta[20]['attribs']['content'].replace('https://bandcamp.com/EmbeddedPlayer/v=2/album=', '').replace('/size=large/tracklist=false/artwork=small/', '');

                if(id != ''){
                  player = new BrowserWindow({
                                                width: 395,
                                                height: 600,
                                                center: true,
                                                titleBarStyle: 'hidden',
                                                frame: process.platform == 'darwin' ? false : true,
                                              });

                  const loadView = ({title,scriptUrl}) => {
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
              });
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
      label: 'Search',
      submenu:[
        {
          label: 'Filters',
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
        }
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
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          /*{ type: 'separator' },
          { role: 'window' }*/
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

  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault();
  });

}

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
