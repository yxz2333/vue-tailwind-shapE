<template>
    <textarea v-model="content" :placeholder="placeholder" :maxlength="maxlength"></textarea>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
    content: { // 传入输入内容
        type: String,
        require: true,
    },
    placeholder: {
        type: String,
        default: '请输入内容...'
    },
    maxlength: {
        type: Number,
        default: 200,
    },
})

const content = ref('')
watch(props, (newValue) => { // 父组件改变了 content 值这里也改变
    content.value = newValue.content
})

const emit = defineEmits(['updateContent']) // 这里定义类似 godot 的信号
watch(content, (newValue) => { // 双向绑定，一但 content 发生改变，向父节点传值
    emit('updateContent', newValue)
})
</script>

<style scoped></style>
