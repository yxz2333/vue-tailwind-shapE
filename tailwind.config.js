module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: { // 自定义 boxShadow
        'sm-right-bottom': '4px 4px 10px 1px',
        'lg-right-bottom': '8px 8px 10px 2px',
        /* 接受 5 个参数
        offset-x 和 offset-y：控制阴影的水平和垂直偏移。
        blur-radius：控制阴影的模糊程度。
        spread-radius：控制阴影的扩展程度。
        color：控制阴影的颜色。
        */
      }
    },
  },
  plugins: [],
  important: true, // 设置所有 tailwind 标签全是 !important
  darkMode: 'class', // 启动 dark，且由 class 触发
}
