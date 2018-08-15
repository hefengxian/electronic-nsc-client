<template>
    <layout>
        <!-- 页头 -->
        <div class="nsc-body-right-nav">
            <div class="nsc-body-right-nav-left">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <icon type="md-build"></icon>
                        管理
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>
            <div class="nsc-body-right-nav-right"></div>
        </div>

        <!-- 页体 -->
        <card dis-hover :bordered="false">
            <Tabs type="card"
                  :animated="false"
                  @on-click="handleTabClick">
                <TabPane v-for="(tab, key) in tabs"
                         :key="key"
                         :icon="tab.icon"
                         :name="key"
                         :label="tab.label"></TabPane>
            </Tabs>


        </card>

        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </layout>
</template>

<script>
    import numeral from 'numeral'
    import moment from 'moment'

    const DATE_FORMAT = 'YYYY-MM-DD HH:mi:ss'

    export default {
        data() {
            return {
                numeral,
                cu: this.$localStore.getItem(this.$localStore.Keys.USER_KEY),   // 当前登录用户
                tabs: {
                    user: {
                        label: '用户',
                        icon: 'md-person',
                        link: '/management',
                        desc: '管理用户',
                    },
                    group: {
                        label: '工作组',
                        icon: 'md-people',
                        link: '/management/work-group',
                        desc: '管理工作组',
                    },
                    role: {
                        label: '角色',
                        icon: 'md-pricetag',
                        link: '/management/role',
                        desc: '管理角色',
                    },
                    statistics: {
                        label: '工作统计',
                        icon: 'md-podium',
                        link: '/management/statistics',
                        desc: '查看各个组各个用户的工作情况统计',
                    },
                },
            }
        },
        methods: {
            handleTabClick(tab) {
                this.$router.push(this.tabs[tab].link)
            }
        },
        components: {
            layout: require('../common/layout').default,
        }
    }
</script>

<style lang="less">

</style>