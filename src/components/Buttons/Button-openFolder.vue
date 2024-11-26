<template>
    <el-button @click="openFolder" :disabled="is_openFolder">
        浏览本地模型
    </el-button>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
const is_openFolder = ref(false) // 判断是否正在打开文件夹，防止多次请求
const openFolder = async () => { // 向后端发送打开本地模型文件夹的请求
    is_openFolder.value = true
    try {
        const response = await axios.get('http://127.0.0.1:8000/openFolder')
        console.log(response.data)
    } catch (error) {
        console.error(error)
    }
    is_openFolder.value = false
}
</script>

<style scoped></style>