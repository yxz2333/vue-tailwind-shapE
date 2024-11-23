import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/MaterialSymbolsDarkMode.svg'
const app = createApp(App)

// 设置全局属性
function isDarkMode() {
    // （document.documentElement 属性获取当前文档的根元素）
    // （.classList 是一个用于操作元素的类属性的 DOM 接口，提供了许多有用的方法来添加、删除和切换类）
    return document.documentElement.classList.contains('dark');
}
app.config.globalProperties.$isDarkMode = isDarkMode // 注册全局属性

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
}
app.config.globalProperties.$toggleDarkMode = toggleDarkMode

app.use(ElementPlus)
app.mount('#app')

