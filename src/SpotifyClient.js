import Spotify from 'spotify-web-api-js';
import MyDataLocal from './MyDataLocal';
import qs from 'query-string';

export default class SpotifyClient {
  constructor() {
    this.client_id = 'e0d81b145f7844b8b4fc10e579daf34a';
    this.client_secret = 'e57b801ce6ed45e885d697e4d4bd4cac';
    this.localDB = new MyDataLocal();
    this.api = new Spotify();
  }

  async refreshToken() {
    let response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization: `Basic ${btoa(
          `${this.client_id}:${this.client_secret}`
        )}`
      },
      body: `grant_type=refresh_token&refresh_token=${this.localDB.getRefreshToken()}`
    })
      .then(x => x.json())
      .then(x => {
        if (!x.error) {
          let tokenInfo = this.localDB.getToken();
          let obj = { ...tokenInfo, ...x, dateObtained: new Date() };

          this.localDB.setToken(obj);
          console.log(x);
        } else if (confirm('Credenciales no validas, reintentar?'))
          window.location.href = '/';
      });
  }

  async getToken(code) {
    let response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
        window.location.origin
      )}/&client_id=${this.client_id}&client_secret=${this.client_secret}`
    })
      .then(x => x.json())
      .then(x => {
        if (!x.error) {
          x.dateObtained = new Date();
          this.localDB.setToken(x);
        } else if (confirm('Credenciales no validas, reintentar?'))
          window.location.href = '/';
      });
  }

  async getAuthorizeLink() {
    const authBase = 'https://accounts.spotify.com/authorize?';
    const scope = [
      'user-library-read',
      'user-read-currently-playing',
      'user-top-read'
    ];
    let client_id = this.client_id;
    const response_type = 'code';
    const redirect_uri = window.location.href;
    const query = qs.stringify(
      { scope, redirect_uri, client_id, response_type },
      { arrayFormat: 'comma' }
    );

    const url = `${authBase}${query}`;

    return url;
  }

  setAuth() {
    let tokenInfo = this.localDB.getToken();
    let dateObtained = new Date(tokenInfo.dateObtained);
    let expires = new Date(
      dateObtained.getTime() + tokenInfo.expires_in * 1000
    );
    if (expires < Date.now()) 
        this.refreshToken();
   
    this.api.setAccessToken(this.localDB.getToken().access_token);

  }
}
