<template>
    <layout>
        <div slot="body-right">
            <div style="padding: 16px 0;">
                <Breadcrumb>
                    <BreadcrumbItem><icon type="ios-analytics"></icon> 主页</BreadcrumbItem>
                </Breadcrumb>
            </div>

            <row :gutter="16" style="color: #fff; text-align: center;">
                <i-col :span="4" v-for="(stat, key) in personalStats" :key="key">
                    <card dis-hover
                          :bordered="false"
                          :style="{'background-color': stat.color}">
                        <div>
                            <h1>0</h1>
                            <p><icon :type="stat.icon"></icon> {{stat.label}}</p>
                        </div>
                    </card>
                </i-col>
            </row>
        </div>
    </layout>
</template>

<script>
    export default {
        name: "dashboard",
        data() {
            return {
                personalStats: [
                    {
                        code: '',
                        label: '今日总采集/添加文章',
                        icon: 'md-download',
                        color: '#34495E'
                    },
                    {
                        code: '',
                        label: '今日选择',
                        icon: 'md-checkbox',
                        color: '#27C24C'
                    },
                    {
                        code: '',
                        label: '待译文章',
                        icon: 'md-swap',
                        color: '#F05050'
                    },
                    {
                        code: '',
                        label: '待校文章',
                        icon: 'md-done-all',
                        color: '#1ABC9C'
                    },
                    {
                        code: '',
                        label: '待编文章',
                        icon: 'ios-create',
                        color: '#7266ba'
                    },
                    {
                        code: '',
                        label: '成稿文章',
                        icon: 'md-filing',
                        color: '#23b7e5'
                    },
                ]
            }
        },
        components: {
            layout: require('../common/layout').default
        }
    }
</script>

<style lang="less">

</style>