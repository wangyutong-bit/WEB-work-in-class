import { createApp } from 'vue'
//import ElementPlus from 'element-plus'  //完整引入
//import 'element-plus/dist/index.css'
//引入图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

const app = createApp(App)
//注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
//使用ElementPlus
//app.use(ElementPlus).mount('#app')  //完整引入
app.mount('#app')

