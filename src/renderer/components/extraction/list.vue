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
                <i-form label-position="top" v-model="form">
                    <row :gutter="24">
                        <i-col :span="6">
                            <form-item label="采集时间">
                                <DatePicker type="daterange"
                                            :options="datepickerOptions"
                                            placement="bottom-start"
                                            split-panels
                                            placeholder="选择日期范围"
                                            style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col :span="6">
                            <form-item label="选择状态">
                                <i-select v-model="form.selected">
                                    <i-option value=""></i-option>
                                    <i-option value="1">已选</i-option>
                                    <i-option value="0">未选</i-option>
                                </i-select>
                            </form-item>
                        </i-col>
                        <i-col :span="6">
                            <form-item label="原文语种">
                                <i-select v-model="form.language">
                                    <i-option value=""></i-option>
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
                                         v-model="form.keyword"
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
                        <Dropdown placement="bottom-start" trigger="click">
                            <Button>
                                批量...
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem>标记已读</DropdownItem>
                                <DropdownItem>选择</DropdownItem>
                                <DropdownItem>取消选择</DropdownItem>
                                <DropdownItem divided>删除</DropdownItem>
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
                    <div class="ivu-table-wrapper ivu-table ivu-table-default" style="">
                        <Spin fix v-if="loading"></Spin>
                        <table style="width: 100%; border: 0;" cellspacing="0" cellpadding="0">
                            <thead>
                            <tr>
                                <th class="ivu-table-cell ivu-table-column-center" style="width: 50px">
                                    <checkbox ></checkbox>
                                </th>
                                <th class="ivu-table-cell" >标题/摘要</th>
                                <th class="ivu-table-cell" style="width: 150px">来源</th>
                                <th class="ivu-table-cell ivu-table-column-center" style="width: 150px">采集时间</th>
                                <th class="ivu-table-cell ivu-table-column-center" style="width: 200px">操作</th>
                            </tr>
                            </thead>
                            <tbody class="ivu-table-tbody">
                            <tr v-if="listRecords.data.length === 0">
                                <td class="ivu-table-column-center" colspan="5">当前条件下没有数据</td>
                            </tr>
                            <tr v-for="(article, key) in listRecords.data"
                                @mouseenter="$set(article, '_showAction', true)"
                                @mouseleave="$set(article, '_showAction', false)"
                                :key="key">
                                <td class="ivu-table-cell ivu-table-column-center">
                                    <checkbox ></checkbox>
                                </td>
                                <td class="ivu-table-cell">{{article.Article_Title}}</td>
                                <td class="ivu-table-cell">{{article.Article_Source}}</td>
                                <td class="ivu-table-cell ivu-table-column-center">{{article.Extracted_Time}}</td>
                                <td class="ivu-table-cell ivu-table-column-center">
                                    <ButtonGroup
                                                 v-if="article._showAction">
                                        <Button icon="md-eye"></Button>
                                        <Button icon="md-checkmark"></Button>
                                        <Button icon="md-trash"></Button>
                                    </ButtonGroup>
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
                              show-elevator
                              placement="top"
                              show-sizer/>
                    </div>
                </div>
            </card>
        </div>
    </layout>
</template>

<script>
    export default {
        data () {
            return {
                loading: false,
                form: {
                    extracted_time: '',
                    selected: '',
                    language: '',
                    keyword: '',
                    page_no: '',
                    page_size: '',
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
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '昨天',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近 7 天',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        }
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
                        render(h, params) {
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
        mounted () {
            this.doQuery()
        },
        methods: {
            doQuery(reset = true) {

                this.$api.extraction.list(this.form).then(resp => {
                    console.log(resp.data)
                })
            }
        },
        components: {
            layout: require('../common/layout').default
        }
    }
</script>

<style lang="less">

</style>