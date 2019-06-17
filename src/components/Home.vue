<template>
    <v-container row>
        <v-layout row wrap class="mb-2">
            <v-flex xs12 sm6 class="text-xs-center text-sm-right">
                <v-btn large router to="/meetups" class="info">Watch all posts</v-btn>
            </v-flex>
            <v-flex xs12 sm6 class="text-xs-center text-sm-left">
                <v-btn large router to="/meetups/new" class="info">Create Posts</v-btn>
            </v-flex>
        </v-layout>
        <v-layout >
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular 
                indeterminate
                 class="primary--text"
                 :width="7"
                 :size="70"
                 v-if="loading"
                 ></v-progress-circular>
            </v-flex>
        </v-layout>
         <v-layout>
            <v-flex xs12 sm6 v-for="meetup in meetups" :key="meetup.id" class="ml-2">
              <v-card >
                <v-img
                  class="white--text"
                  height="200px"
                  :src="meetup.imageUrl"
                  >
                  <v-container fill-height fluid>
                  <v-layout fill-height>
              <v-flex xs12 align-end flexbox>
                <span class="headline">{{ meetup.title }}</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-img>
        <v-card-title>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange"  @click="onLoadMeetup(meetup.id)">Explore</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
    </v-container>
</template>
<script>
export default { 
    computed: {
        meetups() {
            return this.$store.getters.featuredMeetups
        },
        loading() {
            return this.$store.getters.loading
        }
    },
    methods: {
        onLoadMeetup(id) {
            this.$router.push('/meetups/' + id)
        }
    }
}
</script>
<style scoped>
.title{
    position: absolute;
    bottom: 50px;
    margin: auto;
    width: 100%;
    text-align: center;
    background-color: rgba(0,0,0,.5);
    color: white;
    font-size: 2em;
    padding: 20px;
}
</style>


