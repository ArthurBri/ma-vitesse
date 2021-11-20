<template>
    <div>
        <div class="toast absolute z-50 lg:px-4 shadow-lg m-2">
            <div class="p-2 rounded-lg bg-gray-200 text-primary items-center leading-none flex lg:inline-flex" role="alert">
                <span class="flex rounded-full bg-green-500 p-1 font-bold mr-3">
                    <span class="mv-icon mv-icon-correct white-icon m-1" style="font-size: 0.7rem" />
                </span>
                <span class="font-semibold mr-2 text-left flex-auto">You have already shared a workout for today.</span>
                <span class="cursor-pointer mv-icon mv-icon-cancel primary-icon text-sm" />
            </div>
        </div>
        <div class="toast2 absolute z-50 lg:px-4 shadow-lg m-2">
            <div class="p-2 rounded-lg bg-gray-200 text-primary items-center leading-none flex lg:inline-flex" role="alert">
                <span class="flex rounded-full bg-red-500 p-1 font-bold mr-3">
                    <span class="mv-icon mv-icon-cancel m-1" style="font-size: 0.7rem" />
                </span>
                <span class="font-semibold mr-2 text-left flex-auto">Link copied in clipboard</span>
                <span class="cursor-pointer mv-icon mv-icon-cancel primary-icon text-sm" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Toast'
}
</script>

<style scoped lang="scss">
.toast {
    margin: auto;
    position: absolute;
    left: 0;
    bottom: 30px;
    right: 0;
    width: 300px;
}

.toast2 {
    margin: auto;
    position: absolute;
    left: 0;
    bottom: 85px;
    right: 0;
    width: 300px;
}
</style>
