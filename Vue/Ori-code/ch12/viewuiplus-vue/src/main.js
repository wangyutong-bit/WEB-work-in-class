import { createApp } from 'vue'
//import ViewUIPlus from 'view-ui-plus' //完整引入
import App from './App.vue'
import 'view-ui-plus/dist/styles/viewuiplus.css' // 按需引入，仍然需要引入样式

// createApp(App).use(ViewUIPlus).mount('#app') //完整引入
//以下是按需引入的写法
import { Tree} from 'view-ui-plus'; // 按需引入
const app = createApp(App);
// eslint-disable-next-line vue/multi-word-component-names
app.component('Tree', Tree); // 按需引入
app.mount('#app')
