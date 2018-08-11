<template>
    <layout>
        <div slot="nav-left">
            <Breadcrumb>
                <BreadcrumbItem>
                    <icon type="md-add"></icon>
                    创建文章
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div slot="body-right">
            <card dis-hover
                  class="create-article"
                  :bordered="false">
                <i-form ref="create-form"
                        :rules="validateRule"
                        :model="article"
                        :label-width="80">
                    <row>
                        <i-col span="22">
                            <form-item label="标题" prop="Article_Title">
                                <i-input v-model="article.Article_Title"
                                         placeholder="文章标题"></i-input>
                            </form-item>
                        </i-col>
                    </row>

                    <row>
                        <i-col span="14">
                            <form-item label="原文网址" prop="Article_URL">
                                <i-input v-model="article.Article_URL"
                                         placeholder=""></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="来源">
                                <i-input v-model="article.Article_Source"
                                         placeholder="文章来源，例如：腾讯新闻"></i-input>
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
                                <i-input v-model="article.Article_Abstract"
                                         type="textarea"
                                         placeholder="摘要"></i-input>
                            </i-col>
                        </row>
                    </form-item>


                    <row>

                    </row>

                    <form-item label="正文" prop="Article_Content">
                        <row type="flex">
                            <i-col span="22">
                                <editor v-model="article.Article_Content"
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
                        <row>
                            <i-col span="4">
                                <i-button type="primary"
                                          @click="handleSubmit('create-form')"
                                          long><i class="fa fa-save"></i> &nbsp;保 存
                                </i-button>
                            </i-col>
                        </row>
                    </form-item>
                </i-form>
            </card>
        </div>
    </layout>
</template>

<script>
    import api from '../../api/'
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
                    Article_Title: '',
                    Article_URL: '',
                    Article_Source: '',
                    Article_Content: '',
                    Extracted_Time: moment().format('YYYY/MM/DD HH:mm:ss'),
                    Article_PubTime: moment().format('YYYY/MM/DD HH:mm:ss'),
                },
                validateRule: {
                    Article_Title: [
                        {
                            required: true,
                            message: '标题不能为空',
                            trigger: 'blur'
                        },
                    ],
                    Article_URL: [
                        {
                            type: 'url',
                            required: true,
                            message: '请输入合法的链接，例如：https://www.knowlesys.com/',
                            trigger: 'blur'
                        },
                    ],
                    Subject_ID: [
                        {
                            required: true,
                            message: '主题不能为空',
                            trigger: 'change'
                        },
                    ],
                    Article_Content: [
                        {
                            required: true,
                            message: '文章内容不能为空',
                            trigger: 'blur'
                        },
                    ],
                },
            }
        },
        mounted () {
        },
        methods: {
            handleEditorReady(e) {},
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.doSubmit()
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            doSubmit() {
                // let Keyword = this.keywords.join(',')
                let params = {...this.article, ...this.area}
                /*articleApi.Article.create(params).then(resp => {
                    let data = resp.data
                    if (data.error) {
                        this.$Message.error(data.error.message)
                        return
                    }
                    this.$emit('on-created', data.result)
                })*/
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