const { defineConfig } = require("@vue/cli-service");

const path = require("path");

function resolve(dir){
    return path.join(__dirname,dir)
}

module.exports = defineConfig({
  configureWebpack:{
    //配置路径别名
    resolve: {
      alias: {
        "@": resolve( "./src"),
        "comps": resolve("./src/components"),
        "views": resolve("./src/views"),
        "routes": resolve("./src/routes"),
        "styles": resolve("./src/styles"),
      },
    }
  }, 
  devServer: {
    port: 9000,    
  },
  //浏览器地址栏中加项目名
  publicPath: '/ebusiness-admin/',
  transpileDependencies: true,
})
