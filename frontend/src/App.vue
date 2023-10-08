<template>
  <div>
    <NavBar :profilePic="profilePic"></NavBar>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import { getProfile } from "@/scripts.js";

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
</script>

<style>

</style>
