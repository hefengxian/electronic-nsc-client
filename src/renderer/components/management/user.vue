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
            <!-- 顶部工具栏 -->
            <div class="nsc-list-header">
                <div class="nsc-list-header-left">
                    <button-group>
                        <i-button icon="md-person-add"
                                  @click="createModal.show = true">添加</i-button>
                        <i-button icon="md-create"
                                  @click="handleEditButtonClick"
                                  :disabled="!selected">编辑</i-button>
                        <i-button icon="md-trash"
                                  @click="handleDeleteButtonClick"
                                  :disabled="!selected">删除</i-button>
                    </button-group>
                </div>
                <div class="nsc-list-header-right"></div>
            </div>

            <!-- 列表 -->
            <div class="nsc-list-body margin-top-8 margin-bottom-8">
                <i-table ref="list"
                         :loading="loading"
                         highlight-row
                         @on-row-click="handleROwClick"
                         :data="listRecords.list"
                         :columns="columns"></i-table>
            </div>

            <!-- 底部工具栏 -->
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

        <!-- 创建用户 -->
        <modal v-model="createModal.show"
               :mask-closable="false"
               @on-visible-change="handleCreateModalVisibleChange"
               title="添加新用户">
            <Form ref="create-form"
                  :rules="createModal.rules"
                  :label-width="80"
                  style="padding-right: 40px;"
                  :model="createModal.form">
                <form-item label="帐号" prop="User_Account">
                    <i-input v-model.trim="createModal.form.User_Account"
                             placeholder="登陆帐号"/>
                </form-item>
                <form-item label="密码" prop="User_Password">
                    <i-input v-model.trim="createModal.form.User_Password"
                             type="password"
                             placeholder="登陆密码，至少 6 位"/>
                </form-item>
                <form-item label="名称" prop="User_Name">
                    <i-input v-model.trim="createModal.form.User_Name"
                             placeholder="名称"/>
                </form-item>
                <form-item label="工作组" prop="Group">
                    <i-select v-model="createModal.form.Group"
                              placeholder="选择工作组">
                        <i-option v-for="(group, key) in groups"
                                  :label="group.Work_Group_Name"
                                  :value="group.Work_Group_ID"
                                  :key="key"></i-option>
                    </i-select>
                </form-item>
                <form-item label="角色" prop="Roles">
                    <checkbox-group v-model="createModal.form.Roles">
                        <checkbox :label="6">翻译员</checkbox>
                        <checkbox :label="5">校对员</checkbox>
                        <checkbox :label="4">选稿员</checkbox>
                        <checkbox :label="3">组长</checkbox>
                        <checkbox :label="2">主编</checkbox>
                    </checkbox-group>
                </form-item>
            </Form>

            <div slot="footer">
                <i-button type="text" @click="createModal.show = false">取消</i-button>
                <i-button type="primary" @click="handleCreateModalClickOk">确定</i-button>
            </div>
        </modal>


        <!-- 编辑用户 -->
        <modal v-model="editModal.show"
               :mask-closable="false"
               @on-visible-change="handleCreateModalVisibleChange"
               title="编辑用户">
            <Form ref="edit-form"
                  :rules="editModal.rules"
                  :label-width="80"
                  style="padding-right: 40px;"
                  :model="editModal.form">
                <form-item label="帐号" prop="User_Account">
                    <i-input v-model.trim="editModal.form.User_Account"
                             placeholder="登陆帐号"/>
                </form-item>
                <form-item label="名称" prop="User_Name">
                    <i-input v-model.trim="editModal.form.User_Name"
                             placeholder="名称"/>
                </form-item>
                <form-item label="工作组" prop="Group">
                    <i-select v-model="editModal.form.Group"
                              placeholder="选择工作组">
                        <i-option v-for="(group, key) in groups"
                                  :label="group.Work_Group_Name"
                                  :value="group.Work_Group_ID"
                                  :key="key"></i-option>
                    </i-select>
                </form-item>
                <form-item label="角色" prop="Roles">
                    <checkbox-group v-model="editModal.form.Roles">
                        <checkbox :label="6">翻译员</checkbox>
                        <checkbox :label="5">校对员</checkbox>
                        <checkbox :label="4">选稿员</checkbox>
                        <checkbox :label="3">组长</checkbox>
                        <checkbox :label="2">主编</checkbox>
                    </checkbox-group>
                </form-item>
            </Form>

            <div slot="footer">
                <i-button type="text" @click="editModal.show = false">取消</i-button>
                <i-button type="primary" @click="handleEditModalClickOk">确定</i-button>
            </div>
        </modal>
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
                selected: null,
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

                createModal: {
                    show: false,
                    form: {
                        User_Account: '',
                        User_Password: '',
                        User_Name: '',
                        Roles: [],
                        Group: '',
                    },
                    rules: {
                        User_Account: [
                            {
                                required: true,
                                message: "帐号不能为空",
                                trigger: "blur",
                            },
                            {
                                validator: (rule, value, callback) => {
                                    this.$api.management.user.checkAccount({account: value}).then(resp => {
                                        if (resp.data.result) {
                                            callback()
                                        } else {
                                            callback(new Error('帐号已被使用'))
                                        }
                                    })
                                },
                                trigger: "blur",
                            },
                        ],
                        User_Password: [
                            {
                                required: true,
                                message: "密码不能为空",
                                trigger: "blur",
                            },
                            {
                                type: 'string',
                                min: 6,
                                message: "密码不能长度不能小于 6 位",
                                trigger: "blur",
                            },
                        ],
                        User_Name: [
                            {
                                required: true,
                                message: "名称不能为空",
                                trigger: "blur",
                            },
                        ],
                        Group: [
                            {
                                required: true,
                                type: 'number',
                                message: "工作组不能为空",
                                trigger: "change",
                            },
                        ],
                        Roles: [
                            {
                                required: true,
                                min: 1,
                                type: 'array',
                                message: "请至少选择一种角色",
                                trigger: "change",
                            },
                        ],
                    },
                },
                editModal: {
                    show: false,
                    form: {
                        User_ID: '',
                        User_Account: '',
                        User_Name: '',
                        Roles: [],
                        Group: '',
                        Reset_Password: '',
                    },
                    rules: {
                        User_Account: [
                            {
                                required: true,
                                message: "帐号不能为空",
                                trigger: "blur",
                            },
                            {
                                validator: (rule, value, callback) => {
                                    let params = {account: value, exclude: this.selected['User_ID']}
                                    this.$api.management.user.checkAccount(params).then(resp => {
                                        if (resp.data.result) {
                                            callback()
                                        } else {
                                            callback(new Error('帐号已被使用'))
                                        }
                                    })
                                },
                                trigger: "blur",
                            },
                        ],
                        User_Name: [
                            {
                                required: true,
                                message: "名称不能为空",
                                trigger: "blur",
                            },
                        ],
                        Group: [
                            {
                                required: true,
                                type: 'number',
                                message: "工作组不能为空",
                                trigger: "change",
                            },
                        ],
                        Roles: [
                            {
                                required: true,
                                min: 1,
                                type: 'array',
                                message: "请至少选择一种角色",
                                trigger: "change",
                            },
                        ],
                    },
                },
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
            doQuery(reset = true) {
                this.selected = null
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
             * 表格单击某行的处理事件
             *
             * @param {object} row 当前行的数据
             * @param index 当前行的索引
             */
            handleROwClick(row, index) {
                this.selected = row
            },

            /**
             * 处理添加
             */
            handleCreateModalClickOk() {
                // 校验表单
                this.$refs['create-form'].validate(valid => {
                    if (valid) {
                        // 提交创建
                        let params = {...this.createModal.form}
                        params.Roles = params.Roles.join(',')
                        this.$api.management.user.create(params).then(resp => {
                            let data = resp.data
                            if (data.result === 0) {
                                this.$Message.error('创建失败')
                            } else {
                                // 刷新列表
                                this.doQuery()
                                this.createModal.show = false
                            }
                        })
                    } else {
                        // 显示错误不做任何操作
                    }
                })
            },

            /**
             * 当创建用户 Modal 开启或者关闭时的回调
             *
             * @param {boolean} visible
             */
            handleCreateModalVisibleChange(visible) {
                // 关闭的时候把表单清空
                if (!visible) {
                    this.$refs['create-form'].resetFields()
                }
            },

            /**
             * 删除用户
             */
            handleDeleteButtonClick() {
                this.$Modal.confirm({
                    title: '删除用户',
                    content: '你确定要删除这个用户',
                    onOk: () => {
                        this.$api.management.user.delete({User_ID: this.selected['User_ID']}).then(resp => {
                            this.doQuery(false)
                        })
                    }
                })
            },

            /**
             * 更新按钮，
             */
            handleEditButtonClick() {
                // 表单初始化
                this.editModal.form.User_ID = this.selected.User_ID
                this.editModal.form.User_Account = this.selected.User_Account
                this.editModal.form.User_Name = this.selected.User_Name
                this.editModal.form.Roles = this.selected.Roles.map(v => v.Role_ID)
                // 用户组只用到了单个的，设计的是多个的
                this.editModal.form.Group = this.selected.Groups[0] ? this.selected.Groups[0].Work_Group_ID : ''

                // 显示 Modal
                this.editModal.show = true
            },

            handleEditModalClickOk() {
                // 校验表单
                this.$refs['edit-form'].validate(valid => {
                    if (valid) {
                        // 提交创建
                        let params = {...this.editModal.form}
                        params.Roles = params.Roles.join(',')
                        this.$api.management.user.edit(params).then(resp => {
                            let data = resp.data
                            if (data.result === 0) {
                                this.$Message.error('更新失败')
                            } else {
                                // 刷新列表
                                this.doQuery()
                                this.editModal.show = false
                            }
                        })
                    } else {
                        // 显示错误不做任何操作
                    }
                })
            }
        },
        components: {},
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.doQuery()
            })
        }
    }
</script>