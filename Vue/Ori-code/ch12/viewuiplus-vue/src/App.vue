<template>
  <Tree :data="data" show-checkbox></Tree>
</template>
<script setup>
const data = [
  {
    title: "软件学院",
    expand: true,
    children: [
      {
        title: "计算机大类",
        expand: true,
        children: [
          {
            title: "计算机科学与技术",
          },
          {
            title: "软件工程",
          },
          {
            title: "网络工程",
          },
        ],
      },
      {
        title: "管理大类",
        expand: true,
        children: [
          {
            title: "信息管理与信息系统",
          },
          {
            title: "大数据管理与应用",
          },
        ],
      },
    ],
  },
]
</script>
