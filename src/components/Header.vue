<template>
    <el-header :class="['header', { 'hidden-header': is_hidden }]">
        <div class="flex-container">

            <!-- （文字大小 文字粗体 内边距） -->
            <div class="text-2xl font-bold p-4">文生3D模型平台</div>

            <div>
                <!-- （el-link 文字大小 文字粗体 左右边距 亮色/暗色/hover文字颜色 target设置打开新的标签页 underline设置无下划线） -->
                <el-link
                    class="text-base font-bold mx-6 text-black dark:text-white hover:text-sky-500 dark:hover:text-sky-500"
                    target="_blank" href="https://github.com/openai/shap-e" :underline="false">shap-e</el-link>
                <myIconButton :circle="true" :src="img_src" @click="toggleDarkMode"></myIconButton>
            </div>
        </div>
    </el-header>

    <!--留一段空白，防止覆盖正文-->
    <div class="pb-20"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
import myIconButton from './my/my-icon-button.vue';
const { proxy } = getCurrentInstance()

const is_hidden = ref(false); // 是否隐藏 header-nav

const handleScroll = () => {
    // （window.scrollY 返回目前网页滚动了多少）
    if (window.scrollY != 0) is_hidden.value = true;
    else is_hidden.value = false;
};

onMounted(() => { // 组件挂载时，监听滚动事件
    // 一旦滚动，调用 handleScroll 函数
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => { // 组件被卸载时，取消监听滚动事件
    window.removeEventListener('scroll', handleScroll);
});

// 设置切换暗色图标 //
const dark_img = "src/assets/MaterialSymbolsDarkMode.svg"
const light_img = "src/assets/LsDark.svg"
const img_src = ref(dark_img)
const toggleDarkMode = () => {
    proxy.$toggleDarkMode()
    if (proxy.$isDarkMode()) img_src.value = dark_img
    else img_src.value = light_img
}
</script>

<style scoped lang="less">
.flex-container {
    /* （启用 flex 布局 子元素之间均匀分布 子元素垂直居中对齐） */
    @apply flex justify-between items-center;
}

.header {
    /* （背景蓝色 文字白色 大阴影效果 固定定位 距顶部0 距左侧0 距右侧0 下边框 下边框颜色 过渡效果 过渡时间300ms） */
    @apply bg-white text-black shadow-lg fixed top-0 left-0 right-0 border-b border-neutral-600 transition-all duration-300;

    /*(设置暗色背景、边框颜色、文字颜色)*/
    @apply dark:bg-zinc-900 dark:border-white dark:text-white;
}

.hidden-header {
    @apply -translate-y-full;
    /* 沿 y 轴平移100%，从而把自己移出屏幕，隐藏 header */
}
</style>