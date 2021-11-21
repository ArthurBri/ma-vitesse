<template>
    <div v-if="calculatedField" class="flex items-center gap-x-2">
        <button v-if="calculatedField" @click="shareWorkout" class="vi-btn bg-secondary text-white flex py-1 mr-4 gap-2">
            <span>{{ $t('common.share') }}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-share w-4 h-4 stroke-current text-white"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="18" cy="18" r="3" />
                <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
                <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
            </svg>
        </button>
        <a v-if="workoutId" class="cursor-pointer" @click="copyToClipboard(workoutLink)">
            <img class="social-icon vi-icon vi-icon-link text-xl h-6" src="../assets/icons/link.svg" />
        </a>
        <a
            :href="`https://twitter.com/intent/tweet?text=J\'ai couru ${distance}km en ${human_duration}, à une vitesse de ${speed}km/h ! - via https://vitess.app`"
            data-size="large"
            target="_blank"
        >
            <img alt="Twitter share icon" class="social-icon h-6 ml-2" src="../assets/icons/social/twitter.svg" />
        </a>
        <a
            :href="`https://www.facebook.com/sharer/sharer.php?u=https://vitess.app&quote=J\'ai couru ${distance}km en ${human_duration}, à une vitesse de ${speed}km/h ! - via https://vitess.app`"
            target="_blank"
        >
            <img alt="Facebook share icon" class="social-icon h-6 ml-2" src="../assets/icons/social/facebook.svg" />
        </a>
    </div>
</template>
`

<script>
import { mapActions, mapState } from 'vuex'
import { toPrettyDuration } from '@/utils/formatData'
import { nanoid } from 'nanoid'
import { setDoc, doc } from 'firebase/firestore/lite'
import { getUserCountry } from '../core/country'

export default {
    name: 'ShareButtons',
    computed: {
        ...mapState(['speed', 'duration', 'distance', 'unitMode', 'calculatedField', 'oneFieldMode', 'workoutId']),
        human_duration() {
            return toPrettyDuration(this.duration)
        },
        workoutLink() {
            console.log(window.location)
            return window.location.host + '/w/' + this.workoutId
        }
    },
    methods: {
        ...mapActions(['loadWorkouts']),
        copyToClipboard(link) {
            const el = document.createElement('textarea')
            el.value = link
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
        },
        async shareWorkout() {
            const id = nanoid()
            const country = await getUserCountry()

            await setDoc(doc(this.$db, 'workouts', id), {
                country,
                distance: this.distance,
                unit: this.unitMode,
                duration: this.duration,
                speed: this.speed,
                calculatedField: this.calculatedField,
                creationDate: new Date().toISOString(),
                type: 'public'
            })
            localStorage.setItem('lastSharedWorkout', Date.now())
            await this.loadWorkouts(this.$db)

            this.$store.commit('setWorkoutId', id)
            console.log('workout id', this.workoutId)
        }
    }
}
</script>

<style lang="scss" scoped>
.social-icon:hover {
    transition: all 100ms;
    transform: scale(1.2);
}
</style>
