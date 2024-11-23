<template>
    <el-button :type="type" :circle="circle">
        <img :src="src" />
    </el-button>
</template>

<script setup>
import { defineProps } from 'vue';

// 设置3个传参，type，circle，src
const props = defineProps({
    type: {   // 选择element-plus按钮类型
        type: String,
        default: 'primary'
    },
    circle: { // 是否用圆形图标
        type: Boolean,
        default: false
    },
    src: {    // 传入目标图标
        type: String,
        required: true
    }
});
</script>

<style scoped></style>
