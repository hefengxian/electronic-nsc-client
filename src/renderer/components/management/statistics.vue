<template>
    <div>
        <!-- 表单 -->
        <card dis-hover :bordered="false" class="margin-top-16">
            <i-form label-position="top"
                    v-model="form">
                <row :gutter="24">
                    <i-col :span="6">
                        <form-item label="操作时间">
                            <DatePicker type="daterange"
                                        :options="datePickerOptions"
                                        v-model="form.Stat_Date"
                                        :clearable="false"
                                        @on-change="handleDatePickerChange"
                                        format="yyyy/MM/dd"
                                        placement="bottom-start"
                                        split-panels
                                        placeholder="选择日期范围"
                                        style="width: 100%;"></DatePicker>
                        </form-item>
                    </i-col>
                    <i-col :span="6">
                        <form-item label="用户组">
                            <i-select v-model="form.Group_ID"
                                      clearable
                                      @on-change="doQuery()">
                                <i-option v-for="(group, key) in groups"
                                          :key="key"
                                          :label="group.Work_Group_Name"
                                          :value="group.Work_Group_ID">
                                </i-option>
                            </i-select>
                        </form-item>
                    </i-col>
                </row>
            </i-form>
        </card>

        <!-- 内容 -->
        <card dis-hover :bordered="false" class="margin-top-16 nsc-list">
            <div class="nsc-list-body margin-top-8 margin-bottom-8">
                <i-table :loading="loading"
                         :data="listRecords.list"
                         :columns="columns"></i-table>
            </div>
            <div class="nsc-list-footer">
                <div class="nsc-list-footer-left"></div>
                <div class="nsc-list-footer-right">
                    <Page :total="listRecords.total"
                          style="font-size: 12px;"
                          :current="form.page_no"
                          :page-size="form.page_size"
                          :page-size-opts="pageSizeOptions"
                          @on-change="doPageChange"
                          @on-page-size-change="doPageSizeChange"
                          placement="top"
                          show-elevator
                          show-total
                          show-sizer/>
                </div>
            </div>
        </card>
    </div>
</template>
<style>
</style>
<script>
    import datePickerOptions from '../common/date-picker-options'
    import moment from 'moment'

    const DATE_FORMAT = 'YYYY/MM/DD'
    moment.locale('zh-cn')
    export default {
        data() {

            let startTime = new Date()
            startTime.setTime(startTime - 3600 * 1000 * 24 * 6)
            return {
                cu: this.$localStore.getItem(this.$localStore.Keys.USER_KEY),   // 当前登录用户
                pageSizeOptions: [10, 20, 50, 100],
                form: {
                    Stat_Date: [startTime, new Date()],
                    Group_ID: '',
                    page_no: 1,
                    page_size: 10,
                },
                datePickerOptions,
                groups: [],
                listRecords: {
                    list: [],
                    total: 0
                },
                loading: false,
                columns: [
                    {
                        title: '名称',
                        key: 'User_Name',
                    },
                    {
                        title: '选稿篇数',
                        key: 'Selected_Count',
                    },
                    {
                        title: '翻译字数',
                        key: 'Translate_Character_Count',
                    },
                    {
                        title: '校对字数',
                        key: 'Review_Character_Count',
                    },
                    {
                        title: '编辑字数',
                        key: 'Audit_Character_Count',
                    },
                ],
            }
        },
        created() {
            Promise.all([
                this.$api.system.groups(),
            ]).then(resp => {
                this.groups = resp[0].data
            })
        },
        methods: {
            /**
             * 查询列表
             *
             * @param {boolean} reset 是否重置分页
             */
            doQuery (reset = true) {
                if (reset) {
                    this.form.page_no = 1
                }

                let params = {...this.form}

                // 处理时间
                if (params.Stat_Date.length === 2) {
                    params.Stat_Date = params.Stat_Date.map(v => {
                        return (v instanceof Date) ? moment(v).format(DATE_FORMAT) : v
                    }).join('-')
                }

                this.loading = true
                this.$api.management.stat.list(params).then(resp => {
                    this.loading = false
                    this.listRecords = resp.data
                })
            },

            /**
             * 处理分页控件的分页大小改变事件
             *
             * @param {int} size 分页大小
             */
            doPageSizeChange (size) {
                this.form.page_size = size
                this.doQuery(false)
            },

            /**
             * 处理分页控件的翻页
             *
             * @param {int} current 当前页码
             */
            doPageChange (current) {
                this.form.page_no = current
                this.doQuery(false)
            },

            /**
             * 处理日期控件的变化事件
             *
             * @param {array|string} date 改变的日期
             * @param {string} type 类型
             */
            handleDatePickerChange (date, type) {
                this.form.Stat_Date = date
                this.doQuery(true)
            },
        },
        components: {},
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.doQuery()
            })
        }
    }
</script>