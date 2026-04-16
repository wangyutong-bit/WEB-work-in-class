<template>
  <div id="myChart" :style="{ width: '80%', height: '500px' }"></div>
</template>
<script setup>
import { onMounted } from "vue";
import * as echarts from "echarts";
const mydraw = () => {
  const myChart = echarts.init(document.getElementById("myChart"));
  const option = {
    title: {
      text: "团队成员（共10人）——年龄结构",
      //subtext: "单位个",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} 人({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "分布",
        type: "pie",
        radius: "65%",
        center: ["50%", "50%"],
        labelLine: {
          length: 30,
        },
        label: {
          formatter: "{b}:  {c|{c}人} {per|{d}%}",
          rich: {
            c: {
                color: '#4C5058',
                fontSize: 20,
                fontWeight: 'bold',
                lineHeight: 33
            },
            per: {
                color: '#fff',
                backgroundColor: '#4C5058',
                padding: [3, 4],
                borderRadius: 4
          }
          }
        },
        data: [
          { value: 1, name: "35岁以下" },
          { value: 3, name: "35-40岁" },
          { value: 5, name: "40-45岁" },
          { value: 1, name: "45岁以上" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  myChart.setOption(option);
};
onMounted(() => {
  mydraw();
});
</script>
