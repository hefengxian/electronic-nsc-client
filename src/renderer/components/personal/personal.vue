<template>
    <div>
        <!-- 页头 -->
        <div class="nsc-body-right-nav">
            <div class="nsc-body-right-nav-left">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <icon type="md-contact"></icon>
                        个人中心
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>
            <div class="nsc-body-right-nav-right"></div>
        </div>

        <!-- 页体 -->
        <card dis-hover :bordered="false">
            <tabs type="card" :animated="false">
                <tab-pane name="info"
                          icon="md-information-circle"
                          label="个人信息">
                    <div style="text-align: center; margin: 50px auto; width: 600px">
                        <p>
                            <avatar icon="ios-person" size="large"/>
                        </p>
                        <br>

                        <p>{{cu.User_Account}}</p>
                        <p>{{cu.User_Name}}</p>
                        <br>
                        <p>{{cu.Roles.map(v => v.Role_Name).join(',')}}</p>
                        <p>{{cu.Group.Work_Group_Name}}</p>
                        <br>
                        <p :title="cu.Created_Time">创建于：{{moment(cu.Created_Time).fromNow()}}</p>
                        <p :title="cu.Last_Login_Time">最后登录：{{moment(cu.Last_Login_Time).fromNow()}}</p>
                        <br>
                        <Divider>个人统计</Divider>
                        <h4>
                            选稿：{{stat.Selected_Count}}
                            <divider type="vertical"/>
                            翻译：{{stat.Translation_Count}}
                            <divider type="vertical"/>
                            校对：{{stat.Review_Count}}
                            <divider type="vertical"/>
                            编辑：{{stat.Audit_Count}}
                        </h4>
                    </div>
                </tab-pane>
                <tab-pane name="change-password"
                          icon="md-lock"
                          label="修改密码">
                    <div style="margin: 50px auto; width: 600px">
                        <Form ref="password-form"
                              :model="password.form"
                              :rules="password.rules"
                              :label-width="100">
                            <FormItem label="原密码" prop="Old_Password">
                                <Input type="password"
                                       autocomplete="off"
                                       v-model.trim="password.form.Old_Password"/>
                            </FormItem>
                            <FormItem label="新密码" prop="New_Password">
                                <Input type="password" v-model.trim="password.form.New_Password"/>
                            </FormItem>
                            <FormItem label="确认原密码" prop="New_Password_Confirm">
                                <Input type="password" v-model.trim="password.form.New_Password_Confirm"/>
                            </FormItem>
                            <FormItem>
                                <Button type="primary"
                                        @click="handleSubmit">提交
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </tab-pane>
            </tabs>
        </card>
    </div>
</template>

<script>
    import moment from 'moment'
    import numeral from 'numeral'

    moment.locale('zh-cn')

    export default {
        data() {
            return {
                cu: this.$localStore.getItem(this.$localStore.Keys.USER_KEY),   // 当前登录用户
                article: null,
                moment,
                loading: false,
                isShowRawArticle: true,
                stat: {
                    Selected_Count: 0,
                    Translation_Count: 0,
                    Review_Count: 0,
                    Audit_Count: 0,
                },
                password: {
                    form: {
                        Old_Password: '',
                        New_Password: '',
                        New_Password_Confirm: '',
                    },
                    rules: {
                        Old_Password: [
                            {
                                required: true,
                                message: '原始密码不能为空',
                                trigger: 'blur',
                            },
                        ],
                        New_Password: [
                            {
                                required: true,
                                message: '新密码不能为空',
                                trigger: 'blur',
                            },
                        ],
                        New_Password_Confirm: [
                            {
                                required: true,
                                validator: (rule, value, callback) => {
                                    console.log(value)
                                    if (value === '') {
                                        callback(new Error('请再次输入新密码'));
                                    } else if (value !== this.password.form.New_Password) {
                                        callback(new Error('两次密码不一致'));
                                    } else {
                                        callback();
                                    }
                                },
                                trigger: 'blur',
                            },
                        ],
                    },
                }
            }
        },
        computed: {},
        methods: {
            handleSubmit() {
                // 校验表单
                this.$refs['password-form'].validate(valid => {
                    if (valid) {
                        // 提交创建
                        let params = {...this.password.form}
                        this.$api.personal.changePassword(params).then(resp => {
                            let data = resp.data
                            if (data.error) {
                                this.$Message.error(data.error.message)
                            } else if (data.result === 0) {
                                this.$Message.error('未作任何修改')
                            } else {
                                // 退出登录
                                this.$localStore.clear()
                                this.$router.push('/login')
                            }
                        })
                    } else {
                        // 显示错误不做任何操作
                    }
                })
            },
            getStat() {
                this.$api.personal.stat({}).then(resp => {
                    this.stat.Selected_Count = numeral(resp.data.Selected_Count).format('0,0')
                    this.stat.Translation_Count = numeral(resp.data.Translation_Count).format('0,0')
                    this.stat.Review_Count = numeral(resp.data.Review_Count).format('0,0')
                    this.stat.Audit_Count = numeral(resp.data.Audit_Count).format('0,0')
                })
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.getStat()
            })
        }
    }
</script>

<style>

</style>
