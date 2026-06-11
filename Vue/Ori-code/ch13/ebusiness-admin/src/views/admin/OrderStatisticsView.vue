<template>
	<div id="myChart" :style="{width: '80%', height: '500px'}"></div>
</template>
<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts';
const mydraw = () => {
    const myChart = echarts.init(document.getElementById('myChart'))
    const option = {
        title: {
            text: '按商品分类统计订单数量',
            subtext: '单位万件',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
            name: '订单数量',
            type: 'pie',
            radius: '50%',
            data: [
                { value: 12000, name: '水果' },
                { value: 1738, name: '家电' },
                { value: 1880, name: '服装' },
                { value: 1488, name: '文具' },
                { value: 1600, name: '图书' }
            ],
            emphasis: {
                itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
            }
        ]
    }
    myChart.setOption(option)
}
onMounted (() => {
    mydraw()
})
</script>
