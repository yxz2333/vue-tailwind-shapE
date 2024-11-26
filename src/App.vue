<template>
  <Header />

  <!-- （外边距 纵向flex布局） -->
  <el-main class="mx-[6%] flex flex-col">
    <myCard class="mb-[2%]">

      <!--（纵向flex布局）-->
      <div class="flex flex-row">

        <div class="flex-grow p-4">
          <!--（focus:outline-none resize-none 是 textarea 的属性，用来删除 focus 效果和禁止拉伸）-->
          <myInputTextarea :content="req.prompt" @update-content="updateContent" placeholder="请输入提示词..."
            :maxLength="100" class="
          text-xl
          w-full h-full p-3 
          border border-gray-400 rounded-lg 
          focus:outline-none resize-none
          dark:text-white 
          dark:bg-zinc-700">
          </myInputTextarea>
        </div>

        <!--（flex-none 指定一个 flex 子项不应该增长（grow）或收缩（shrink）以填充父容器的剩余空间，该元素将保持其原始尺寸）-->
        <div class="flex-none p-4">
          <el-button class="
          text-3xl font-bold
          size-36 w-60
          border border-gray-400 rounded-lg
          dark-button
          transition-opacity duration-300" @click="generate" :disabled="is_generate">
            生成
          </el-button>
        </div>

      </div>
    </myCard>

    <myCard class="mb-[2%]">
      <!--横向排列 两个元素-->
      <div class="flex flex-row flex-container">

        <div class="flex-none p-4">

          <!--横向排列 三个元素-->
          <div class="flex-row flex-container">
            <div class="pr-6">
              <span class="pr-4 text-sm">渲染模式</span>
              <el-radio-group v-model="req.render_mode">
                <el-radio-button value="nerf" size="large">nerf</el-radio-button>
                <el-radio-button value="stf" size="large">stf</el-radio-button>
              </el-radio-group>
            </div>

            <div class="pr-6">
              <span class="pr-4 text-sm">生成数量</span>
              <el-input-number v-model="req.batch_size" :max="6" :min="1" />
            </div>

            <div>
              <span class="pr-4 text-sm">提示词引导参数</span>
              <el-input-number v-model="req.guidance_scale" :precision="1" :step="0.1" :max="32.0" :min="4.0" />
            </div>
          </div>

          <div class="py-8">
            <span class="text-sm">渲染尺寸</span>
            <el-slider v-model="req.size" :max="256" :min="32" show-input />
          </div>

          <div class="flex flex-row">
            <el-button class="dark-button" @click="is_history_card_open = !is_history_card_open" :disabled="is_history">
              历史记录
            </el-button>

            <ButtonOpenFolder class="dark-button" /><!--浏览本地模型-->
          </div>

        </div>


        <div class="flex-grow p-4">
          <el-carousel :interval="4000" height="220px" type="card" :autoplay="false">
            <el-carousel-item class="flex flex-center" v-for="(item, index) in gif_urls" :key="index">
              <img class="size-full" :src="item" :alt="index" />
            </el-carousel-item>
          </el-carousel>
        </div>

      </div>
    </myCard>

    <Transition name="fade"> <!--淡入淡出效果-->
      <CardHistory v-if="is_history_card_open" :req="req" @update-is-history="updateIsHistory" />
    </Transition>
  </el-main>

  <DebugMain :req="req" @update-is-history="updateIsHistory" v-if="false" />
</template>

<script setup>
import Header from './components/Header.vue'
import myCard from './components/my/my-card.vue'
import myInputTextarea from './components/my/my-input-textarea.vue'
import ButtonOpenFolder from './components/Buttons/Button-openFolder.vue'
import CardHistory from './components/Card-history.vue'
import DebugMain from './components/Debug/Debug-main.vue'
import { onMounted, ref, reactive, onBeforeUnmount, Transition, } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import axios from 'axios'
import JSZip from 'jszip'

let intervalId = null                    // setInterval 方法返回的唯一标识符
let loading = null                       // element loading 界面
const gif_urls = ref([])                 // gif 生成的 url
const is_generate = ref(false)           // 是否正在处理 generate 请求
const is_history = ref(false)            // 是否正在处理 history 请求，处理请求的时候不能再按按钮
const is_history_card_open = ref(false)  // history-card 是否挂载
const req = reactive({                   // generate 请求 post 到后端的数据
  prompt: "",
  batch_size: 1,
  guidance_scale: 1.0,
  render_mode: "nerf",
  size: 32,
})


onMounted(() => {
  //startConnect()
  if (!isDarkMode()) toggleDarkMode()
})
onBeforeUnmount(() => {
  gifUrlsClear()
  stopConnect()
})


const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark')
}
const isDarkMode = () => {
  return document.documentElement.classList.contains('dark')
}


// 设置 element loading 界面
const showLoading = (text) => {
  loading = ElLoading.service({
    lock: true,
    text: text,
    background: 'rgba(0, 0, 0, 0.7)',
  })
}

const closeLoading = () => {
  loading.close() // 关闭 element loading 界面
  loading = null  // 防止野指针
}


// 发送 后端初始化 请求
const connectServer = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/')
    if (response.status === 200) {
      console.log("已连接后端服务器！")
      stopConnect()
    }
    else throw new Error("无法连接至后端服务器")
  } catch (error) {
    console.error(error)
  }
}

// 开始连接尝试
const startConnect = () => {
  showLoading('正在连接至后端服务器')

  // 设置间隔的回调函数和时间长度，每 5 秒回调一次函数 pollServer
  intervalId = setInterval(connectServer, 5000)
}

// 停止连接尝试
const stopConnect = () => {
  if (loading) { // 防止多次出现 message
    closeLoading()
    ElMessage({    // 设置 element message
      message: "已成功连接至后端服务器",
      type: "success",
    })
  }

  clearInterval(intervalId) // 清除间隔
  intervalId = null         // 防止野指针
}


// 更新子节点传来的 prompt
const updateContent = (newValue) => {
  req.prompt = newValue
}

// 更新子节点传来的 is_history
const updateIsHistory = (newValue) => {
  is_history.value = newValue
}


// 清空 url，防止内存泄漏
const gifUrlsClear = () => {
  while (gif_urls.value.length != 0) {
    let url = gif_urls.value.pop()
    URL.revokeObjectURL(url)
  }
}

// 解压zip并找出gif文件，把gif文件转成url存入gif_urls
const getGifFormZip = async (data) => {
  let zip = await JSZip.loadAsync(data)
  let files = zip.files // 解压

  for (let file_name in files) {       // 遍历解压后的文件的文件名
    if (file_name.endsWith('.gif')) {  // 找出 gif 文件
      let file = files[file_name]
      let content = await file.async('blob') // gif 文件的二进制内容
      let url = URL.createObjectURL(content) // 生成 url
      gif_urls.value.push(url)
    }
  }
}


// 向后端发送模型生成请求
const generate = async () => {
  showLoading("模型生成中...")
  is_generate.value = true
  is_history_card_open.value = false

  gifUrlsClear() // 使用前先清空之前的 url

  try {
    const response = await axios.post('http://127.0.0.1:8000/generate/text', req, {
      responseType: 'arraybuffer', // 确保以二进制格式接收数据
    })
    console.log(response.data)

    // loading 和 message
    closeLoading()
    ElMessage({
      message: "模型生成成功！",
      type: "success",
    })

    getGifFormZip(response.data) // 解压zip提取gif

  } catch (error) {
    console.error(error)

    // loading 和 message
    ElMessage({
      message: "模型生成失败！正在重新初始化后端服务器",
      type: "error",
    })
    closeLoading()

    startConnect() // 重连
  }

  is_generate.value = false
}

</script>

<style scoped>
/* (走马灯样式，偶数奇数颜色不同) */
.el-carousel__item:nth-child(2n) {
  @apply bg-zinc-500;
}

.el-carousel__item:nth-child(2n + 1) {
  @apply bg-zinc-200;
}

.dark-button {
  @apply text-black dark:text-white dark:bg-zinc-700 hover:opacity-30;
}
</style>
