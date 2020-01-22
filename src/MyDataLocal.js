export default class MyDataLocal {
    constructor() {
        this.myKey = 'myAccesToken';
    }

    setToken(token) {
        localStorage.setItem(this.myKey, JSON.stringify(token));
    }

    getToken() {
        let token = localStorage.getItem(this.myKey);
        if(token)
            return JSON.parse(token);
    }

    getRefreshToken() {
        let token = this.getToken();
        if(token)
            return token.refresh_token;
    }
};
