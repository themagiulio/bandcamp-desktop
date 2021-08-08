const Store = require('electron-store');
const cheerio = require('cheerio');
const request = require('request');
const showDialog = require('./dialog');
const miniplayer = require('../windows/miniplayer');
const miniplayerLegacy = require('../windows/miniplayer_legacy');

const store = new Store();

function miniPlayer(url) {
    var subdomain = url.split('.')[1].replace().replace('https://','') ? url.split('.')[0].replace('https://','') : false;

    if (subdomain !== 'bandcamp' && subdomain !== 'daily') {
        request({ uri: url }, (err, res, body) => {
            const $ = cheerio.load(body);

            if (store.get('bandCampDesktopPlayer') === undefined || store.get('bandCampDesktopPlayer') === true) {
                const scripts = $('script');
                let data;
                let albumImg;

                for(var i=3; i<=5; i++) {
                    data = scripts[i]['attribs']['data-tralbum'];
                    if(data !== undefined) break;
                }

                if (data === undefined) return showDialog('Bandcamp Desktop - Error', 'Bandcamp Desktop cannot grab the requested data.\nTry to switch to the legacy Mini Player by uncecking Bandcamp Desktop Player in File>Preferences.');

                data = JSON.parse(data);

                if (!data.url.includes('album')) return showDialog('Bandcamp Desktop - Error', 'Mini Player can be opened only in album pages.');

                $('a').each((i, e) => {
                    if (e['attribs']['class'] === 'popupImage' && e['parent']['attribs']['id'] === 'tralbumArt') albumImg = e['attribs']['href'];
                });

                const trackInfo = data['trackinfo'];

                let album = {
                    title: data['current']['title'],
                    artist: data['artist'],
                    image: albumImg
                };

                miniplayer(trackInfo, album);
            } else {
                var meta = $('meta');
                var title = $('title').text();
                var id = meta[19]['attribs']['content'].replace('https://bandcamp.com/EmbeddedPlayer/v=2/album=', '').replace('/size=large/tracklist=false/artwork=small/', '');

                miniplayerLegacy(title, id);
            }
        });
    } else {
        showDialog('Bandcamp Desktop - Error', 'Mini Player can be opened only in album pages.');
    }
}

module.exports = miniPlayer;