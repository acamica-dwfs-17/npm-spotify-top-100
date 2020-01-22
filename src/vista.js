

import qs from 'query-string';
import './styles/main.scss';

import { NavBar, Card, ButtonLink, ModalListTrack } from './Layout';

import SpotifyClient from './SpotifyClient';
import MyDataLocal from './MyDataLocal';


const links = [
  {
    href: '/',
    text: 'Home'
  },
  {
    href: '/about',
    text: 'About'
  }
];

let TitleName = 'Spotify';
let meUser;

async function main() {
  let params = qs.parse(window.location.search);
  let hasCode = !!params.code;
  let spotifyClient = new SpotifyClient();
  if (hasCode || spotifyClient.localDB.getToken()) {
    if (!spotifyClient.localDB.getToken()) {
      await spotifyClient.getToken(params.code);
    }
    InitData(spotifyClient);
  } else {
    // Es la primera vez
    NavBar('Spotify', links);
    let url = await spotifyClient.getAuthorizeLink();
    ButtonLink(url, 'Login');
  }
}

async function InitData(spotifyClient) {
  spotifyClient.setAuth();
  meUser = await spotifyClient.api.getMe();
    
  spotifyClient.api.getMyTopArtists({limit:50, time_range:"medium_term"}) // note that we don't pass a user id
    .then(
      function(data) {
        if(data.items)
        {
          const divContainer = document.createElement('div');
          divContainer.className = 'container-fluid';
          divContainer.id = 'result-id';
          const divRow = document.createElement('div');
          divRow.className = 'row';
          for (const item of data.items) {
              Card(item.name, item.id, item.description, item.images ? item.images[0].url : '', item.external_urls.spotify, divRow);
              ModalListTrack('Las tracks', [], item.id);
          }

          divContainer.append(divRow);
          const root = document.getElementById('root');
          root.append(divContainer);
          
        }
      },
      function(err) {
        console.error(err);
      }
    );
    NavBar(meUser.display_name, links, true, meUser.images.url);

    document.getElementById('logout').addEventListener('click', () => {
      spotifyClient.localDB.setToken(null);
      window.location.href= '/';
    });

    document.getElementById('searchTerm').addEventListener('keydown', (e)=>{
      if(e.keyCode == 13)
        document.getElementById('search').click();
    });
    document.getElementById('search').addEventListener('click', () => {
      
      spotifyClient.setAuth();
      let searchTerm = document.getElementById('searchTerm').value;

      spotifyClient.api.search(searchTerm, ['playlist']).then(x=>x).then((data) => {
        const divContainer = document.getElementById('result-id');
        divContainer.innerHTML = '';
        const divRow = document.createElement('div');
        divRow.className = 'row';
        for (const item of data.playlists.items) {
            Card(item.name, item.id, item.description, item.images ? item.images[0].url : '', item.external_urls.spotify, divRow);
        }

        divContainer.append(divRow);
        const root = document.getElementById('root');
        root.append(divContainer);

      });
    });
}

main();
