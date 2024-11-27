<template>
    <myCard>
        <el-table :data="history_data" border highlight-current-row @current-change="selectionChange">
            <el-table-column prop="time" label="TIME" width="120" />
            <el-table-column prop="render_mode" label="渲染模式" width="120" />
            <el-table-column prop="batch_size" label="生成数量" width="120" />
            <el-table-column prop="guidance_scale" label="提示词引导参数" width="150" />
            <el-table-column prop="size" label="渲染尺寸" width="120" />
            <el-table-column prop="prompt" label="提示词" />
        </el-table>

        <el-pagination class="pt-4 flex-center" background layout="prev, pager, next" :total="tot" :page-size="10"
            v-model:current-page="current_page" @current-change="pageChange" />
    </myCard>
</template>

<script setup>
import myCard from './my/my-card.vue'
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'

const tot = ref(0)               // 总共有多少历史记录
const current_page = ref(1)      // 当前页码
const is_history = ref(false)    // 是否在处理 history 请求
const history_data = ref([])     // el-table 绑定的历史记录数据
const props = defineProps({
    req: {
        require: true
    }
})

const emit = defineEmits(['updateIsHistory']) // 这里定义类似 godot 的信号

// 双向绑定，一但 history 发生改变，向父节点传值
watch(is_history, (newValue) => {
    emit('updateIsHistory', newValue)
})

// 初始化的时候，等 tot 获取到值后再 query
watch(tot, (newValue, oldValue) => { // (newValue 在前)
    if (oldValue == 0 && newValue != 0) {
        console.log(`${0} ${Math.min(tot.value - 1, 9)}`)
        historyQuery(0, Math.min(tot.value - 1, 9))
    }
})


onMounted(() => {
    is_history.value = false
    historyNum()
})


const selectionChange = (selection) => {
    props.req.prompt = selection.prompt
    props.req.batch_size = selection.batch_size
    props.req.guidance_scale = selection.guidance_scale
    props.req.render_mode = selection.render_mode
    props.req.size = selection.size
    console.log(selection)
}

const pageChange = async () => {
    let l = (current_page.value - 1) * 10
    let r = Math.min(l + 9, tot.value - 1)
    historyQuery(l, r)
}

const historyNum = async () => {
    is_history.value = true
    try {
        const response = await axios.get('http://127.0.0.1:8000/history/num')
        console.log(`${response.data} -> ${typeof response.data}`)
        tot.value = response.data
    } catch (error) {
        console.error(error)
    }
    is_history.value = false
}

const historyQuery = async (l, r) => { // 向后端发送查看历史记录的请求
    console.log(`${l} ${r}`)
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
    while (history_data.value.length != 0) {
        history_data.value.pop()
    }
    for (let i = 0; i <= data.length - 1; i++) {
        let curr_data = data[i]
        let now = {}
        now.time = _handleDate(curr_data.time)
        now.prompt = curr_data.prompt
        now.batch_size = curr_data.batch_size
        now.guidance_scale = curr_data.guidance_scale
        now.render_mode = curr_data.render_mode
        now.size = curr_data.size
        history_data.value.push(now)
    }
    //console.log(history_data.value)
}

const _handleDate = (date) => {
    let cnt = 0, s = ""
    for (let j = 0; j <= date.length - 1; j++) {
        if (date[j] == '_') {
            if (cnt < 2) {
                cnt++
                s += '/'
            } else {
                s += ':'
            }
        } else s += date[j]
    }
    return s
}
</script>

<style scoped>
/* (th：表头单元格; tr：表格的行; td：表格的单元格) */
:deep(.el-table),
:deep(.el-table__expanded-cell),
/* (应用于所有.el-table中的<th/tr/td>元素) */
:deep(.el-table th),
:deep(.el-table tr),
:deep(.el-table td) {
    @apply dark:bg-zinc-600 dark:text-white;
}

/* (.el-table__body-wrapper .el-table__body: 在 wrapper 包装器里找到主体部分) */
/* (tr:hover>td：当表格行（<tr>元素）被悬停（hover）时，应用于该行内所有直接子元素（即单元格<td>）的样式) */
:deep(.el-table__body-wrapper .el-table__body tr:hover>td),
:deep(.el-table__body-wrapper .el-table__body tr.current-row>td) {
    @apply dark:bg-zinc-500;
}
</style>