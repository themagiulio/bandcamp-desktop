const { app, shell, dialog } = require('electron');
const Store = require('electron-store');
const path = require('path');
const Url = require('url');
const miniPlayer = require('../../lib/miniPlayer');
const showDialog = require('../../lib/dialog');
const { downloadFolder } = require('../../lib/download');

const store = new Store();

const isMac = process.platform === 'darwin';

const shortcutsPath = path.join(downloadFolder, '.shortcuts.json');

const shortcuts = require(shortcutsPath);

const tags = [
  'Acoustic',
  'Alternative',
  'Alternative Rock',
  'Ambient',
  'Electronic',
  'Experimental',
  'Folk',
  'Hip-Hop',
  'House',
  'Indie',
  'Indie Rock',
  'Jazz',
  'Metal',
  'Noise',
  'Pop',
  'Punk',
  'Rap',
  'Rock',
  'SKA Punk',
  'Techno'
];
let tagsMenu = [];

function showAbout() {
  showDialog('Bandcamp Desktop - About', 'Bandcamp Desktop is a crossplatform desktop application which allows you to use bandcamp.com in an easy and quick way.\n\nVersion: v' + app.getVersion() + '\nDeveloped by: Giulio De Matteis <giuliodematteis@icloud.com>\n\nBuilt using cheerio, electron framework, electron-builder, electron-download-manager, electron-progressbar, electron-store, electron-updater, electron-window-state, is-online, request, unzipper and url packages with their dependecies.');
}

function buildTemplate({
  window
}) {
  const searchTag = (tag) => {
    window.loadURL(Url.format({
      pathname: `bandcamp.com/tag/${tag}`,
      protocol: 'https:',
      slashes: true
    }));
  }

  tags.forEach(tag => {
    tagsMenu.push({
      label: tag,
      click() {
        searchTag(tag.toLocaleLowerCase().replace(' ', '-'));
      }
    })
  });

  return [
    ...(isMac ? [{
        label: app.name,
        submenu: [
          {
            label: 'About Bandcamp Desktop',
            click(){
              showAbout();
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
                  accelerator: shortcuts['Mini Player'],
                  click() {
                    miniPlayer(window.webContents.getURL())
                  }
              },
              {
                label: 'Search',
                submenu: [
                  {
                    label: 'Filters',
                    accelerator: shortcuts['Filters'],
                    click(){
                      window.loadURL(Url.format({
                        pathname: 'bandcamp.com',
                        hash: '#discover',
                        protocol: 'https:',
                        slashes: true
                      }));
                    }
                  },
                  {
                    label: 'Tags',
                    submenu: tagsMenu.concat([
                      {
                        type: 'separator'
                      },
                      {
                        label: 'More...',
                        click() {
                          searchTag('');
                        }
                      }
                    ])
                  }
                ]
              },
              {
                label: 'Library',
                accelerator: shortcuts['Library'],
                click(){
                  shell.openPath(downloadFolder)
                }
              },
              { type: 'separator' },
              {
                label: 'Preferences',
                submenu: [
                  {
                    label: 'Bandcamp Desktop Player',
                    accelerator: shortcuts['Bandcamp Desktop Player'],
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
                  {
                    label: 'Change Library Folder Location',
                    accelerator: shortcuts['Change Library Folder Location'],
                    click(){
                      dialog.showOpenDialog(window, {
                            properties: ['openDirectory']
                          }
                      )
                      .then(results => {
                        if(!results.canceled){
                          const newDownloadFolder = results.filePaths[0] + '/';
                          store.set('downloadFolder', newDownloadFolder);
                          downloadFolder = newDownloadFolder;
                        }
                      })
                    }
                  },
                  {
                    label: 'Change Keyboard Shortcuts',
                    click(){
                      shell.openPath(shortcutsPath);
                    }
                  }
                ]
              },
              { type: 'separator' },
              {
                label: 'Open in Browser Window',
                accelerator: shortcuts['Open in Browser Window'],
                click: async () => {
                  await shell.openExternal(window.webContents.getURL())
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
          {
            label: 'Back',
            accelerator: shortcuts['Back'],
            click() {
              window.webContents.goBack()
            }
          },
          {
            label: 'Forward',
            accelerator: shortcuts['Forward'],
            click() {
              window.webContents.goForward()
            }
          },
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
                showAbout();
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
  ];
}

module.exports = buildTemplate;