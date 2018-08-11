<template>
    <layout>
        <div slot="nav-left">
            <Breadcrumb>
                <BreadcrumbItem>
                    <icon type="ios-analytics"></icon>
                    主页
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div slot="body-right">
            <row :gutter="16" style="color: #fff; text-align: center;">
                <i-col :span="4" v-for="(stat, key) in personalStats" :key="key">
                    <card dis-hover
                          :bordered="false"
                          :style="{'background-color': stat.color}">
                        <div>
                            <h1>{{opData[stat.code]}}</h1>
                            <p style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden">
                                <icon :type="stat.icon"></icon>
                                {{stat.label}}
                            </p>
                        </div>
                    </card>
                </i-col>
            </row>

            <row :gutter="16" class="margin-top-24">
                <i-col :span="16">
                    <card dis-hover
                          :bordered="false">
                        <b slot="title">最近7天处理文章趋势（采集包括新建）</b>
                        <div id="trend" style="height: 300px;">

                        </div>
                    </card>
                </i-col>
                <i-col :span="8">
                    <card dis-hover
                          :bordered="false">
                        <strong slot="title">各项操作占比</strong>
                        <div id="percent" style="height: 300px"></div>
                    </card>
                </i-col>
            </row>
        </div>
    </layout>
</template>

<script>
    import echarts from 'echarts'
    import 'echarts/theme/roma'

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
            let trendChart = echarts.init(document.getElementById('trend'), 'roma');
            let percentChart = echarts.init(document.getElementById('percent'), 'roma');
            trendChart.showLoading()
            percentChart.showLoading()
            this.$api.dashboard.operationData().then(resp => {
                this.opData = resp.data
                percentChart.hideLoading()
                this.initOperationPercentChart(percentChart)
            })
            this.$api.dashboard.recentSummary().then(resp => {
                this.summary7Day = resp.data
                trendChart.hideLoading()
                this.initTrendChart(trendChart)
            })
        },
        methods: {
            initTrendChart(chart) {
                // 基于准备好的dom，初始化echarts实例
                let xAxisData = [],
                    markPoint = {
                        data: [
                            {name: '周最低', type: 'min'},
                            {name: '周最高', type: 'max'},
                        ]
                    },
                    markLine = {
                        data: [
                            {type: 'average', name: '平均值'},
                        ]
                    },
                    seriesExtract = {
                        name: '采集数量',
                        type: 'line',
                        data: [],
                        markLine,
                        markPoint,
                    },
                    seriesFinish = {
                        name: '成稿数量',
                        type: 'line',
                        data: [],
                        markLine,
                        markPoint,
                    }

                this.summary7Day.forEach((v, k) => {
                    xAxisData.push(v['Date']);
                    seriesExtract.data.push(v['Extract_Count']);
                    seriesFinish.data.push(v['Finish_Count']);
                })

                // 绘制图表
                chart.setOption({
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
                        data: xAxisData,
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    yAxis: {},
                    series: [seriesExtract, seriesFinish]
                });
            },

            initOperationPercentChart(chart) {
                let data = this.opData;
                let pOpts = {
                    title: {
                        subtext: '',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
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
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['待译数量', '待校数量', '待编数量', '成稿数量']
                    },
                    series: [
                        {
                            name: `今日操作数据`,
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                {value: Number(data['Trans_Count']), name: '待译数量'},
                                {value: Number(data['Review_Count']), name: '待校数量'},
                                {value: Number(data['Audit_Count']), name: '待编数量'},
                                {value: Number(data['Finish_Count']), name: '成稿数量'},
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };

                chart.setOption(pOpts);
            },
        },
        components: {
            layout: require('../common/layout').default
        }
    }
</script>

<style lang="less">

</style>