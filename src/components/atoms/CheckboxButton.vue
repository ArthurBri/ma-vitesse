<template>
    <div class="checkbox-button">
        <div
            v-for="option in options"
            :key="option.value"
            @click="$emit('input', option.value)"
            class="checkbox-button-item"
            :class="value === option.value && 'active'"
        >
            <span>{{ option.label }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CheckboxButton',
    props: {
        options: Array,
        value: String
    }
}
</script>

<style lang="scss">
.checkbox-button {
    @apply flex cursor-pointer rounded-lg;

    :first-child {
        @apply rounded-l-lg border-r-0;
    }

    :last-child {
        @apply rounded-r-lg border-l-0;
    }
}

.checkbox-button-item {
    @apply px-2 py-1 border-gray-100 border;

    &.active {
        @apply text-white bg-secondary font-bold;
    }
}
</style>
