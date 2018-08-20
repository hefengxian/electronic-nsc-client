<template>
    <div>
        <div class="nsc-body-right-nav">
            <div class="nsc-body-right-nav-left">
                <Breadcrumb>
                    <BreadcrumbItem to="/audit"><icon type="md-create"></icon> 待编库</BreadcrumbItem>
                </Breadcrumb>
            </div>
            <div class="nsc-body-right-nav-right"></div>
        </div>

        <card dis-hover
              class="nsc-form"
              :bordered="false">
            <i-form @submit.native.prevent label-position="top"
                    v-model="form">
                <row :gutter="24">
                    <i-col :span="4">
                        <form-item label="状态">
                            <i-select v-model="form.Translate_Status"
                                      clearable
                                      @on-change="doQuery()">
                                <i-option value="RF">待编辑</i-option>
                                <i-option value="AW">编辑中</i-option>
                                <i-option value="AF">已编辑</i-option>
                            </i-select>
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
                        <form-item label="工作组">
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
                            <th class="ivu-table-cell ivu-table-column-center" style="width: 180px">入库时间</th>
                            <th class="ivu-table-cell">译文标题</th>
                            <th class="ivu-table-cell" style="width: 180px">翻译员</th>
                            <th class="ivu-table-cell" style="width: 180px">校对员</th>
                            <th class="ivu-table-cell" style="width: 180px">编辑</th>
                            <th class="ivu-table-cell ivu-table-column-center" style="width: 180px">操作</th>
                        </tr>
                        </thead>
                        <tbody class="ivu-table-tbody">
                        <tr v-if="listRecords.list.length === 0">
                            <td class="ivu-table-column-center" colspan="5">当前条件下没有数据</td>
                        </tr>
                        <tr v-for="(article, key) in listRecords.list"
                            :key="key">
                            <td class="ivu-table-cell ivu-table-column-center">
                                <!-- 入库时间 -->
                                <span>{{calcPassTime(article)}}</span>
                                <br>
                                <span>{{article['Review_End_Time']}}</span>
                            </td>

                            <!-- 标题、摘要 -->
                            <td class="ivu-table-cell article-info">
                                <router-link @click.native="handleDetailLinkClick(article)"
                                             :to="`/audit/detail/${article.Article_Translate_ID}`">
                                    <p class="ivu-table-cell-ellipsis">
                                        <b>{{article.Review_Title}}</b>
                                    </p>
                                </router-link>
                            </td>

                            <!-- 翻译员 -->
                            <td class="ivu-table-cell">{{article.Translate_User_Name}}</td>

                            <!-- 校对员 -->
                            <td class="ivu-table-cell">{{article.Review_User_Name}}</td>

                            <!-- 编辑 -->
                            <td class="ivu-table-cell">{{article.Audit_User_Name}}</td>

                            <!-- 操作 -->
                            <td class="ivu-table-cell ivu-table-column-center">
                                <div>
                                    <i-button size="small"
                                              v-if="article.Translate_Status === 'RF'"
                                              title="开始编辑"
                                              @click="startAudit(article)"
                                              icon="md-create">开始编辑
                                    </i-button>
                                    <i-button size="small"
                                              v-if="article.Translate_Status === 'AW'"
                                              title="正在编辑"
                                              :disabled="cu.User_ID !== article.Audit_User_ID"
                                              type="info"
                                              @click="$router.push(`/audit/audit/${article['Article_Translate_ID']}`)"
                                              icon="md-lock">正在编辑
                                    </i-button>
                                    <i-button size="small"
                                              v-if="article.Translate_Status === 'AF'"
                                              title="编辑完成"
                                              @click="$router.push(`/audit/audit/${article['Article_Translate_ID']}`)"
                                              :disabled="cu.User_ID !== article.Audit_User_ID"
                                              type="success"
                                              icon="md-checkmark"> 编辑完成
                                    </i-button>
                                </div>
                            </td>
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

    const DATE_FORMAT = 'YYYY/MM/DD'
    moment.locale('zh-cn')

    export default {
        data() {
            return {
                cu: this.$localStore.getItem(this.$localStore.Keys.USER_KEY),   // 当前登录用户
                loading: false,
                pageSizeOptions: [10, 20, 50, 100],
                checkAll: false,
                moment,
                form: {
                    Translate_Status: 'RF',
                    Raw_Language_Code: '',
                    User_ID: '',
                    Group_ID: '',
                    keyword: '',
                    page_no: 1,
                    page_size: 10,
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
        computed: {},
        created() {
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
            doQuery(reset = true) {
                if (reset) {
                    this.form.page_no = 1
                }

                let params = {...this.form}
                this.loading = true
                this.$api.audit.articles(params).then(resp => {
                    this.loading = false
                    this.listRecords = resp.data
                })
            },


            /**
             * 处理分页控件的分页大小改变事件
             *
             * @param {int} size 分页大小
             */
            doPageSizeChange(size) {
                this.form.page_size = size
                this.doQuery(false)
            },

            /**
             * 处理分页控件的翻页
             *
             * @param {int} current 当前页码
             */
            doPageChange(current) {
                this.form.page_no = current
                this.doQuery(false)
            },


            /**
             * 处理点击详情链接
             *
             * @param {object} article 当前点击的文章
             */
            handleDetailLinkClick(article) {
            },


            /**
             * 计算入库时间
             *
             * @param {object} article 当前文章
             * @returns {string}
             */
            calcPassTime(article) {
                return moment(article['Review_End_Time'], 'YYYY-MM-DD HH:mm:ss').fromNow()
            },


            /**
             * 处理点击开始编辑的按钮
             *
             * @param {object} article 当前文章
             */
            startAudit(article) {
                let params = {
                    Article_Translate_ID: article.Article_Translate_ID,
                    Translate_Status: 'AW',
                }
                this.$api.audit.status(params).then(resp => {
                    let data = resp.data
                    if (data.error) {
                        this.$Message.error(data.error.message)
                    } else {
                        // 跳转到翻译界面
                        this.$router.push(`/audit/audit/${params.Article_Translate_ID}`)
                    }
                }).catch(err => {

                })
            },

            /**
             * 获取用户列表，Select 控件使用
             *
             * @param keyword
             */
            getUserList(keyword) {
                this.userListLoading = true
                this.$api.system.users({keyword}).then(resp => {
                    this.userListLoading = false
                    this.users = resp.data.list
                })
            },

        },
        components: {
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.doQuery(false)
            })
        },
    }
</script>

<style lang="less">

</style>
