<template>
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
</template>

<script>
    export default {
        name: "audit-route",
        components: {
            layout: require('../common/layout').default,
        }
    }
</script>