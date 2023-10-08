<template>
  <div className="container lg mx-auto px-20">
    <div className="flex flex-col w-full lg:flex-row">
      <div className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center">{{ track1.name }} by {{ getArtists(track1.artists) }}, {{ track1.popularity }}</div> 
      <div className="divider lg:divider-horizontal my-5">is 
        <button @click="chooseTrack(1)" className="btn btn-ghost btn-success feedback">MORE</button>
          or 
        <button @click="chooseTrack(2)" className="btn btn-ghost feedback">LESS</button> popular than
      </div> 
      <div className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center">{{ track2.name }} by {{ getArtists(track2.artists) }}, {{ track2.popularity }}</div>
    </div>

  </div>
</template>

<script>
import { getTopTracks } from "@/scripts.js";

export default {
    name: 'PlayTrivia',
    data() {
      return {
        remainingTracks: {},
        isGameOn: true,
        track1: {},
        track2: {},
        points: 0,
        gameInitialized: false,
      }
    },
    components: {
    },
    methods: {
      getNextTrack() {
        // TODO: add logic to determine whether game is over
        if (this.remainingTracks.items == undefined) return {};
        const i = Math.floor(Math.random() * this.remainingTracks.items?.length);
        const value = this.remainingTracks.items[i];
        this.remainingTracks.items.splice(i, 1);
        return value;
      },
      getArtists(artists) {
          let str = "";
          artists?.forEach(artist => { 
            str += str == "" ? "" : ", ";
            str += artist?.name;
          });
          return str;
      },
      chooseTrack(track) {
        console.log("button clicked");
        const success = this.isMorePopular(track);
        if (success) {
          
          this.points++;
        }
        this.changeEnvironment (success);
        this.track1 = this.getNextTrack();
        this.track2 = this.getNextTrack();
      },
      isMorePopular(track) {
        if (this.track1.popularity > this.track2.popularity) {
          return track === 1;
        } else return track === 2;
      },
      async changeEnvironment(success) {
        const btns = document.getElementsByClassName("feedback");
        let addClass = success ? "btn-success" : "btn-warning";

        [...btns].forEach(btn => {
          btn.classList.remove("btn-success", "btn-warning");
          btn.classList.add(addClass);
          console.log(btn.classList);
        });
      }

    },
    async created() {
      this.remainingTracks = await getTopTracks();
      if (!this.gameInitialized) {
        this.track1 = this.getNextTrack();
        this.track2 = this.getNextTrack();
        this.gameInitialized = true;
      }
    }
}
</script>

<style>

</style>