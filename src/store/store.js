import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        speed: '',
        distance: '',
        duration: '',
    },
    mutations: {
        setSpeed(state, speed) {
            state.speed = speed
        },
        setDistance(state, distance) {
            state.distance = distance
        },
        setDuration(state, duration) {
            state.duration = duration
        }
    },
    getters: {
        getSpeed: state => state.speed,
        getDistance: state => state.distance,
        getDuration: state => state.duration
    }
});