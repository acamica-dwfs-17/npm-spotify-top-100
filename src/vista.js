import Spotify from 'spotify-web-api-js';

import bootstrap from 'bootstrap';
import $ from 'jquery';
import qs from 'query-string';
import './styles/main.scss';

import { NavBar, Card, ButtonLink } from './Layout';

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
const client_secret = '';

async function main() {
  NavBar('titulo', links);

  let params = qs.parse(window.location.search);
  let hasCode = !!params.code;
  if (hasCode) {
      let s = new Spotify()
      let response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body:`grant_type=authorization_code&code=${params.code}&redirect_uri=${encodeURIComponent(window.location.origin)}&client_id=${client_id}&client_secret=${client_secret}`
    }).then(x=>x.json())
    console.log(response);
    
  } else {
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

main()