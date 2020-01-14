import Spotify from 'spotify-web-api-js';

import qs from 'query-string';
import './styles/main.scss';

import { NavBar, Card, ButtonLink, ModalListTrack } from './Layout';
import MyDataLocal from './MyDataLocal';

const localDB = new MyDataLocal();

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

const client_id = 'e0d81b145f7844b8b4fc10e579daf34a';
const client_secret = 'e57b801ce6ed45e885d697e4d4bd4cac';
let TitleName = 'Spotify';
let meUser;

async function main() {
  

  let params = qs.parse(window.location.search);
  let hasCode = !!params.code;
  if (hasCode || localDB.getToken()) {
    if (!localDB.getToken()) {
      let s = new Spotify();
      let response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `grant_type=authorization_code&code=${
          params.code
        }&redirect_uri=${encodeURIComponent(
          window.location.origin
        )}/&client_id=${client_id}&client_secret=${client_secret}`
      })
        .then(x => x.json())
        .then(x => {
          if(!x.error)
            localDB.setToken(x);
          else if (confirm('Credenciales no validas, reintentar?'))
            window.location.reload('/');
        })   
     
    }

    InitData();
    
  } else {

    NavBar('Spotify', links);

    const authBase = 'https://accounts.spotify.com/authorize?';
    const scope = [
      'user-library-read',
      'user-read-currently-playing',
      'user-top-read'
    ];

    const response_type = 'code';
    const redirect_uri = window.location.href;
    const query = qs.stringify(
      { scope, redirect_uri, client_id, response_type },
      { arrayFormat: 'comma' }
    );

    const url = `${authBase}${query}`;

    ButtonLink(url, 'Login');
  }
}

async function InitData() {
  var token = localDB.getToken();
  let s = new Spotify();
  s.setAccessToken(token.access_token);
  meUser = await s.getMe();
    
  s.getUserPlaylists() // note that we don't pass a user id
    .then(
      function(data) {
        if(data.items)
        {
          const divContainer = document.createElement('div');
          divContainer.className = 'container-fluid';
          const divRow = document.createElement('div');
          divRow.className = 'row';
          for (const item of data.items) {
              Card(item.name, item.id, item.description, item.images ? item.images[0].url : '', divRow);
              ModalListTrack('Las tracks', [], item.id);
          }

          divContainer.append(divRow);
          const root = document.getElementById('root');
          root.append(divContainer);
          
        }
        console.log('User playlists', data);
      },
      function(err) {
        console.error(err);
      }
    );
    NavBar(meUser.display_name, links, true);

    document.getElementById('logout').addEventListener('click', () => {
      localDB.setToken(null);
      window.location.reload('/');
    });
}

main();
