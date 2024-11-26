<template>
    <el-card>
        <slot></slot> <!--（父元素插入到 slot 里）-->
    </el-card>
</template>

<script setup>

</script>

<style scoped lang="less">
.el-card {
    /*（移除阴影 暗色模式背景颜色和文字颜色 圆角 水平垂直内边距）*/
    @apply shadow-none bg-zinc-100 dark:bg-zinc-700 dark:text-white rounded-lg;

    /*(设置transiton动画 持续时间)*/
    @apply transition ease-in-out duration-300;

    &:hover {
        /* (shadow 小、右下 light和dark模式的shadow颜色 y轴移动-2) */
        @apply shadow-sm-right-bottom shadow-black dark:shadow-blue-600 -translate-y-2;
    }
}
</style>
