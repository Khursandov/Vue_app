import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import * as firebase from 'firebase'
import AlertCmp from './components/Shared/Alert.vue'
import Edit from './components/Meetup/Edit/Edit.vue'
Vue.config.productionTip = false
Vue.component('app-alert',AlertCmp)
Vue.component('Edit',Edit)
new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyAPo5IUVjyS0WGJPDNACDl8JcG5f7yb3Ks",
      authDomain: "vue-final-2fa90.firebaseapp.com",
      databaseURL: "https://vue-final-2fa90.firebaseio.com",
      projectId: "vue-final-2fa90",
      storageBucket: "vue-final-2fa90.appspot.com",
      messagingSenderId: "318812906792",
      appId: "1:318812906792:web:eac0fe34ea9a0686"
    }),
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$store.dispatch('autoSignIn',user)
      }
    })
    this.$store.dispatch('loadPosts')
  }
}).$mount('#app')
