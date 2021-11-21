import Vue from 'vue'
import VueRouter from 'vue-router'
import Workout from '../components/Workout.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '*'
    },
    {
        path: '/workouts/:id',
        alias: '/w/:id',
        component: Workout,
        name: 'publicWorkouts'
    }
]

const router = new VueRouter({
    mode: 'history',
    base: import.meta.BASE_URL,
    routes
})

export default router
