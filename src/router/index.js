import Vue from 'vue'
import VueRouter from 'vue-router'
import Workout from '../components/Workout'

Vue.use(VueRouter);

const routes = [
    {
        path: '*',
    },
    {
        path: '/publicworkouts/:id',
        alias: '/w/:id',
        component: Workout,
        name: 'publicWorkouts'
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
