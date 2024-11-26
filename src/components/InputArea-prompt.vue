<template>
    <!--（flex-grow 定义一个 flex 子项如何扩展以填充其容器中剩余的空间 以下用了 w-full h-full 扩展了剩余空间）-->
    <div class="flex-grow p-4">
        <!--（focus:outline-none resize-none 是 textarea 的属性，用来删除 focus 效果和禁止拉伸）-->
        <myInputTextarea :v-model="prompt" placeholder="请输入提示词..." :maxLength="100" class="
          text-xl
          w-full h-full p-3 
          border border-gray-400 rounded-lg 
          focus:outline-none resize-none
          dark:text-white 
          dark:bg-zinc-700">
        </myInputTextarea>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import myInputTextarea from './components/my/my-input-textarea.vue'
const props = defineProps({
    prompt: {
        type: String,
        required: true
    }
});
</script>

<style scoped></style>