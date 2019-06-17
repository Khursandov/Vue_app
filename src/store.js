import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    createdMeetupKey: null,
    loadedMeetups: [],
    user: null,
    loading: false,
    error: null
  },
  getters: {
    createdMeetupKey (state) {
      return state.createdMeetupKey
    },
    loadedMeetups(state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date && meetupA.date === meetupB.date
      })
    },
    featuredMeetups(state, getters) {
      return getters.loadedMeetups.slice(0, 5)
      console.log(state.loadedMeetups)
    },
    loadedMeetup(state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    },
    user(state) {
      return state.user
    },
    error(state) {
      return state.error
    },
    loading(state) {
      return state.loading
    }
  },
  mutations: {
    updateMeetup(state,payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if(payload.title) {
        meetup.title = payload.title
      }
      if(payload.description) {
        meetup.description = payload.description
      }
      if(payload.date) {
        meetup.date = payload.date
      }
    },
    setCreatedMeetupKey (state, payload) {
      state.createdMeetupKey = payload
    },
    setLoadedPosts(state, payload){
      state.loadedMeetups = payload
    },
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload)
    },
    setUser(state, payload) {
      console.log(state.user = payload)
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    clearError(state) {
      state.error = null
    }
  },
  actions: {
    logout({commit}){
      firebase.auth().signOut()
      commit('setUser',null)
    },
    loadPosts({commit}) {
      commit('setLoading',true)
      firebase.database().ref('posts').once('value')
      .then((data) => {
        const posts =[]
        const obj = data.val()
        for(let key in obj) {
          posts.push({
            id: key,
            title: obj[key].title,
            description: obj[key].description,
            imageUrl: obj[key].imageUrl,
            date: obj[key].date,
            location: obj[key].location,
            creatorId: obj[key].creatorId
          })
        }
        commit('setLoading',false)
        commit('setLoadedPosts', posts)
      })
      .catch(
        (error) => {
          console.log(error)
          commit('setLoading',true)
        })
    },
    createMeetup({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      let imageUrl
      let key
      firebase.database().ref('posts').push(meetup)
        .then((data) => {
          return data.key
        })
        .then(key => {
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          commit('setCreatedMeetupKey', key)
          return firebase.storage().ref('posts/' + key + ext).put(payload.image)
        })
        .then(fileData => {
          let fullPath = fileData.metadata.fullPath
          return firebase.storage().ref(fullPath).getDownloadURL()
        })
        .then(URL => {
          imageUrl = URL
          key = getters.createdMeetupKey
          return firebase.database().ref('posts').child(key).update({imageUrl: imageUrl})
        })
        .then(() => {
          commit('createMeetup', {
            ...meetup,
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch((error) => {
          console.log(error)
        })

      //Reach out firebase and store it
      
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('cleanError')
      firebase.auth().createUserWithEmailAndPassword(payload.email,payload.password)
      .then(
        user => {
          commit('setLoading', false)
          const newUser = {
            id: user.uid,
            registeredMeetups: []
          }
          console.log(newUser)
          commit('setUser', newUser)
        }
        
      ).catch(
        error => {
          commit('setLoading', false)
          commit('setError',error)
          console.log(error)
        }
      )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('cleanError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          commit('setLoading', false)
          const newUser = {
            id: user.uid,
            registeredMeetups: []
          }
          commit('setUser',newUser)
        }
      ).catch(
        error => {
          commit('setLoading', false)
          console.log(error)
        }
      )
    },
    updateMeetupData({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if(payload.title) {
        updateObj.title = payload.title
      }
      if(payload.description) {
        updateObj.description = payload.description
      }
      if(payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('posts').child(payload.id).update(updateObj)
      .then(() => {
        commit('setLoading', false)
        commit('updateMeetup', payload)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    autoSignIn({commit},payload) {
      commit('setUser',{id: payload.uid, registeredMeetups: []})
    },
    clearError({commit}) {
      commit('clearError')
    }
  }
   
})
