<template>
  <v-app>
    <v-toolbar >
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor:pointer">
        Hello
        </router-link>
      </v-toolbar-title>
      <v-toolbar-side-icon @click.native.stop="sideNav = !sideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}

        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items class="hidden-xs-only" v-if="userIsAuthenticated" @click="onLogout">
        <v-btn flat>
          <v-icon left dark>exit_to_app</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer temporary v-model="sideNav">
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile  v-if="userIsAuthenticated" @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <router-view></router-view>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      sideNav: false,
    }
  },
  computed: {
    menuItems() {
      let menuItems = [
        {icon: 'face', title: 'Sign up' ,link:'/signup'},
        {icon: 'lock_open', title: 'Sign in', link:'/signin'}
      ]
      if(this.userIsAuthenticated) {
        menuItems = [
        {icon: 'supervisor_account', title: 'View Posts', link:'/meetups'},
        {icon: 'room', title: 'Create Posts', link:'/meetup/new'},
        {icon: 'person', title: 'Profile', link:'/profile'},
      ]
      }
      return menuItems
    },
    userIsAuthenticated() {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    }
  },
  methods: {
    onLogout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>
