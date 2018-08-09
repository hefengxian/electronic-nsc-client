<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import api from './api/'
    export default {
        name: 'App',
        created() {
            console.log('App created()', location.hash.replace('#', ''))
            // 第一次加载或者页面刷新之后
            // 1. 检查是否登录（查 localStorage）
            if (this.$localStore.getItem(this.$localStore.Keys.OAUTH_KEY)) {
                api.setAuthorization(this.$localStore.getItem(this.$localStore.Keys.OAUTH_KEY))
                // 是，跳转到 dashboard
                this.$router.push(location.hash.replace('#', ''))
            } else {
                // 不是，跳转到 login
                this.$router.push('login')
            }


        },
    }
</script>

<style>
    /* CSS */
</style>
