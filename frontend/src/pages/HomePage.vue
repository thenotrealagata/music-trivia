<template>
  <div>
    <p>Are you ready to test your knowledge on the songs and artists you love the most?</p>
    <button>Play</button>
    <h2>...not ready yet?</h2>
    <p>Here's some data about your most listened to tracks in the past year!</p>
    <button v-if="isLoggedIn" @click="authoriseSpotify">But first, connect to Spotify!</button>
    <div v-else>
        Your most listened songs this year are...
        
    </div>
  </div>
</template>

<script>
export default {
    name: "HomePage",
    data() {
        return {
            loggedin: false,
        }
    },
    methods: {
        authoriseSpotify() {
            handleLogin();
        }
    },
    computed: {
        isLoggedIn() {
            return localStorage.getItem('access_token') == null;
        }
    }
}

const clientId = '956e9f7af3b34a0293c7aba306c36eb3';
const redirectUri = 'http://localhost:8080/';

async function handleLogin() {
  function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64encode(digest);
  }

  let codeVerifier = generateRandomString(128);

  generateCodeChallenge(codeVerifier).then(codeChallenge => {
    let state = generateRandomString(16);
    let scope = 'user-read-private user-read-email';

    localStorage.setItem('code_verifier', codeVerifier);

    let args = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: '' + redirectUri,
      state: state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });

    window.location = 'https://accounts.spotify.com/authorize?' + args;
  });
}

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');
let codeVerifier = localStorage.getItem('code_verifier');

let body = new URLSearchParams({
  grant_type: 'authorization_code',
  code: code,
  redirect_uri: redirectUri,
  client_id: clientId,
  code_verifier: codeVerifier
});

const response = fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: body
}).then(response => {
    if (!response.ok) {
      throw new Error('HTTP status ' + response.status);
    }
    return response.json();
}).then(data => {
    localStorage.setItem('access_token', data.access_token);
}).catch(error => {
    console.error('Error:', error);
});

console.log(response); // comment this out pls

async function getProfile(accessToken) {
    console.log('access token: ' + localStorage.getItem('access_token'));
    accessToken = localStorage.getItem('access_token');

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });

    const data = await response.json();

    return data;
}

getProfile();
</script>

<style>

</style>