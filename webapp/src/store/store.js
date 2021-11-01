import Vue from 'vue'
import Vuex from 'vuex'
import i18n from './../i18n'
import { version } from '../../package.json'

Vue.use(Vuex)

const getDefaultState = () => (
    {
        speed: 0,
        speedFormat: 'speed',
        distance: 0,
        duration: 0,
        defaultDistances: [
            { label: 'common.marathon', distance: 42.195 },
            { label: 'common.half_marathon', distance: 21.0975 },
            { label: 'common.10_km', distance: 10 }
        ],
        unitMode: 'km',
        distanceUnits: [
            { type: 'km', label: i18n.t('common.kilometers'), multiplier: 1 },
            { type: 'mi', label: i18n.t('common.miles'), multiplier: 0.62137119224 }
        ],
        speedUnits: [
            {
                type: 'km',
                short: 'km/h',
                label: i18n.t('common.kilometersPerHour')
            },
            { type: 'mi', short: 'mph', label: i18n.t('common.milesPerHour') }
        ],
        paceUnits: [
            {
                type: 'km',
                short: 'min/km',
                label: i18n.t('common.minutesPerKm')
            },
            {
                type: 'mi',
                short: 'min/mi',
                label: i18n.t('common.minutesPerMile')
            }
        ],
        showPredictions: true,
        showLapTime: true,
        showUpdatesAlert: true,
        currentUpdateAlert: version,
        oneFieldMode: false,
        calculatedField: ''
    }
)

export const store = new Vuex.Store({
    strict: true,
    state: getDefaultState(),
    mutations: {
        setSpeed(state, speed) {
            state.speed = speed
        },
        setSpeedFormat(state, speedFormat) {
            state.speedFormat = speedFormat
            localStorage.setItem('speedFormat', state.speedFormat)
        },
        setDistance(state, distance) {
            state.distance = distance
        },
        setDuration(state, duration) {
            state.duration = duration
        },
        setCalculatedField(state, calculatedField) {
            state.calculatedField = calculatedField
        },
        setOneFieldMode(state, oneFieldMode) {
            state.oneFieldMode = oneFieldMode
            localStorage.setItem('oneFieldMode', state.oneFieldMode)
        },
        showPredictions(state, show) {
            state.showPredictions = show
            localStorage.setItem('showPredictions', state.showPredictions)
        },
        showLapTime(state, show) {
            state.showLapTime = show
            localStorage.setItem('showLapTime', state.showLapTime)
        },
        hideUpdatesAlert(state) {
            state.showUpdatesAlert = false
            localStorage.setItem('updatesAlertHidden', JSON.stringify(state.currentUpdateAlert))
        },
        addPresetDistance(state, newPreset) {
            state.defaultDistances.push(newPreset)
            localStorage.setItem('defaultDistances', JSON.stringify(state.defaultDistances))
        },
        rmPresetDistance(state, labelPresetToRm) {
            state.defaultDistances.splice(
                state.defaultDistances.findIndex((distance) => distance.label === labelPresetToRm),
                1
            )
            localStorage.setItem('defaultDistances', JSON.stringify(state.defaultDistances))
        },
        changeUnitMode(state, newMode) {
            const currentMode = state.unitMode
            if (typeof newMode === 'string') {
                state.unitMode = newMode
            } else {
                if (newMode.fieldType === 'speed') {
                    state.unitMode = state.speedUnits.filter((speedUnit) => speedUnit.type === newMode.unit)[0].type
                } else if (newMode.fieldType === 'distance') {
                    state.unitMode = state.distanceUnits.filter((distanceUnit) => distanceUnit.type === newMode.unit)[0].type
                } else if (newMode.fieldType === 'pace') {
                    state.unitMode = state.paceUnits.filter((paceUnit) => paceUnit.type === newMode.unit)[0].type
                }
            }

            const currentMultplier =
                state.distanceUnits.filter((unitMultiplier) => unitMultiplier.type === currentMode)[0].multiplier || 1
            const newMultiplier =
                state.distanceUnits.filter((unitMultiplier) => unitMultiplier.type === state.unitMode)[0].multiplier || 1

            state.speed = (state.speed * newMultiplier) / currentMultplier || 0
            state.distance = (state.distance * newMultiplier) / currentMultplier || 0

            localStorage.setItem('unitMode', state.unitMode)
        },
        initializeStore(state) {
            if (localStorage.getItem('showPredictions')) {
                state.showPredictions = JSON.parse(localStorage.getItem('showPredictions'))
            }

            if (localStorage.getItem('showLapTime')) {
                state.showLapTime = JSON.parse(localStorage.getItem('showLapTime'))
            }

            if (localStorage.getItem('updatesAlertHidden')) {
                state.showUpdatesAlert = JSON.parse(localStorage.getItem('updatesAlertHidden')) !== state.currentUpdateAlert
            }

            if (localStorage.getItem('defaultDistances')) {
                state.defaultDistances = JSON.parse(localStorage.getItem('defaultDistances')).map((defaultDistance) => ({
                    ...defaultDistance,
                    distance: parseFloat(defaultDistance.distance)
                }))
            }

            if (localStorage.getItem('oneFieldMode')) {
                state.oneFieldMode = JSON.parse(localStorage.getItem('oneFieldMode'))
            }

            if (localStorage.getItem('speedFormat')) {
                state.speedFormat = localStorage.getItem('speedFormat')
            }

            if (localStorage.getItem('unitMode')) {
                state.unitMode = localStorage.getItem('unitMode')
            }
        },
        resetApp(state) {
            localStorage.clear()
            Object.assign(state, getDefaultState())
        }
    }
})
