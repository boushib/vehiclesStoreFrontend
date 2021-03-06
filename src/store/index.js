import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api'
import auth from './modules/auth'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false,
    vehicles: [],
    vehicle: null,
    myVehicles: []
  },
  mutations: {
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setVehicles(state, vehicles) {
      state.vehicles = vehicles
    },
    setVehicle(state, vehicle) {
      state.vehicle = vehicle
    },
    setMyVehicles(state, vehicles) {
      state.myVehicles = vehicles
    }
  },
  actions: {
    async getListings({ commit }) {
      commit('setIsLoading', true)
      const { data: vehicles } = await api.get('/vehicles')
      commit('setIsLoading', false)
      commit('setVehicles', vehicles)
    },
    async getListing({ commit }, id) {
      commit('setIsLoading', true)
      const { data: vehicle } = await api.get(`/vehicles/${id}`)
      commit('setIsLoading', false)
      commit('setVehicle', vehicle)
      return vehicle
    },
    async getMyListings({ commit }) {
      commit('setIsLoading', true)
      //const { data: vehicles } = await api.get('/my-vehicles')
      const vehicles = []
      commit('setIsLoading', false)
      commit('setMyVehicles', vehicles)
    },
    async addListing({ commit }, vehicle) {
      try {
        commit('setIsLoading', true)
        await api.post('/vehicles', vehicle)
        commit('setIsLoading', false)
        router.push('/')
      } catch (err) {
        commit('setIsLoading', false)
        console.log(err.response)
      }
    },
    async updateListing({ commit }, vehicle) {
      try {
        commit('setIsLoading', true)
        await api.put(`/vehicles/${vehicle.id}`, vehicle)
        commit('setIsLoading', false)
        router.push('/')
      } catch (err) {
        console.log(err.response)
      }
    },
    async deleteListing({ dispatch, commit }, id) {
      try {
        commit('setIsLoading', true)
        await api.delete(`/vehicles/${id}`)
        dispatch('getListings')
        commit('setIsLoading', false)
      } catch (err) {
        console.log(err.response)
      }
    },
    async uploadFile({ commit }, file) {
      commit('setIsLoading', true)
      try {
        const fd = new FormData()
        fd.append('file', file)
        const config = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
        const { data: imageURL } = await api.post(
          '/vehicles/upload',
          fd,
          config
        )
        return imageURL
      } catch (err) {
        console.log(err.response)
      }
    }
  },
  getters: {
    isAuth(state) {
      return state.auth.accessToken || localStorage.getItem('accessToken')
    },
    username(state) {
      return state.auth.username || localStorage.getItem('username')
    }
  },
  modules: {
    auth
  }
})
