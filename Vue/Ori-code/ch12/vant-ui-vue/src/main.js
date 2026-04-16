import { createApp } from 'vue'
import App from './App.vue'
//以下是完整引入
//import Vant from 'vant';
//import 'vant/lib/index.css';
//createApp(App).use(Vant).mount('#app')

//以下是按需引入
import { Calendar } from 'vant';
const app = createApp(App);
app.use(Calendar);
app.mount('#app')