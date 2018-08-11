<template>
    <layout>
        <div slot="nav-left">
            <Breadcrumb>
                <BreadcrumbItem>
                    <icon type="md-download"></icon>
                    采集库
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div slot="body-right">
            <card dis-hover
                  class="nsc-form"
                  :bordered="false">
                <i-form label-position="top"
                        v-model="form">
                    <row :gutter="24">
                        <i-col :span="6">
                            <form-item label="采集时间">
                                <DatePicker type="daterange"
                                            :options="datepickerOptions"
                                            v-model="form.extracted_time"
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
                            <form-item label="选择状态">
                                <i-select v-model="form.selected"
                                          clearable
                                          @on-change="doQuery()">
                                    <i-option value="">&nbsp;</i-option>
                                    <i-option value="Y">已选</i-option>
                                    <i-option value="N">未选</i-option>
                                </i-select>
                            </form-item>
                        </i-col>
                        <i-col :span="6">
                            <form-item label="原文语种">
                                <i-select v-model="form.language"
                                          clearable
                                          @on-change="doQuery()">
                                    <i-option value="">&nbsp;</i-option>
                                    <i-option v-for="(lan, key) in languages"
                                              :key="key"
                                              :value="lan.value">{{lan.label}}
                                    </i-option>
                                </i-select>
                            </form-item>
                        </i-col>
                        <i-col :span="6">
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
                        <Dropdown placement="bottom-start"
                                  trigger="click">
                            <Button :disabled="selected.length < 1">
                                批量...
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem @click.native="handleBatchAction('read')">标记已读</DropdownItem>
                                <DropdownItem @click.native="handleBatchAction('select')">选择</DropdownItem>
                                <DropdownItem @click.native="handleBatchAction('unselect')">取消选择</DropdownItem>
                                <DropdownItem @click.native="handleBatchAction('delete')" divided>删除</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Button @click="$router.push('/create-article')">
                            <icon type="md-add"></icon>
                            新建文章
                        </Button>
                    </div>
                    <div class="nsc-list-header-right">
                    </div>
                </div>
                <div class="nsc-list-body margin-top-8 margin-bottom-8">
                    <!--<i-table :columns="columns"
                             :loading="loading"
                             :highlight-row
                             @on-current-change="handleCurrentChange"
                             :data="listRecords.list"></i-table><br> -->


                    <div class="ivu-table-wrapper ivu-table ivu-table-default" style="">
                        <Spin fix v-if="loading"></Spin>
                        <table style="width: 100%; border: 0;" cellspacing="0" cellpadding="0">
                            <thead>
                            <tr>
                                <th class="ivu-table-cell ivu-table-column-center" style="width: 50px">
                                    <checkbox v-model="checkAll"
                                              @on-change="handleCheckAllChange"></checkbox>
                                </th>
                                <th style="width: 12px"></th>
                                <th class="ivu-table-cell">标题/摘要</th>
                                <th class="ivu-table-cell" style="width: 120px">来源</th>
                                <th class="ivu-table-cell ivu-table-column-center" style="width: 150px">采集时间</th>
                                <th class="ivu-table-cell ivu-table-column-center" style="width: 150px">操作</th>
                            </tr>
                            </thead>
                            <tbody class="ivu-table-tbody">
                            <tr v-if="listRecords.list.length === 0">
                                <td class="ivu-table-column-center" colspan="6">当前条件下没有数据</td>
                            </tr>
                            <tr v-for="(article, key) in listRecords.list"
                                @mouseenter="$set(article, '_showAction', true)"
                                @mouseleave="$set(article, '_showAction', false)"
                                :class="getRowClasses(article)"
                                :key="key">
                                <td class="ivu-table-cell ivu-table-column-center">
                                    <checkbox v-model="article._checked"></checkbox>
                                </td>
                                <td class="article-info">
                                    <!--选择状态-->
                                    <icon v-if="article.Is_Selected === 1"
                                          type="md-checkmark"></icon>
                                </td>
                                <td class="ivu-table-cell ivu-table-cell-ellipsis article-info">
                                    <!-- 标题、摘要 -->
                                    <router-link :to="`detail/${article.Article_Detail_ID}`">
                                        <b>{{article.Article_Title}}</b>
                                        <span v-if="article.Article_Abstract !== null"
                                              class="text-muted">&nbsp;- &nbsp;{{article.Article_Abstract.trim()}}</span>
                                    </router-link>
                                </td>
                                <td class="ivu-table-cell ivu-table-cell-ellipsis article-info">
                                    <a :href="article.Article_URL" target="_blank" title="点击在新窗口打开原文">
                                        <icon type="ios-link"></icon>
                                        {{article.Article_Source}}
                                    </a>
                                </td>
                                <td class="ivu-table-cell ivu-table-column-center article-info">
                                    <span>{{article.Extracted_Time}}</span>
                                </td>
                                <td class="ivu-table-cell ivu-table-column-center">
                                    <div v-if="article._showAction">
                                        <Button size="small"
                                                title="标记已读"
                                                @click="doRead([article.Article_Detail_ID])"
                                                icon="md-eye"></Button>
                                        <Button size="small"
                                                v-show="article.Is_Selected !== 1"
                                                title="选择文章"
                                                @click="doSelect([article.Article_Detail_ID])"
                                                icon="md-checkmark"></Button>
                                        <Button size="small"
                                                v-show="article.Is_Selected == 1"
                                                title="取消选择"
                                                @click="doSelect([article.Article_Detail_ID], false)"
                                                icon="md-close"></Button>
                                        <Button size="small"
                                                title="删除文章"
                                                @click="doDelete([article.Article_Detail_ID])"
                                                icon="md-trash"></Button>
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
    </layout>
</template>

<script>
    import moment from 'moment'

    const DATE_FORMAT = 'YYYY/MM/DD'

    export default {
        data () {
            return {
                loading: false,
                pageSizeOptions: [10, 20, 50, 100],
                checkAll: false,
                form: {
                    extracted_time: [new Date(), new Date()],
                    selected: '',
                    language: '',
                    keyword: '',
                    page_no: 1,
                    page_size: 10,
                },
                languages: [
                    {
                        value: 'zh-cn',
                        label: '汉语',
                    },
                    {
                        value: 'en',
                        label: 'English',
                    },
                ],
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
                /*columns: [
                    {
                        type: 'selection',
                        width: 50,
                        align: 'center'
                    },
                    {
                        title: '标题/摘要',
                        key: 'Article_Title',
                        ellipsis: true,
                        render (h, params) {
                            return h('a', [
                                h('b', [
                                    `${params['row']['Article_Title']}`
                                ]),
                                h('span', [
                                    ` - ${params['row']['Article_Abstract']}`
                                ])
                            ])
                            // return `${params['row']['Article_Title']} - ${params['row']['Article_Abstract']}`
                        }
                    },
                    {
                        title: '来源',
                        width: 150,
                        key: 'Article_Source',
                    },
                    {
                        title: '采集时间',
                        width: 150,
                        key: 'Extracted_Time',
                    },
                    {
                        title: '操作',
                        width: 150,
                        render (h, params) {
                            return '...'
                        }
                    },
                ],*/
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
        mounted () {
            this.doQuery()
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
                if (params.extracted_time.length === 2) {
                    params.extracted_time = params.extracted_time.map(v => {
                        return (v instanceof Date) ? moment(v).format(DATE_FORMAT) : v
                    }).join('-')
                }

                this.loading = true
                this.$api.extraction.articles(params).then(resp => {
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
             * 批量操作的点击事件处理方法
             *
             * @param {string} type 类型，用来标记选择的是哪一项
             */
            handleBatchAction (type) {
                let ids = this.selected.map(v => v.Article_Detail_ID)

                switch (type) {
                    case 'read':
                        this.doRead(ids)
                        break;
                    case 'select':
                        this.doSelect(ids)
                        break;
                    case 'unselect':
                        this.doSelect(ids, false)
                        break;
                    case 'delete':
                        this.doDelete(ids)
                        break;
                }
                this.checkAll = false
            },

            /**
             * 标记文档已读
             *
             * @param {array} ids 要操作的文章 ID
             */
            doRead (ids) {
                if (ids.length < 1) {
                    this.$Message.info('请选择至少 1 条数据进行操作')
                    return
                }

                this.$api.extraction.read({ids: ids.join(',')}).then(resp => {
                })
                // 不等待操作结果，假定全部成功
                this.listRecords.list = this.listRecords.list.map(v => {
                    if (ids.indexOf(v.Article_Detail_ID) !== -1) {
                        v.Is_Read = 1
                    }
                    // 取消已经勾选的项目
                    v._checked = false
                    return v
                })
            },

            /**
             * 选择或者取消选择选定的文章
             *
             * @param {array} ids 要操作的文章 ID
             * @param {boolean} action true 表示选择，false 表示取消选择
             */
            doSelect (ids, action = true) {
                if (ids.length < 1) {
                    this.$Message.info('请选择至少 1 条数据进行操作')
                    return
                }

                this.$api.extraction.select({ids: ids.join(','), action: action ? 1 : 0}).then(resp => {
                })
                this.listRecords.list = this.listRecords.list.map(v => {
                    if (ids.indexOf(v.Article_Detail_ID) !== -1) {
                        v.Is_Selected = (action ? 1 : 0)
                        v.Is_Read = 1
                    }
                    // 取消已经勾选的项目
                    v._checked = false
                    return v
                })
            },

            /**
             * 删除选定的文章
             *
             * @param {array} ids 要操作的文章 ID
             */
            doDelete (ids) {
                if (ids.length < 1) {
                    this.$Message.info('请选择至少 1 条数据进行操作')
                    return
                }
                this.$Modal.error({
                    title: '删除文章',
                    content: `确定要删除这 ${ids.length} 篇文章`,
                    onOk: () => {
                        // delete from server
                        this.$api.extraction.remove({ids: ids.join(',')}).then(resp => {
                            this.doQuery()
                        })
                    }
                })
            },

            /**
             * 处理日期控件的变化事件
             *
             * @param {array|string} date 改变的日期
             * @param {string} type 类型
             */
            handleDatePickerChange (date, type) {
                this.form.extracted_time = date
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
             * 根据文章状态获取当前行的样式
             *
             * @param {object} article 文章信息
             * @returns {string[]}
             */
            getRowClasses (article) {
                if (article.Is_Selected === 1) {
                    return ['article-selected']
                }
                if (article.Is_Read === 1) {
                    return ['article-read']
                }
            }
        },
        components: {
            layout: require('../common/layout').default
        }
    }
</script>

<style lang="less">

</style>