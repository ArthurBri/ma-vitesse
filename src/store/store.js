import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        speed: '',
        distance: '',
        duration: '',
        defaultDistances: [
            {label: "Marathon", distance: "42,195"},
            {label: "Semi-Marathon", distance: "21,0975"},
            {label: "10km", distance: "10"},
        ]
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