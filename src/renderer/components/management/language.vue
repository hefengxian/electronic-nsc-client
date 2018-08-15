<template>
    <div>
        <!-- 表单 -->
        <card dis-hover :bordered="false" class="margin-top-16">
            <i-form label-position="top"
                    v-model="form">
                <row :gutter="24">
                    <i-col :span="6">
                        <form-item label="关键词">
                            <i-input placeholder="关键词"
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

        <!-- 创建语种 -->
        <modal v-model="createModal.show"
               :mask-closable="false"
               @on-visible-change="handleCreateModalVisibleChange"
               title="添加新语种">
            <Form ref="create-form"
                  :rules="createModal.rules"
                  :label-width="80"
                  style="padding-right: 40px;"
                  :model="createModal.form">
                <form-item label="编码" prop="Raw_Language_Code">
                    <i-input v-model.trim="createModal.form.Raw_Language_Code"
                             :maxlength="2"
                             placeholder="编码"/>
                </form-item>
                <form-item label="英文名称" prop="Raw_Language_Name_EN">
                    <i-input v-model.trim="createModal.form.Raw_Language_Name_EN"
                             placeholder="英文名称"/>
                </form-item>
                <form-item label="中文名称" prop="Raw_Language_Name_CN">
                    <i-input v-model.trim="createModal.form.Raw_Language_Name_CN"
                             placeholder="中文名称"/>
                </form-item>
                <form-item label="原始名称" prop="Raw_Language_Name_Local">
                    <i-input v-model.trim="createModal.form.Raw_Language_Name_Local"
                             placeholder="原始名称"/>
                </form-item>
            </Form>

            <div slot="footer">
                <i-button type="text" @click="createModal.show = false">取消</i-button>
                <i-button type="primary" @click="handleCreateModalClickOk">确定</i-button>
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
                        title: '编码',
                        key: 'Raw_Language_Code',
                    },
                    {
                        title: '英文名称',
                        key: 'Raw_Language_Name_EN',
                    },
                    {
                        title: '中文名称',
                        key: 'Raw_Language_Name_CN',
                    },
                    {
                        title: '原始名称',
                        key: 'Raw_Language_Name_Local',
                    },

                ],

                createModal: {
                    show: false,
                    form: {
                        Raw_Language_Code: '',
                        Raw_Language_Name_EN: '',
                        Raw_Language_Name_CN: '',
                        Raw_Language_Name_Local: '',
                    },
                    rules: {
                        Raw_Language_Code: [
                            {
                                required: true,
                                type: 'string',
                                max: 2,
                                message: "名称不能为空",
                                trigger: "blur",
                            },
                        ],
                        Raw_Language_Name_EN: [
                            {
                                required: true,
                                message: "名称不能为空",
                                trigger: "blur",
                            },
                        ],
                        Raw_Language_Name_CN: [
                            {
                                required: true,
                                message: "名称不能为空",
                                trigger: "blur",
                            },
                        ],
                        Raw_Language_Name_Local: [
                            {
                                required: true,
                                message: "名称不能为空",
                                trigger: "blur",
                            },
                        ],
                    },
                },
            }
        },
        created() {
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
                this.$api.management.language.list(params).then(resp => {
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
            handleRowClick(row, index) {
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
                        this.$api.management.language.create(params).then(resp => {
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
             * 当创建语种 Modal 开启或者关闭时的回调
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
             * 删除语种
             */
            handleDeleteButtonClick() {
                this.$Modal.confirm({
                    title: '删除语种',
                    content: '你确定要删除这个语种',
                    onOk: () => {
                        this.$api.management.language.delete({Raw_Language_Code: this.selected['Raw_Language_Code']}).then(resp => {
                            this.doQuery(false)
                        })
                    }
                })
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