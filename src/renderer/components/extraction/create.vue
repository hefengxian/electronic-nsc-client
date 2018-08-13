<template>
    <div>
        <!-- 标题 -->
        <div class="nsc-body-right-nav">
            <div class="nsc-body-right-nav-left">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <icon type="md-add"></icon>
                        创建文章
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>
            <div class="nsc-body-right-nav-right"></div>
        </div>

        <card dis-hover
              class="create-article"
              :bordered="false">
            <i-form ref="create-form"
                    :rules="validateRule"
                    :model="article"
                    :label-width="80">
                <row>
                    <i-col span="22">
                        <form-item label="标题" prop="article_title">
                            <i-input v-model="article.article_title"
                                     placeholder="文章标题"></i-input>
                        </form-item>
                    </i-col>
                </row>

                <row>
                    <i-col span="8">
                        <form-item label="原文网址" prop="article_url">
                            <i-input v-model="article.article_url"
                                     placeholder=""></i-input>
                        </form-item>
                    </i-col>
                    <i-col span="8">
                        <form-item label="来源" prop="article_source">
                            <i-input v-model="article.article_source"
                                     placeholder="文章来源，例如：BBC News"></i-input>
                        </form-item>
                    </i-col>
                    <i-col span="6">
                        <form-item label="作者">
                            <i-input v-model="article.article_author"
                                     placeholder="文章作者，不填则自动为当前登录用户"></i-input>
                        </form-item>
                    </i-col>
                </row>


                <form-item label="其他选项">
                    <row type="flex">
                        <i-col span="22">
                            <a href="javascript:;"
                               style="text-decoration: none;"
                               @click="showCollapse = !showCollapse"> {{showCollapse ? '收起' : '展开'}}
                                <icon :type="showCollapse ? 'ios-arrow-up' : 'ios-arrow-down'"></icon>
                            </a>
                        </i-col>
                    </row>
                </form-item>

                <!-- 文章摘要 -->
                <form-item label="摘要" v-if="showCollapse">
                    <row>
                        <i-col span="22">
                            <i-input v-model="article.article_abstract"
                                     type="textarea"
                                     placeholder="摘要"></i-input>
                        </i-col>
                    </row>
                </form-item>

                <form-item label="正文" prop="article_content">
                    <row type="flex">
                        <i-col span="22">
                            <editor v-model="article.article_content"
                                    @ready="handleEditorReady"
                                    :options="editorOptions"></editor>
                        </i-col>
                    </row>
                </form-item>

                <!--<form-item label="附件">
                    <upload action="//jsonplaceholder.typicode.com/posts/">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                    </upload>
                </form-item>-->

                <form-item style="margin-bottom: 0;">
                    <row :gutter="16">
                        <i-col span="4">
                            <i-button type="primary"
                                      @click="handleSubmit('create-form')"
                                      long>保 存
                            </i-button>
                        </i-col>
                        <i-col span="20">
                            <i-button @click="$router.push('/extraction')">放弃</i-button>
                        </i-col>
                    </row>
                </form-item>
            </i-form>
        </card>
    </div>
</template>

<script>
    import {quillEditor} from 'vue-quill-editor'
    import 'quill/dist/quill.snow.css'
    import moment from 'moment'

    const editorOptions = {
        modules: {
            'toolbar': [
                [{'bold': {tooltip: "粗体 （Ctrl + B）"}}, 'italic', 'underline', 'strike'],
                [{'color': []}, {'background': []}],
                [{'align': []}],
                ['blockquote', 'code-block'],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'header': 1}, {'header': 2}],
                [{'indent': '-1'}, {'indent': '+1'}],
                [{'script': 'sub'}, {'script': 'super'}],
                [{'direction': 'rtl'}],
                [{'size': ['small', false, 'large', 'huge']}],
                [{'header': [1, 2, 3, 4, 5, 6, false]}],
                [{'font': []}],
                // ['clean'],
                ['link', 'image', 'video']
            ],
        },
        placeholder: ' ',
    }

    export default {
        data () {
            return {
                content: '',
                editorOptions,
                showCollapse: false,
                article: {
                    article_title: '',
                    article_author: '',
                    article_url: '',
                    article_source: '',
                    article_abstract: '',
                    article_content: '',
                },
                validateRule: {
                    article_title: [
                        {
                            required: true,
                            message: '标题不能为空',
                            trigger: 'blur'
                        },
                    ],
                    article_url: [
                        {
                            type: 'url',
                            required: true,
                            message: '请输入合法的链接，例如：https://www.knowlesys.com/',
                            trigger: 'blur'
                        },
                    ],
                    article_source: [
                        {
                            required: true,
                            message: '来源不能为空',
                            trigger: 'blur'
                        },
                    ],
                    article_content: [
                        {
                            required: true,
                            message: '文章内容不能为空',
                            trigger: 'blur'
                        },
                    ],
                },
            }
        },
        watch: {
            /*article: {
                handler (newVal, oldVal) {
                    // console.log(newVal)
                },
                deep: true
            }*/
        },
        mounted () {
        },
        methods: {
            handleEditorReady (e) {
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.doSubmit()
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            doSubmit () {
                let params = {...this.article}
                this.$api.extraction.create(params).then(resp => {
                    // 返回列表
                    this.$Message.info('保存成功！')
                    this.$router.push('/extraction')
                }).catch(e => {
                    this.$Message.error('保存失败！')
                })
            },
        },
        components: {
            layout: require('../common/layout').default,
            editor: quillEditor,
        }
    }
</script>

<style lang="less">
    .create-article .ql-container .ql-editor {
        min-height: 20em;
        padding-bottom: 1em;
        // max-height: 25em;
    }

    .create-article .ql-toolbar {
        line-height: 1.6 !important;
    }

    .create-article .ql-toolbar .ql-picker-item, .ql-picker-label {
        font-size: 12px;
        font-family: 'Sailec Light', sans-serif;;
    }

    .create-article .ql-toolbar .ql-picker-label {
        font-size: 13px;
    }
</style>