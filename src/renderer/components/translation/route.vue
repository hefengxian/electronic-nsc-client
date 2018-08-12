<template>
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
</template>

<script>
    export default {
        name: "translation-route",
        components: {
            layout: require('../common/layout').default,
        }
    }
</script>