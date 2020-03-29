<template>
    <div class="share-box w-1/4 xs:w-full sm:w-full md:w-full ml-8 xs:ml-0 sm:ml-0 md:ml-0 mt-5 xs:mt-0 h-32 xs:flex"
         v-if="calculOk">
        <h3 class="mx-4 mt-4 text-center"><b>Partagez votre performance !</b></h3>
        <div class="flex mx-auto mt-3">
            <!-- TWITTER -->
            <a :href="`https://twitter.com/intent/tweet?text=J\'ai couru ${distance}km en ${human_duration}, à une vitesse de ${speed}km/h ! - via https://ma-vitesse.app`"
               data-size="large"
               target="_blank">
                <img class="social-icon h-8" src="../assets/icons/social/twitter.svg"/>
            </a>
            <!-- FACEBOOK -->
            <a :href="`https://www.facebook.com/sharer/sharer.php?u=https://ma-vitesse.app&quote=J\'ai couru ${distance}km en ${human_duration}, à une vitesse de ${speed}km/h ! - via https://ma-vitesse.app`"
               target="_blank">
                <img class="social-icon h-8 ml-8" src="../assets/icons/social/facebook.svg"/>
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
        transition: all 200ms;
        filter: contrast(150%);
    }

    .share-box {
        @apply flex flex-col;
        @apply rounded-lg shadow-xl;
        background-color: rgba(white, 0.8);
        backdrop-filter: blur(2px);
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