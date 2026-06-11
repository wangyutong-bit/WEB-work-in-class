import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//引入图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
//注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus).use(router).mount('#app')
// eslint-disable-next-line no-unused-vars
router.beforeEach((to,from)=>{//提示未使用，ESlint规则no-unused vars关闭为eslint-disable-next-line
    //如果路由器需要验证
    if(to.meta.auth){
      //对路由进行验证
       if (window.sessionStorage.getItem('uname') === null) {
        alert("您没有登录，无权访问！")
        /*未登录则跳转到登陆界面，
        query:{ redirect: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来*/
        return {
          path: '/login',
          query: {redirect: to.fullPath}
        }
      }
  }
})
