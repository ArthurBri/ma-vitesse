<template>
    <div v-if="calculOk">
        <div class="flex">
            <div class="cursor-pointer" @click="copyToClipboard(workout_link)">
                <span class="social-icon mv-icon mv-icon-link white-icon text-xl" />
            </div>
            <a
                :href="`https://twitter.com/intent/tweet?text=J\'ai couru ${distance}km en ${human_duration}, à une vitesse de ${speed}km/h ! - via https://ma-vitesse.app`"
                data-size="large"
                target="_blank"
            >
                <img alt="Twitter share icon" class="social-icon h-6 ml-2" src="../assets/icons/social/twitter.svg" />
            </a>
            <a
                :href="`https://www.facebook.com/sharer/sharer.php?u=https://ma-vitesse.app&quote=J\'ai couru ${distance}km en ${human_duration}, à une vitesse de ${speed}km/h ! - via https://ma-vitesse.app`"
                target="_blank"
            >
                <img alt="Facebook share icon" class="social-icon h-6 ml-2" src="../assets/icons/social/facebook.svg" />
            </a>
        </div>
    </div>
</template>
`

<script>
import { mapState } from 'vuex'
import { toPrettyDuration } from '@/utils/formatData'

export default {
    name: 'Share',
    data() {
        return {
            workout_link: 'https://ma-vitesse.app/w/'
        }
    },
    computed: {
        ...mapState(['duration', 'speed', 'distance', 'oneFieldMode']),
        calculOk() {
            return this.duration && this.speed && this.distance
        },
        human_duration() {
            return toPrettyDuration(this.duration)
        }
    },
    methods: {
        copyToClipboard(link) {
            const el = document.createElement('textarea')
            el.value = link
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
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
