<template>
  <div>
    <HeaderView @goIndex="goToIndex" @searchIndex="searchToIndex"/>
  </div>
  <div>
    <el-row>
        <el-col
        v-for="(item, index) in goodslists"
        :key="item.goodsid"
        :span="4"
        :offset="index > 0 && (index ==1 || (index !=1 && index % 5 != 0))? 1 : 0">
            <el-card :body-style="{ padding: '0px' }">
                <el-link :underline="false" @click="goToGoodsDetail(item)"><img :src="item.gpicture" class="image"/></el-link>
                <div style="padding: 5px">
                    <el-link :underline="false" @click="goToGoodsDetail(item)"><span class="myfont">{{item.gname}}</span></el-link>
                    <br>
                    <span class="myfont">&yen;<strike>{{item.goprice.toFixed(1)}}</strike></span> &nbsp; 
                    <span class="yourfont">&yen;{{item.grprice.toFixed(1)}}</span>
                </div>
            </el-card>
        </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue'
import HeaderView from '@/components/HeaderView.vue'
import {useRouter} from 'vue-router'
const router = useRouter()
const goodslists = reactive([
    {
      goodsid: 1, gname: '水果1号', goprice: 10.0, grprice: 8.0, gstore: 1000,
      gpicture: require("../assets/6.jpg"), typeid: 1, typename: '水果'
    },
    {
      goodsid: 2, gname: '家电1号', goprice: 1000.0, grprice: 800.0, gstore: 2000,
      gpicture: require("../assets/7.jpg"), typeid: 2, typename: '家电'
    },
    {
      goodsid: 3, gname: '服装1号', goprice: 100.0, grprice: 88.0, gstore: 3000,
      gpicture: require("../assets/8.jpg"), typeid: 3, typename: '服装'
    },
    {
      goodsid: 4, gname: '文具1号', goprice: 15.0, grprice: 14.0, gstore: 5000,
      gpicture: require("../assets/9.jpg"), typeid: 4, typename: '文具'
    },
    {
      goodsid: 5, gname: '图书1号', goprice: 50.0, grprice: 40.0, gstore: 3000,
      gpicture: require("../assets/10.jpg"), typeid: 5, typename: '图书'
    },
    {
      goodsid: 6, gname: '酒水1号', goprice: 150.0, grprice: 100.0, gstore: 5000,
      gpicture: require("../assets/11.jpg"), typeid: 6, typename: '酒水'
    },
    {
      goodsid: 7, gname: '水果2号', goprice: 20.0, grprice: 18.0, gstore: 3000,
      gpicture: require("../assets/6.jpg"), typeid: 1, typename: '水果'
    },
    {
      goodsid: 8, gname: '家电2号', goprice: 2000.0, grprice: 1800.0, gstore: 4000,
      gpicture: require("../assets/7.jpg"), typeid: 2, typename: '家电'
    },
    {
      goodsid: 9, gname: '服装2号', goprice: 200.0, grprice: 188.0, gstore: 5000,
      gpicture: require("../assets/8.jpg"), typeid: 3, typename: '服装'
    },
    {
      goodsid: 10, gname: '文具2号', goprice: 18.0, grprice: 15.0, gstore: 6000,
      gpicture: require("../assets/9.jpg"), typeid: 4, typename: '文具'
    },
    {
      goodsid: 11, gname: '图书2号', goprice: 70.0, grprice: 50.0, gstore: 8000,
      gpicture: require("../assets/10.jpg"), typeid: 5, typename: '图书'
    },
    {
      goodsid: 12, gname: '酒水2号', goprice: 1500.0, grprice: 1000.0, gstore: 8000, 
      gpicture: require("../assets/11.jpg"), typeid: 6, typename: '酒水'
    }
])
let copylist = reactive([])
onMounted (()=> {
    //备份数据
    Object.assign(copylist, goodslists)
})
//typeid子组件传递过来的数据
const goToIndex = (typeid) => {
    if(typeid != 0){
        let searchList = reactive([])
            copylist.forEach(element => {
                if (element.typeid === typeid)
                    searchList.push(element)
            });
            Object.assign(goodslists, searchList)
			//删除多余的数据
            goodslists.splice(searchList.length, goodslists.length)
    }else{
        Object.assign(goodslists, copylist)
    }
}
//searchV子组件传递过来的数据
const searchToIndex = (searchV) => {
    let searchList = reactive([])
    copylist.forEach(element => {
        if (element.gname.search(searchV) != -1)
            searchList.push(element)
    });
    Object.assign(goodslists, searchList)
    goodslists.splice(searchList.length, goodslists.length)
}
const goToGoodsDetail = (goods) => {
    router.push({name: 'goodsDetail', params: goods })
}
</script>
<style scoped>
.myfont {
  font-size: 10pt;
  color: rgb(125, 123, 123);
}
.yourfont {
  font-size: 11pt;
  color: rgb(249, 7, 7);
}
.image {
  width: 210px;
  height: 180px; 
  display: block;
}
.el-col {
  margin-bottom: 10px;
}
</style>