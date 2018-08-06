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
                            <p style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden"><icon :type="stat.icon"></icon> {{stat.label}}</p>
                        </div>
                    </card>
                </i-col>
            </row>

            <row :gutter="16" class="margin-top-24">
                <i-col :span="16">
                    <card dis-hover
                          :bordered="false">
                        <div id="trend" style="height: 300px;">

                        </div>
                    </card>
                </i-col>
                <i-col :span="8">
                    <card dis-hover
                          :bordered="false">
                        <div id="pie">

                        </div>
                    </card>
                </i-col>
            </row>
        </div>
    </layout>
</template>

<script>
    import echarts from 'echarts'

    export default {
        name: "dashboard",
        data() {
            return {
                personalStats: [
                    {
                        code: 'Extract_Count',
                        label: '今日总采集/添加文章',
                        icon: 'md-download',
                        color: '#34495E'
                    },
                    {
                        code: 'Select_Count',
                        label: '今日选择',
                        icon: 'md-checkbox',
                        color: '#27C24C'
                    },
                    {
                        code: 'Trans_Count',
                        label: '待译文章',
                        icon: 'md-swap',
                        color: '#F05050'
                    },
                    {
                        code: 'Review_Count',
                        label: '待校文章',
                        icon: 'md-done-all',
                        color: '#1ABC9C'
                    },
                    {
                        code: 'Audit_Count',
                        label: '待编文章',
                        icon: 'ios-create',
                        color: '#7266ba'
                    },
                    {
                        code: 'Finish_Count',
                        label: '成稿文章',
                        icon: 'md-filing',
                        color: '#23b7e5'
                    },
                ],
                opData: {
                    Extract_Count: 0,
                    Select_Count: 0,
                    Trans_Count: 0,
                    Review_Count: 0,
                    Audit_Count: 0,
                    Finish_Count: 0,
                },
                extra7Day: [],
                summary7Day: []
            }
        },
        mounted() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('trend'));
            // 绘制图表
            myChart.setOption({
                title: {
                    text: 'ECharts 入门示例'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {readOnly: false},
                        magicType: {type: ['line', 'bar']},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'line',
                    data: [5, 20, 36, 10, 10, 20],
                    markPoint: {
                        data: [
                            {name: '周最低', type: 'min'},
                            {name: '周最高', type: 'max'},
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'},
                        ]
                    }
                }]
            });
        },
        components: {
            layout: require('../common/layout').default
        }
    }
</script>

<style lang="less">

</style>