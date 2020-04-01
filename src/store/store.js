import Vue from 'vue'
import Vuex from 'vuex'
import i18n from './../i18n';

Vue.use(Vuex);

export const store = new Vuex.Store({
    strict: true,
    state: {
        speed: '',
        distance: '',
        duration: '',
        defaultDistances: [
            {label: i18n.t('common.marathon'), distance: "42.195"},
            {label: i18n.t('common.half_marathon'), distance: "21.0975"},
            {label: "10km", distance: "10"},
        ],
        /* Settings */
        showPredictions: true,
        showLapTime: true,
        oneFieldMode: false,
        lang: 'fr'
    },
    mutations: {
        setSpeed(state, speed) {
            state.speed = speed.replace(",", ".")
        },
        setDistance(state, distance) {
            state.distance = distance.replace(",", ".")
        },
        setDuration(state, duration) {
            state.duration = duration
        },
        setOneFieldMode(state, oneFieldMode) {
            state.oneFieldMode = oneFieldMode;
            localStorage.oneFieldMode = state.oneFieldMode;
        },
        showPredictions(state, show) {
            state.showPredictions = show;
            localStorage.showPredictions = state.showPredictions;
        },
        showLapTime(state, show) {
            state.showLapTime = show;
            localStorage.showLapTime = state.showLapTime;
        },
        addPresetDistance(state, newPreset) {
            state.defaultDistances.push(newPreset);
            localStorage.setItem('defaultDistances', JSON.stringify(state.defaultDistances));
        },
        rmPresetDistance(state, labelPresetToRm) {
            state.defaultDistances.splice(
                state.defaultDistances.findIndex(distance => distance.label === labelPresetToRm), 1);
            localStorage.setItem('defaultDistances', JSON.stringify(state.defaultDistances));
        },
        initializeStore(state) {
            if (localStorage.getItem('showPredictions')) {
                state.showPredictions = JSON.parse(localStorage.getItem('showPredictions'));
            }

            if (localStorage.getItem('showLapTime')) {
                state.showLapTime = JSON.parse(localStorage.getItem('showLapTime'));
            }

            if (localStorage.getItem('defaultDistances')) {
                state.defaultDistances = JSON.parse(localStorage.getItem('defaultDistances'));
            }

            if (localStorage.getItem('oneFieldMode')) {
                state.oneFieldMode = JSON.parse(localStorage.getItem('oneFieldMode'));
            }
        }
    }
});