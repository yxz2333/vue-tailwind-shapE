<template>
  <Header />

  <!-- （外边距 纵向flex布局） -->
  <el-main class="mx-[4%] flex flex-col">
    <myCard class="mb-[2%]">
      <!--（纵向flex布局）-->
      <div class="flex flex-row">

        <!--（flex-grow 定义一个 flex 子项如何扩展以填充其容器中剩余的空间 以下用了 w-full h-full 扩展了剩余空间）-->
        <div class="flex-grow p-4">
          <!--（focus:outline-none resize-none 是 textarea 的属性，用来删除 focus 效果和禁止拉伸）-->
          <myInputTextarea v-model="req.prompt" placeholder="请输入提示词..." :maxLength="200" class="
          text-xl
          w-full h-full p-3 
          border border-gray-400 rounded-lg 
          focus:outline-none resize-none
          dark:text-white 
          dark:bg-zinc-700
            ">
          </myInputTextarea>
        </div>

        <!--（flex-none 指定一个 flex 子项不应该增长（grow）或收缩（shrink）以填充父容器的剩余空间，该元素将保持其原始尺寸）-->
        <div class="flex-none p-4">
          <el-button class="
          text-3xl font-bold text-black
          size-36 w-60
          border border-gray-400 rounded-lg
          dark:text-white 
          dark:bg-zinc-700
          hover:opacity-30
          transition-opacity duration-300">
            生成
          </el-button>
        </div>

      </div>
    </myCard>

    <myCard>
      <div class="flex flex-row">
        <div class="flex-grow p-4">
          <el-form :model="req">
            <el-form-item>
              <span class="pr-4">渲染模式</span>
              <el-radio-group v-model="req.render_mode">
                <el-radio-button value="nerf" size="large">nerf</el-radio-button>
                <el-radio-button value="stf" size="large">stf</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item>
              <span>生成数量</span>
              <el-slider v-model="req.batch_size" />
            </el-form-item>
          </el-form>
        </div>

        <div class="flex-grow">

        </div>
      </div>
    </myCard>

  </el-main>

</template>

<script setup>
import Header from './components/Header.vue'
import myCard from './components/my/my-card.vue'
import myInputTextarea from './components/my/my-input-textarea.vue'
import { onMounted, getCurrentInstance, ref, reactive } from 'vue';
const { proxy } = getCurrentInstance() // 获取当前实例的属性
onMounted(proxy.$toggleDarkMode())
const req = reactive({
  prompt: "",
  batch_size: 1,
  guidance_scale: 1.0,
  render_mode: "",
  size: 32,
})
</script>

<style scoped lang="less"></style>
