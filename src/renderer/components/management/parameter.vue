<template>
    <div>
        <!-- 内容 -->
        <card dis-hover :bordered="false" class="margin-top-16 nsc-list">
            <!-- 顶部工具栏 -->
            <div class="nsc-list-header">
                <div class="nsc-list-header-left">
                    <button-group>
                        <i-button icon="md-create"
                                  @click="handleEditButtonClick"
                                  :disabled="!selected">编辑
                        </i-button>
                    </button-group>
                </div>
                <div class="nsc-list-header-right"></div>
            </div>

            <!-- 列表 -->
            <div class="nsc-list-body margin-top-8 margin-bottom-8">
                <i-table ref="list"
                         :loading="loading"
                         highlight-row
                         @on-row-click="handleRowClick"
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

        <!-- 编辑工作组 -->
        <modal v-model="editModal.show"
               :mask-closable="false"
               title="编辑参数">
            <Form ref="edit-form"
                  :rules="editModal.rules"
                  :label-width="80"
                  style="padding-right: 40px;"
                  :model="editModal.form">
                <form-item label="参数值" prop="Param_Value_Int">
                    <input-number v-model="editModal.form.Param_Value_Int"
                                  :min="1"
                                  :editable="false"
                                  placeholder="参数值，大于 1"/>
                </form-item>
                <form-item label="参数名称" prop="Param_Name">
                    <i-input v-model.trim="editModal.form.Param_Name"
                             placeholder="名称"/>
                </form-item>
                <form-item label="描述" prop="Param_Description">
                    <i-input v-model.trim="editModal.form.Param_Description"
                             type="textarea"
                             placeholder="描述"/>
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
        data () {
            return {
                pageSizeOptions: [10, 20, 50, 100],
                form: {
                    keyword: '',
                    page_no: 1,
                    page_size: 10,
                },
                listRecords: {
                    list: [],
                    total: 0
                },
                selected: null,
                loading: false,
                columns: [
                    {
                        title: 'ID',
                        key: 'Param_ID',
                    },
                    {
                        title: '参数名称',
                        key: 'Param_Name',
                    },
                    {
                        title: '参数值',
                        key: 'Param_Value_Int',
                    },
                    {
                        title: '描述',
                        key: 'Param_Description',
                    },
                ],

                editModal: {
                    show: false,
                    form: {
                        Param_Value_Int: 1,
                        Param_Name: '',
                        Param_Description: '',
                    },
                    rules: {
                        Param_Value_Int: [
                            {
                                required: true,
                                type: 'number',
                                min: 1,
                                message: "值不能为空",
                                trigger: "blur",
                            },
                        ],
                        Param_Name: [
                            {
                                required: true,
                                message: "名称不能为空",
                                trigger: "blur",
                            },
                        ],
                        Param_Description: [
                            {
                                required: true,
                                message: "描述不能为空",
                                trigger: "blur",
                            },
                        ],
                    },
                },
            }
        },
        created () {
        },
        methods: {
            /**
             * 查询列表
             *
             * @param {boolean} reset 是否重置分页
             */
            doQuery (reset = true) {
                this.selected = null
                if (reset) {
                    this.form.page_no = 1
                }

                let params = {...this.form}
                this.loading = true
                this.$api.management.parameter.list(params).then(resp => {
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
             * 表格单击某行的处理事件
             *
             * @param {object} row 当前行的数据
             * @param index 当前行的索引
             */
            handleRowClick (row, index) {
                this.selected = row
            },

            /**
             * 更新按钮，
             */
            handleEditButtonClick () {
                // 表单初始化
                this.editModal.form.Param_ID = this.selected.Param_ID
                this.editModal.form.Param_Value_Int = this.selected.Param_Value_Int
                this.editModal.form.Param_Name = this.selected.Param_Name
                this.editModal.form.Param_Description = this.selected.Param_Description
                // 显示 Modal
                this.editModal.show = true
            },

            /**
             * 提交更新
             */
            handleEditModalClickOk () {
                // 校验表单
                this.$refs['edit-form'].validate(valid => {
                    if (valid) {
                        // 提交创建
                        let params = {...this.editModal.form}
                        this.$api.management.parameter.edit(params).then(resp => {
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
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.doQuery()
            })
        }
    }
</script>