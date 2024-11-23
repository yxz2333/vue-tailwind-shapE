<template>
    <textarea v-model="value" :placeholder="placeholder" :maxlength="maxlength"></textarea>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: '请输入内容...'
    },
    maxlength: {
        type: Number,
    },
});

const value = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
    value.value = newVal;
});

watch(value, (newVal) => {
    emit('update:modelValue', newVal);
});
</script>

<style scoped></style>
