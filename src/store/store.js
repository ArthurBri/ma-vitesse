import Vue from 'vue'
import Vuex from 'vuex'
import i18n from './../i18n';

Vue.use(Vuex);

export const store = new Vuex.Store({
    strict: true,
    state: {
        speed: '',
        speedFormat: 'speed',
        distance: '',
        duration: '',
        defaultDistances: [
            {label: i18n.t('common.marathon'), distance: "42.195"},
            {label: i18n.t('common.half_marathon'), distance: "21.0975"},
            {label: "10km", distance: "10"},
        ],
        unitMode: 'km',
        /* unit of reference is km */
        unitMultipliers: [
            {type: 'km', label: i18n.t('common.kilometers'), multiplier: 1},
            {type: 'mi', label: i18n.t('common.kilometers'), multiplier: 0.62137119224}
        ],
        distanceUnit: 'km',
        distanceUnits: [
            {type: 'km', label: i18n.t('common.kilometers')},
            {type: 'mi', label: i18n.t('common.miles')}
        ],
        speedUnit: 'km/h',
        speedUnits: [
            {type: 'km', short: "km/h", label: i18n.t('common.kilometersPerHour')},
            {type: 'mi', short: "mph", label: i18n.t('common.milesPerHour')}
        ],
        paceUnit: 'min/km',
        paceUnits: [
            {type: 'km', short: "min/km", label: i18n.t('common.minutesPerKm')},
            {type: 'mi', short: "min/mi", label: i18n.t('common.minutesPerMile')}
        ],
        /* Settings */
        showPredictions: true,
        showLapTime: true,
        showUpdatesAlert: true,
        currentUpdateAlert: 1,
        oneFieldMode: false,
        lang: 'fr',
        calculatedField: ''
    },
    mutations: {
        setSpeed(state, speed) {
            state.speed = String(speed).replace(",", ".")
        },
        setSpeedFormat(state, speedFormat) {
            state.speedFormat = speedFormat
        },
        setDistance(state, distance) {
            state.distance = String(distance).replace(",", ".")
        },
        setDuration(state, duration) {
            state.duration = duration
        },
        setCalculatedField(state, calculatedField) {
            state.calculatedField = calculatedField
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
                    state.unitMode = state.speedUnits.filter(speedUnit => speedUnit.type === newMode.unit)[0].type;
                } else if (newMode.fieldType === 'distance') {
                    state.unitMode = state.distanceUnits.filter(distanceUnit => distanceUnit.type === newMode.unit)[0].type;
                } else if (newMode.fieldType === 'pace') {
                    state.unitMode = state.paceUnits.filter(paceUnit => paceUnit.type === newMode.unit)[0].type;
                }
            }
            state.distanceUnit = state.distanceUnits.filter(distanceUnit => distanceUnit.type === state.unitMode)[0].type;
            state.speedUnit = state.speedUnits.filter(speedUnit => speedUnit.type === state.unitMode)[0].type;
            state.paceUnit = state.paceUnits.filter(paceUnit => paceUnit.type === state.unitMode)[0].type;
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
            }

            if (localStorage.getItem('defaultDistances')) {
                state.defaultDistances = JSON.parse(localStorage.getItem('defaultDistances'));
            }

            if (localStorage.getItem('oneFieldMode')) {
                state.oneFieldMode = JSON.parse(localStorage.getItem('oneFieldMode'));
            }

            if (localStorage.getItem('unitMode')) {
                state.unitMode = localStorage.getItem('unitMode');
                state.distanceUnit = state.distanceUnits.filter(distanceUnit => distanceUnit.type === state.unitMode)[0].type;
                state.speedUnit = state.speedUnits.filter(speedUnit => speedUnit.type === state.unitMode)[0].type;
                state.paceUnit = state.paceUnits.filter(paceUnit => paceUnit.type === state.unitMode)[0].type;
            }
        }
    }
});