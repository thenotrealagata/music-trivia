<template>
  <div>
    <div className="hero min-h-screen" style="backgroundImage: url(https://images.unsplash.com/photo-1514747975201-4715db583da9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)">
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">hello hello!</h1>
          <p className="mb-5">Are you ready to test your knowledge on the songs & artists you love the most?</p>
          <router-link to="/play"><button className="btn btn-primary">Play</button></router-link>
        </div>
      </div>
    </div>
    <div class="container lg mx-auto px-20">
      <h2 className="my-5 text-4xl font-bold text-center">...not ready yet?</h2>
      <p>Here's some data about your favourite tracks in the last 6 months!</p>
      <h3 className="my-3 text-3xl font-bold text-center">Your statistics</h3>
      <div v-if="isLoggedIn" className="stats shadow">
  
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </div>
          <div className="stat-title">Average track length</div>
          <div className="stat-value text-primary">{{ getAvgTrackLength() }} mins</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div className="stat-title">Most popular song</div>
          <div className="stat-value text-secondary">{{ getName(getMostPopular()) }}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="avatar">
              <div className="w-16 rounded-full">
                <img :src="favouriteArtist.items[0].images[2].url" />
              </div>
            </div>
          </div>
          <div className="stat-value">{{ getName(favouriteArtist.items[0]) }}</div>
          <div className="stat-title">Favourite artist</div>
        </div>
        
      </div>
      
      <div>
          These are the songs we're going to quiz you on, so you better check them out! **drumroll** Your favourite songs in the last 6 months have been...
          <div v-for="(favouriteSong, index) in favouriteSongs.items" v-bind:key="index">
            <div className="card lg:card-side bg-base-100 shadow-xl my-4">
              <figure><img className="pl-4" :src="favouriteSong.album.images[2].url" alt="Album"/></figure>
              <div className="card-body">
                <h2 className="card-title">{{ getName(favouriteSong) }}</h2>
                <p>by {{ getArtists(favouriteSong.artists)}} </p>
              </div>
            </div>
            <div className="px-5"></div>
          </div>
      </div>
      <button className="absolute right-0 btn btn-success" v-if="isLoggedIn" @click="authoriseSpotify">But first, connect to Spotify!</button>
    </div>
  </div>
</template>

<script>
import { getTopTracks, getFavArtist } from "@/scripts.js";

export default {
    name: "HomePage",
    data() {
      return {
        favouriteArtist: {
          items: [{ name: "", images: [{}, {}, { url: "" }]}],
        },
        avgTrackLength: 0,
        favouriteSongs: {
          items: [],
        },
      }
    },
    methods: {
        authoriseSpotify() {
            handleLogin();
        },
        getArtists(artists) {
          let str = "";
          artists.forEach(artist => { 
            str += str == "" ? "" : ", ";
            str += artist?.name;
          });
          return str;
        },
        getAvgTrackLength() {
          if (this.favouriteSongs.items == undefined) return 0;
          let length = 0;
          const n = this.favouriteSongs.items.length;
          this.favouriteSongs.items.forEach(track => {
            length += track.duration_ms;
          });
          return Math.round(length / 10 / n / 60) / 100;
        },
        getMostPopular() {
          if (this.favouriteSongs.items == undefined) return 0;
          let popular;
          let score = 0;
          this.favouriteSongs.items.forEach(track => {
            if (track.popularity > score) {
              popular = track;
              score = track.popularity;
            }
          });
          return popular;
        },
        getName(track) {
          return track?.name;
        },
    },
    computed: {
        isLoggedIn() {
          return !(localStorage.getItem('access_token') == null) && true; // TODO: replace true with when new access token needs to be generated 
        },
    },
    async created() {
        this.favouriteSongs = await getTopTracks();
        this.favouriteArtist = await getFavArtist();
    }
}

// App details
const clientId = '956e9f7af3b34a0293c7aba306c36eb3';
const redirectUri = 'http://localhost:8080/';

// Authorise Spotify
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
    let scope = 'user-read-private user-read-email user-top-read';

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

// Generating user token
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

fetch('https://accounts.spotify.com/api/token', {
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
</script>

<style>

</style>