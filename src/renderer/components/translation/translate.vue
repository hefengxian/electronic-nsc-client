<template>
    <div>
        <!-- 页头 -->
        <div class="nsc-body-right-nav">
            <div class="nsc-body-right-nav-left">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <icon type="md-swap"></icon>
                        翻译
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>
            <div class="nsc-body-right-nav-right"></div>
        </div>

        <!-- 页体 -->
        <card dis-hover v-if="article">
            <div slot="title">
                <button-group size="small">
                    <i-button icon="md-cloud-upload">保存</i-button>
                    <i-button icon="md-checkmark-circle">完成</i-button>
                    <i-button icon="ios-power">取消</i-button>
                </button-group>
            </div>
            <p slot="extra">
                <span>字数：{{numeral(countInfo.characters).format('0,0')}}</span>
                <divider type="vertical"/>
                <span>正在翻译</span>
            </p>

            <div style="height: calc(100vh - 195px); margin: -16px;">
                <split v-model="split" max="600px" min="600px">
                    <!-- 原文区域 -->
                    <card dis-hover
                          slot="left"
                          style="overflow: auto; max-height: 100%;"
                          :bordered="false">
                        <div class="content">
                            <div class="article-detail">
                                <p class="article-title">{{article.Article_Title}}</p>
                                <div class="article-content"
                                     id="article-content"
                                     v-html="article.Article_Content"></div>
                            </div>
                        </div>
                    </card>

                    <!-- 编辑区域 -->
                    <card dis-hover
                          slot="right"
                          style="padding: 16px"
                          :bordered="false">
                        <i-form ref="create-form"
                                :model="translateArticle"
                                label-position="top">
                            <form-item label="标题">
                                <i-input v-model="translateArticle.Translate_Title"
                                         placeholder="文章标题"></i-input>
                            </form-item>

                            <form-item label="正文" prop="article_content">
                                <editor v-model="translateArticle.Translate_Content"
                                        style="height: calc(100vh - 420px);"
                                        :options="editorOptions"></editor>
                            </form-item>
                        </i-form>
                    </card>
                </split>
            </div>
        </card>
    </div>
</template>

<script>
    import {quillEditor} from 'vue-quill-editor'
    import 'quill/dist/quill.snow.css'
    import Countable from 'countable'
    import numeral from 'numeral'

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
                numeral,
                cu: this.$localStore.getItem(this.$localStore.Keys.USER_KEY),   // 当前登录用户
                loading: false,
                article: null,
                split: 0.5,
                editorOptions,
                translateArticle: {
                    Translate_Title: '',
                    Translate_Content: '',
                },
                countInfo: {
                    paragraphs: 0,
                    sentences: 0,
                    words: 0,
                    characters: 0,
                    all: 0
                },
            }
        },
        watch: {
            ['translateArticle.Translate_Content'] (val) {
                Countable.count(val, countInfo => {
                    this.countInfo = countInfo
                }, {stripTags: true})
            },
        },
        methods: {
            /**
             * 获取文章
             */
            getArticle () {
                if (!this.$route.params.id) return

                this.loading = true
                this.article = null
                this.$api.translation.detail({id: this.$route.params.id}).then(resp => {
                    // 做个拦截，防止有人输入地址进入界面
                    if (this.cu.User_ID != resp.data.Translate_User_ID) {
                        // 跳转到首页
                        this.$router.push('/')
                        return
                    }
                    this.loading = false
                    this.article = resp.data
                })
            },
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getArticle()
            })
        },
        components: {
            editor: quillEditor,
        }
    }
</script>

<style lang="less">
    .ql-toolbar {
        line-height: 1.6 !important;
    }

</style>