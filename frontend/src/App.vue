<template>
  <div>
    <NavBar :profilePic="profilePic"></NavBar>
    <router-view></router-view>
  </div>
  
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar
  },
  methods: {
  },
  data() {
    return {
      profilePic: null,
    }
  },
  created() {
      getProfile().then(res => {
        this.profilePic = res.images[0].url;
      }).catch(() => {
        this.profilePic = "https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg";
      });
  }
}

async function getProfile(accessToken) {
    console.log('access token: ' + localStorage.getItem('access_token'));
    accessToken = localStorage.getItem('access_token');

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });

    const data = await response.json();

    console.log(data);
    return data;
}

getProfile();
</script>

<style>

</style>
