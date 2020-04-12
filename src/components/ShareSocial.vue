<template>
    <div class=""
         v-if="calculOk">
        <div class="flex">
            <!-- TWITTER -->
            <a :href="`https://twitter.com/intent/tweet?text=J\'ai couru ${distance}km en ${human_duration}, à une vitesse de ${speed}km/h ! - via https://ma-vitesse.app`"
               data-size="large"
               target="_blank">
                <img alt="Twitter share icon" class="social-icon h-6" src="../assets/icons/social/twitter.svg"/>
            </a>
            <!-- FACEBOOK -->
            <a :href="`https://www.facebook.com/sharer/sharer.php?u=https://ma-vitesse.app&quote=J\'ai couru ${distance}km en ${human_duration}, à une vitesse de ${speed}km/h ! - via https://ma-vitesse.app`"
               target="_blank">
                <img alt="Facebook shre icon" class="social-icon h-6 ml-2" src="../assets/icons/social/facebook.svg"/>
            </a>
        </div>
    </div>
</template>`

<script>
    import {mapState} from 'vuex'

    export default {
        name: "Share",
        data() {
            return {}
        },
        computed: {
            ...mapState(["duration", "speed", "distance", "oneFieldMode"]),
            calculOk() {
                return this.duration && this.speed && this.distance
            },
            human_duration() {
                return this.prettyDuration(this.duration)
            }
        },
        methods: {
            prettyDuration(duration) {
                let prettyDuration = '';
                let hours = duration | 0;
                let minutes = ((duration % 1) * 60) | 0 >= 1 ? parseInt((duration % 1) * 60) : 0;
                let seconds = (((duration % 1) * 60) % 1) * 60;

                seconds = !hours && !minutes && seconds >= 1 ? parseFloat((seconds).toFixed(1)) : hours || minutes && seconds >= 1 ? Math.round(seconds) : seconds >= 1 ? seconds.toFixed(1) : 0;
                if (seconds === 60) {
                    minutes++, seconds = 0
                }
                if (minutes === 60) {
                    hours++, minutes = 0
                }

                if (this.oneFieldMode) {
                    prettyDuration += hours ? hours + 'h' : '';
                    prettyDuration += hours && minutes && minutes < 10 ? '0' + minutes + 'm' : minutes ? minutes + 'm' : '';
                    prettyDuration += (hours || minutes) && seconds && seconds < 10 ? '0' + seconds + 's' : seconds ? seconds + 's' : '';
                } else {
                    prettyDuration += hours ? hours + ':' : '00:';
                    prettyDuration += hours && minutes && minutes < 10 ? '0' + minutes + ':' : minutes < 10 ? '0' + minutes + ':' : minutes ? minutes + ':' : '00:';
                    prettyDuration += (hours || minutes) && seconds && seconds < 10 ? '0' + seconds : seconds ? seconds : '00';
                }

                return prettyDuration
            },
        }
    }
</script>

<style lang="scss" scoped>
    .social-icon:hover {
        transition: all 100ms;
        transform: scale(1.20);
    }

    @screen xs {
        .share-box {
            @apply rounded-none;
        }
    }

    @screen sm {
        .share-box {
            @apply rounded-none;
        }
    }
</style>