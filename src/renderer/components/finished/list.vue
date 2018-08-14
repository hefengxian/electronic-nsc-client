<template>
    <div>
        <div class="nsc-body-right-nav">
            <div class="nsc-body-right-nav-left">
                <Breadcrumb>
                    <BreadcrumbItem to="/finished">
                        <icon type="md-filing"></icon>
                        成稿库
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>
            <div class="nsc-body-right-nav-right"></div>
        </div>

        <card dis-hover
              class="nsc-form"
              :bordered="false">
            <i-form label-position="top"
                    v-model="form">
                <row :gutter="24">
                    <i-col :span="4">
                        <form-item label="入库时间">
                            <DatePicker type="daterange"
                                        :options="datepickerOptions"
                                        v-model="form.Audit_End_Time"
                                        :clearable="false"
                                        @on-change="handleDatePickerChange"
                                        format="yyyy/MM/dd"
                                        placement="bottom-start"
                                        split-panels
                                        placeholder="选择日期范围"
                                        style="width: 100%;"></DatePicker>
                        </form-item>
                    </i-col>
                    <i-col :span="4">
                        <form-item label="原文语种">
                            <i-select v-model="form.Raw_Language_Code"
                                      clearable
                                      filterable
                                      placeholder="选择或者键入关键词过滤"
                                      @on-change="doQuery()">
                                <i-option v-for="(lan, key) in languages"
                                          :key="key"
                                          :label="lan.Raw_Language_Name_CN"
                                          :value="lan.Raw_Language_Code">
                                    <span>{{lan.Raw_Language_Name_CN}}</span>
                                    <span style="color:#ccc"> - {{lan.Raw_Language_Code}} - {{lan.Raw_Language_Name_EN}} - {{lan.Raw_Language_Name_Local}}</span>
                                </i-option>
                            </i-select>
                        </form-item>
                    </i-col>
                    <i-col :span="4">
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
                    <i-col :span="4">
                        <form-item label="翻译/校对/编辑人员">
                            <i-select v-model="form.User_ID"
                                      clearable
                                      filterable
                                      placeholder="键入关键词过滤"
                                      remote
                                      :loading="userListLoading"
                                      :remote-method="getUserList"
                                      @on-change="doQuery()">
                                <i-option v-for="(user, key) in users"
                                          :key="key"
                                          :label="user.User_Name"
                                          :value="user.User_ID">
                                </i-option>
                            </i-select>
                        </form-item>
                    </i-col>
                    <i-col :span="8">
                        <form-item label="关键词">
                            <i-input placeholder="关键词：校对后标题、校对后正文中搜索"
                                     @on-search="doQuery()"
                                     v-model="form.keyword"
                                     clearable
                                     search></i-input>
                        </form-item>
                    </i-col>
                </row>
            </i-form>
        </card>

        <card dis-hover
              class="nsc-list margin-top-16"
              :bordered="false">
            <div class="nsc-list-header">
                <div class="nsc-list-header-left">
                    <Dropdown placement="bottom-start"
                              trigger="click">
                        <Button :disabled="selected.length < 1">
                            批量...
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem @click.native="handleExportAction('txt')">导出 TXT</DropdownItem>
                            <!--<DropdownItem @click.native="handleExportAction('excel')">导出 Excel</DropdownItem>-->
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div class="nsc-list-header-right">
                </div>
            </div>
            <div class="nsc-list-body margin-top-8 margin-bottom-8">
                <div class="ivu-table-wrapper ivu-table ivu-table-default" style="">
                    <Spin fix v-if="loading"></Spin>
                    <table style="width: 100%; border: 0;" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th class="ivu-table-cell ivu-table-column-center" style="width: 50px">
                                <checkbox v-model="checkAll"
                                          @on-change="handleCheckAllChange"></checkbox>
                            </th>
                            <th class="ivu-table-cell ivu-table-column-center" style="width: 150px">入库时间</th>
                            <th class="ivu-table-cell">译文标题</th>
                            <th class="ivu-table-cell" style="width: 150px">翻译员</th>
                            <th class="ivu-table-cell" style="width: 150px">校对员</th>
                            <th class="ivu-table-cell" style="width: 150px">编辑</th>
                        </tr>
                        </thead>
                        <tbody class="ivu-table-tbody">
                        <tr v-if="listRecords.list.length === 0">
                            <td class="ivu-table-column-center" colspan="5">当前条件下没有数据</td>
                        </tr>
                        <tr v-for="(article, key) in listRecords.list"
                            :key="key">
                            <td class="ivu-table-cell ivu-table-column-center">
                                <checkbox v-model="article._checked"></checkbox>
                            </td>

                            <td class="ivu-table-cell ivu-table-column-center">
                                <!-- 入库时间 -->
                                <span>{{calcPassTime(article)}}</span>
                                <br>
                                <span>{{article['Audit_End_Time']}}</span>
                            </td>

                            <!-- 标题、摘要 -->
                            <td class="ivu-table-cell article-info">
                                <router-link :to="`/finished/detail/${article.Article_Translate_ID}`">
                                    <p class="ivu-table-cell-ellipsis">
                                        <b>{{article.Translate_Title}}</b>
                                    </p>
                                </router-link>
                            </td>

                            <!-- 翻译员 -->
                            <td class="ivu-table-cell">{{article.Translate_User_Name}}</td>

                            <!-- 校对员 -->
                            <td class="ivu-table-cell">{{article.Review_User_Name}}</td>

                            <!-- 编辑 -->
                            <td class="ivu-table-cell">{{article.Audit_User_Name}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

            </div>
            <div class="nsc-list-footer">
                <div class="nsc-list-footer-left">
                </div>
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

<script>
    import moment from 'moment'
    import Qs from 'query-string'

    const DATE_FORMAT = 'YYYY/MM/DD'
    moment.locale('zh-cn')

    export default {
        data () {
            return {
                cu: this.$localStore.getItem(this.$localStore.Keys.USER_KEY),   // 当前登录用户
                loading: false,
                pageSizeOptions: [10, 20, 50, 100],
                checkAll: false,
                moment,
                form: {
                    Audit_End_Time: [new Date(), new Date()],
                    Raw_Language_Code: '',
                    User_ID: '',
                    Group_ID: '',
                    keyword: '',
                    page_no: 1,
                    page_size: 10,
                },
                datepickerOptions: {
                    shortcuts: [
                        {
                            text: '今天',
                            value () {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime())
                                return [start, end]
                            }
                        },
                        {
                            text: '昨天',
                            value () {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24)
                                end.setTime(start.getTime())
                                return [start, end];
                            }
                        },
                        {
                            text: '最近 7 天',
                            value () {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
                                return [start, end]
                            }
                        },
                        {
                            text: '最近 30 天',
                            value () {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                                return [start, end]
                            }
                        },
                    ]
                },
                languages: [],
                // User Loading
                userListLoading: false,
                users: [],
                groups: [],
                listRecords: {
                    list: [],
                    total: 0
                }
            }
        },
        computed: {
            selected () {
                return this.listRecords.list.filter(v => v._checked)
            }
        },
        created () {
            Promise.all([
                this.$api.system.languages(),
                this.$api.system.groups(),
                this.$api.system.users(),
            ]).then(resp => {
                this.languages = resp[0].data.list
                this.groups = resp[1].data
                this.users = resp[2].data.list
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
                if (params.Audit_End_Time.length === 2) {
                    params.Audit_End_Time = params.Audit_End_Time.map(v => {
                        return (v instanceof Date) ? moment(v).format(DATE_FORMAT) : v
                    }).join('-')
                }

                this.loading = true
                this.$api.finished.articles(params).then(resp => {
                    this.loading = false
                    let data = resp.data
                    data.list = data.list.map(v => {
                        v._checked = false
                        return v
                    })
                    this.listRecords = data
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
                this.form.Audit_End_Time = date
                this.doQuery(true)
            },


            /**
             * 处理表头的全选 Checkbox 变化事件
             *
             * @param {boolean} status 当前的状态
             */
            handleCheckAllChange (status) {
                this.listRecords.list = this.listRecords.list.map(v => {
                    v._checked = status
                    return v
                })
            },


            /**
             * 计算入库时间
             *
             * @param {object} article 当前文章
             * @returns {string}
             */
            calcPassTime (article) {
                return moment(article['Audit_End_Time'], 'YYYY-MM-DD HH:mm:ss').fromNow()
            },

            /**
             * 获取用户列表，Select 控件使用
             *
             * @param keyword
             */
            getUserList (keyword) {
                this.userListLoading = true
                this.$api.system.users({keyword}).then(resp => {
                    this.userListLoading = false
                    this.users = resp.data.list
                })
            },

            handleExportAction (type) {
                let ids = this.selected.map(v => v.Article_Translate_ID)
                let params = {ids: ids.join(','),type}
                let url = `${window.BASE_URL}/public/export?${Qs.stringify(params)}`
                location.href = url
            }
        },
        components: {},
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.doQuery(false)
            })
        },
    }
</script>

<style lang="less">

</style>