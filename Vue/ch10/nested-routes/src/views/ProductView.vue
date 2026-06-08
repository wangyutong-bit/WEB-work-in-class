<template>
    <div>
        <p>
            <!--定义嵌套路由-->
            <router-link to="/product/alldev">全栈开发</router-link> |
            <router-link to="/product/JavaEE">Java EE整合开发</router-link> |
            <router-link to="/product/SpringBoot">Spring Boot开发</router-link>
        </p>
         <router-view/>
    </div>
</template>
<style scoped>
    p a {
        text-decoration: none;
    }
</style>