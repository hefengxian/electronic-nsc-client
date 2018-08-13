<template>
    <layout>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </layout>
</template>

<script>
    export default {
        name: "audit-route",
        components: {
            layout: require('../common/layout').default,
        }
    }
</script>