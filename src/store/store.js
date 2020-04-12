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
        unitMode: 'kilometers',
        /* unit of reference is km */
        unitMultipliers: [
            {type: 'kilometers', multiplier: 1},
            {type: 'miles', multiplier: 0.62137119224}
        ],
        distanceUnit: 'km',
        distanceUnits: [
            {type: 'kilometers', short: "km", full: i18n.t('common.kilometers')},
            {type: 'miles', short: "mi", full: i18n.t('common.miles')}
        ],
        speedUnit: 'km/h',
        speedUnits: [
            {type: 'kilometers', short: "km/h", full: i18n.t('common.kilometersPerHour')},
            {type: 'miles', short: "mph", full: i18n.t('common.milesPerHour')}
        ],
        paceUnit: 'min/km',
        paceUnits: [
            {type: 'kilometers', short: "min/km", full: i18n.t('common.minutesPerKm')},
            {type: 'miles', short: "min/mi", full: i18n.t('common.minutesPerMile')}
        ],
        /* Settings */
        showPredictions: true,
        showLapTime: true,
        showUpdatesAlert: true,
        currentUpdateAlert: 1,
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
        hideUpdatesAlert(state) {
            state.showUpdatesAlert = false;
            localStorage.setItem('updatesAlertHidden', JSON.stringify(state.currentUpdateAlert))
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
        changeUnitMode(state, newMode) {
            // new unit mode is sent like it have to do
            if (typeof newMode === 'string') {
                state.unitMode = newMode
                // new unit mode déduit à partir du select des champs vitesses / distance / rythme
            } else {
                if (newMode.fieldType === 'speed') {
                    state.unitMode = state.speedUnits.filter(speedUnit => speedUnit.short === newMode.unit)[0].type;
                } else if (newMode.fieldType === 'distance') {
                    state.unitMode = state.distanceUnits.filter(distanceUnit => distanceUnit.short === newMode.unit)[0].type;
                } else if (newMode.fieldType === 'pace') {
                    state.unitMode = state.paceUnits.filter(paceUnit => paceUnit.short === newMode.unit)[0].type;
                }
            }
            state.distanceUnit = state.distanceUnits.filter(distanceUnit => distanceUnit.type === state.unitMode)[0].short;
            state.speedUnit = state.speedUnits.filter(speedUnit => speedUnit.type === state.unitMode)[0].short;
            state.paceUnit = state.paceUnits.filter(paceUnit => paceUnit.type === state.unitMode)[0].short;
            localStorage.setItem('unitMode', state.unitMode);
        },
        initializeStore(state) {
            if (localStorage.getItem('showPredictions')) {
                state.showPredictions = JSON.parse(localStorage.getItem('showPredictions'));
            }

            if (localStorage.getItem('showLapTime')) {
                state.showLapTime = JSON.parse(localStorage.getItem('showLapTime'));
            }

            if (localStorage.getItem('updatesAlertHidden')) {
                if (JSON.parse(localStorage.getItem('updatesAlertHidden')) !== state.currentUpdateAlert) {
                    state.showUpdatesAlert = true
                } else {
                    state.showUpdatesAlert = false
                }
                console.log(JSON.parse(localStorage.getItem('updatesAlertHidden')));
                console.log(state.currentUpdateAlert)
            }

            if (localStorage.getItem('defaultDistances')) {
                state.defaultDistances = JSON.parse(localStorage.getItem('defaultDistances'));
            }

            if (localStorage.getItem('oneFieldMode')) {
                state.oneFieldMode = JSON.parse(localStorage.getItem('oneFieldMode'));
            }

            if (localStorage.getItem('unitMode')) {
                state.unitMode = localStorage.getItem('unitMode');
                state.distanceUnit = state.distanceUnits.filter(distanceUnit => distanceUnit.type === state.unitMode)[0].short;
                state.speedUnit = state.speedUnits.filter(speedUnit => speedUnit.type === state.unitMode)[0].short;
                state.paceUnit = state.paceUnits.filter(paceUnit => paceUnit.type === state.unitMode)[0].short;
            }
        }
    }
});