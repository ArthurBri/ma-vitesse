import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    strict: true,
    state: {
        speed: '',
        distance: '',
        duration: '',
        defaultDistances: [
            {label: "Marathon", distance: "42,195"},
            {label: "Semi-Marathon", distance: "21,0975"},
            {label: "10km", distance: "10"},
        ],
        /* Settings */
        showPredictions: false
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
        },
        showPredictions(state, show) {
            state.showPredictions = show;
            localStorage.showPredictions = state.showPredictions;
        },
        initialiseStore(state) {
            // Check if the ID exists
            if (localStorage.getItem('showPredictions')) {
                state.showPredictions = localStorage.showPredictions === 'true'
            }
        }
    },
    getters: {
        getSpeed: state => state.speed,
        getDistance: state => state.distance,
        getDuration: state => state.duration
    }
});