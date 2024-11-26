<template>
    <myCard class="flex-center">
        <el-button @click="console.log(`${req.prompt} -> ${typeof req.prompt}`)">prompt</el-button>
        <el-button @click="console.log(`${req.batch_size} -> ${typeof req.batch_size}`)">batch_size</el-button>
        <el-button
            @click="console.log(`${req.guidance_scale} -> ${typeof req.guidance_scale}`)">guidance_scale</el-button>
        <el-button @click="console.log(`${req.render_mode} -> ${typeof req.render_mode}`)">render_mode</el-button>
        <el-button @click="console.log(`${req.size} -> ${typeof req.size}`)">size</el-button>
        <el-button @click="historyNum()">historyNum()</el-button>
        <el-button @click="historyQuery(0, 1)">historyQuery()</el-button>
        <el-button @click="historySave()">historySave()</el-button>
    </myCard>
</template>

<script setup>
import myCard from '../my/my-card.vue'
import { ref, watch } from 'vue'
import axios from 'axios'

const is_history = ref(false)
let history_data = []
const props = defineProps({
    req: {
        require: true
    },
})

const historyNum = async () => {
    is_history.value = true
    try {
        const response = await axios.get('http://127.0.0.1:8000/test/history/num')
        console.log(`${response.data} -> ${typeof response.data}`)
    } catch (error) {
        console.error(error)
    }
    is_history.value = false
}

const historyQuery = async (l, r) => { // 向后端发送查看历史记录的请求
    is_history.value = true
    try {
        const response = await axios.post('http://127.0.0.1:8000/test/history/query', { l: l, r: r })
        console.log(response.data)
        _handleHistoryData(response.data.dataArray)
    } catch (error) {
        console.error(error)
    }
    is_history.value = false
}

const _handleHistoryData = (data) => {
    while (history_data.length != 0) {
        history_data.pop()
    }
    for (let i = 0; i <= data.length - 1; i++) {
        let curr_data = data[i]
        let now = {}
        now.time = curr_data.time
        now.prompt = curr_data.prompt
        now.batch_size = curr_data.batch_size
        now.guidance_scale = curr_data.guidance_scale
        now.render_mode = curr_data.render_mode
        now.size = curr_data.size
        history_data.push(now)
    }
    console.log(history_data)
}

const historySave = async () => {
    is_history.value = true
    try {
        const response = await axios.post('http://127.0.0.1:8000/test/history/save', props.req)
        console.log(response.data)
    } catch (error) {
        console.error(error)
    }
    is_history.value = false
}

const emit = defineEmits(['updateIsHistory']) // 这里定义类似 godot 的信号
watch(is_history, (newValue) => { // 双向绑定，一但 history 发生改变，向父节点传值
    emit('updateIsHistory', newValue)
})
</script>

<style scoped></style>