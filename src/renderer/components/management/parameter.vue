<template>
    <div>
        <!-- 表单 -->
        <card dis-hover :bordered="false" class="margin-top-16">
            <i-form label-position="top"
                    v-model="form">
                <row :gutter="24">
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
                    <i-col :span="6">
                        <form-item label="角色">
                            <i-select v-model="form.Role_ID"
                                      clearable
                                      @on-change="doQuery()">
                                <i-option v-for="(role, key) in roles"
                                          :key="key"
                                          :label="role.Role_Name"
                                          :value="role.Role_ID">
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

        <!-- 内容 -->
        <card dis-hover :bordered="false" class="margin-top-16 nsc-list">
            <div class="nsc-list-header">
                <div class="nsc-list-header-left">
                    <button-group>
                        <i-button icon="md-person-add">添加</i-button>
                        <i-button icon="md-create">编辑</i-button>
                        <i-button icon="md-trash">删除</i-button>
                    </button-group>
                </div>
                <div class="nsc-list-header-right">
                </div>
            </div>

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
    export default {
        data() {
            return {
                pageSizeOptions: [10, 20, 50, 100],
                form: {
                    Group_ID: '',
                    Role_ID: '',
                    keyword: '',
                    page_no: 1,
                    page_size: 10,
                },
                groups: [],
                roles: [],
                listRecords: {
                    list: [],
                    total: 0
                },
                loading: false,
                columns: [
                    {
                        title: 'ID',
                        key: 'User_ID',
                    },
                    {
                        title: '帐号',
                        key: 'User_Account',
                    },
                    {
                        title: '名称',
                        key: 'User_Name',
                    },
                    {
                        title: '最后登陆时间',
                        key: 'Last_Login_Time',
                    },
                    {
                        title: '创建时间',
                        key: 'Created_Time',
                    },
                    {
                        title: '工作组',
                        key: 'Group',
                        render(h, {row}) {
                            return h('span', row['Groups'].map(v => v['Work_Group_Name']).join(','))
                        },
                    },
                    {
                        title: '角色',
                        key: 'Roles',
                        render(h, {row}) {
                            return h('span', row['Roles'].map(v => v['Role_Name']).join(','))
                        },
                    },
                ],
            }
        },
        created() {
            Promise.all([
                this.$api.system.groups(),
                this.$api.system.roles(),
            ]).then(resp => {
                this.groups = resp[0].data
                this.roles = resp[1].data.list
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
                this.loading = true
                this.$api.management.user.list(params).then(resp => {
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
        },
        components: {},
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.doQuery()
            })
        }
    }
</script>