<template>
    <div class="demo-date-picker">
        <div class="block">
            <el-form :inline="true" :model="searchParam">
				<el-form-item label="日期范围">
                    <el-date-picker
                            v-model="searchParam.orderdate"
                            value-format="YYYY-MM"
                            type="monthrange"
                            range-separator="To"
                            start-placeholder="Start month"
                            end-placeholder="End month"
                        />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit()">查询</el-button>
				</el-form-item>
			</el-form>
        </div>
    </div>
	<div id="myChart" :style="{width: '100%', height: '380px'}"></div>
</template>
<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts';
import { reactive } from 'vue'
let searchParam = reactive({})
const data1 = ['2022-08', '2022-09', '2022-10', '2022-11', '2022-12', '2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12']
const data2 = [120, 200, 150, 80, 70, 110, 130, 300, 450, 160, 240, 80, 100, 350, 500, 230, 300]
const onSubmit = () => {//查询
    const datev = searchParam.orderdate
    let data11 = []
    let data22 = []
    for (let i = 0; i < data1.length; i++){
        if(datev[0] <= data1[i] && data1[i] <= datev[1]){
            data11.push(data1[i])
            data22.push(data2[i])
        }
    }
    mydraw(data11, data22)
}
const mydraw = (datav1, datav2) => {
    const myChart = echarts.init(document.getElementById('myChart'))
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: datav1,
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
            data: datav2,
            type: 'bar',
            name: '销量（万元）',
            }
        ]
    }
    myChart.setOption(option)
}
onMounted (() => {
    mydraw(data1, data2)
})
</script>
<style scoped>
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
</style>
