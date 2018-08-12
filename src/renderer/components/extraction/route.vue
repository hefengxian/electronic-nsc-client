<template>
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
</template>

<script>
    export default {
        name: "extraction-route",
        components: {
            layout: require('../common/layout').default,
        }
    }
</script>