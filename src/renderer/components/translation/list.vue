<template>
    <div>
        <div class="nsc-body-right-nav">
            <div class="nsc-body-right-nav-left">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <icon type="md-swap"></icon>
                        待译库
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
                        <form-item label="状态">
                            <i-select v-model="form.Translate_Status"
                                      clearable
                                      @on-change="doQuery()">
                                <i-option value="TN">待翻译</i-option>
                                <i-option value="TW">翻译中</i-option>
                                <i-option value="TF">已翻译</i-option>
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
                        <form-item label="用户组">
                            <i-select v-model="form.Translate_User_Group_ID"
                                      clearable
                                      @on-change="doQuery()">
                                <i-option value="">&nbsp;</i-option>
                            </i-select>
                        </form-item>
                    </i-col>
                    <i-col :span="4">
                        <form-item label="翻译人员">
                            <i-select v-model="form.Translate_User_ID"
                                      clearable
                                      @on-change="doQuery()">
                                <i-option value="">&nbsp;</i-option>
                            </i-select>
                        </form-item>
                    </i-col>
                    <i-col :span="8">
                        <form-item label="关键词">
                            <i-input placeholder="关键词：标题、摘要、作者"
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
                            <th class="ivu-table-cell ivu-table-column-center" style="width: 150px">入库时间</th>
                            <th class="ivu-table-cell ivu-table-column-center" style="width: 80px">时限</th>
                            <th class="ivu-table-cell">标题/摘要</th>
                            <th class="ivu-table-cell" style="width: 150px">翻译员</th>
                            <th class="ivu-table-cell ivu-table-column-center" style="width: 150px">操作</th>
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
                                <span :style="getTimeoutStyle(article)">{{calcPassTime(article)}}</span>
                                <br>
                                <span>{{article['Selected_Time']}}</span>
                            </td>

                            <!-- 时限 -->
                            <td class="ivu-table-cell ivu-table-column-center">{{calcTime(article)}}</td>

                            <!-- 标题、摘要 -->
                            <td class="ivu-table-cell article-info">
                                <router-link @click.native="handleDetailLinkClick(article)"
                                             :to="`/translation/detail/${article.Article_Translate_ID}`">
                                    <p class="ivu-table-cell-ellipsis">
                                        <b>{{article.Article_Title}}</b>
                                        <span v-if="typeof article.Article_Abstract === 'string' && article.Article_Abstract.trim().length > 0"
                                              class="text-muted">&nbsp;- &nbsp;{{article.Article_Abstract.trim()}}</span>
                                    </p>
                                </router-link>
                            </td>

                            <!-- 翻译员 -->
                            <td class="ivu-table-cell">{{article.Translate_User_Name}}</td>

                            <!-- 操作 -->
                            <td class="ivu-table-cell ivu-table-column-center">
                                <div>
                                    <i-button size="small"
                                              v-if="article.Translate_Status == 'TN'"
                                              title="开始翻译"
                                              @click="startTranslate(article)"
                                              icon="md-swap">开始翻译</i-button>
                                    <i-button size="small"
                                              v-if="article.Translate_Status == 'TW'"
                                              title="正在翻译"
                                              :disabled="cu.User_ID != article.Translate_User_ID"
                                              type="info"
                                              @click="$router.push(`/translation/translate/${article['Article_Translate_ID']}`)"
                                              icon="md-lock">正在翻译</i-button>
                                    <i-button size="small"
                                              v-if="['TF','AW','AF','RW','RF'].indexOf(article.Translate_Status) > -1"
                                              title="翻译完成"
                                              @click="$router.push(`/translation/translate/${article['Article_Translate_ID']}`)"
                                              :disabled="cu.User_ID != article.Translate_User_ID || article.Translate_Status != 'TF'"
                                              type="success"
                                              icon="md-checkmark"> 翻译完成</i-button>
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
        data () {
            return {
                cu: this.$localStore.getItem(this.$localStore.Keys.USER_KEY),   // 当前登录用户
                loading: false,
                pageSizeOptions: [10, 20, 50, 100],
                checkAll: false,
                moment,
                form: {
                    Translate_Status: 'TN',
                    Raw_Language_Code: '',
                    Translate_User_ID: '',
                    Translate_User_Group_ID: '',
                    keyword: '',
                    page_no: 1,
                    page_size: 10,
                },
                languages: [],
                users: [],
                groups: [],
                listRecords: {
                    list: [],
                    total: 0
                }
            }
        },
        computed: {
        },
        mounted () {
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
                this.loading = true
                this.$api.translation.articles(params).then(resp => {
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
             * 处理点击详情链接
             *
             * @param {object} article 当前点击的文章
             */
            handleDetailLinkClick (article) {
            },


            /**
             * 计算入库时间
             *
             * @param {object} article 当前文章
             * @returns {string}
             */
            calcPassTime (article) {
                return moment(article['Selected_Time'], 'YYYY-MM-DD HH:mm:ss').fromNow()
            },

            /**
             * 给定秒数，计算多少天，多少小时，多少分钟
             *
             * @param {object} article 秒数
             * @returns {string}
             */
            calcTime (article) {
                let seconds = article['Translate_Plan_End_Time']
                let duration = moment.duration(Number(seconds), 'seconds')
                let result = ''
                if (duration.days() > 0) {
                    result += `${duration.days()}天`
                }
                if (duration.hours() > 0) {
                    result += `${duration.hours()}小时`
                }
                if (duration.minutes() > 0) {
                    result += `${duration.minutes()}分钟`
                }
                return result
            },

            /**
             * 获取是否超时的颜色
             *
             * @param {object} article
             * @returns {{color: string}}
             */
            getTimeoutStyle (article) {
                let selectTime = moment(article['Selected_Time'], 'YYYY-MM-DD HH:mm:ss')
                let durationSeconds = moment().diff(selectTime, 'seconds')
                let isTimeout = article['Translate_Plan_End_Time'] < durationSeconds
                return {
                    color: isTimeout ? '#ed4014' : '#19be6b',
                }
            },

            /**
             * 处理点击开始翻译的按钮
             *
             * @param {object} article 当前文章
             */
            startTranslate(article) {
                let params = {
                    Article_Translate_ID: article.Article_Translate_ID,
                    Translate_Status: 'TW',
                }
                this.$api.translation.status(params).then(resp => {
                    let data = resp.data
                    if (data.error) {
                        this.$Message.error(data.error.message)
                    } else {
                        // 跳转到翻译界面
                        this.$router.push(`/translation/translate/${params.Article_Translate_ID}`)
                    }
                }).catch(err => {

                })
            }

        },
        components: {
            layout: require('../common/layout').default
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.$api.system.languages().then(resp => {
                    vm.languages = resp.data.list
                })
                vm.doQuery(false)
            })
        },
    }
</script>

<style lang="less">

</style>