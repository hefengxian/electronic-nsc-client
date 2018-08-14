<template>
    <div>
        <!-- 页头 -->
        <div class="nsc-body-right-nav">
            <div class="nsc-body-right-nav-left">
                <Breadcrumb>
                    <BreadcrumbItem to="/translation">
                        <icon type="md-swap"></icon>
                        待译库
                    </BreadcrumbItem>
                    <BreadcrumbItem :to="`/translation/detail/${$route.params.id}`">
                        <icon type="md-swap"></icon>
                        翻译
                    </BreadcrumbItem>
                    <breadcrumb-item>{{article ? article['Article_Title'] : ''}}</breadcrumb-item>
                </Breadcrumb>
            </div>
            <div class="nsc-body-right-nav-right"></div>
        </div>

        <!-- 页体 -->
        <card dis-hover v-if="article">
            <div slot="title">
                <button-group size="small">
                    <i-button @click="save"
                              icon="md-cloud-upload">保存</i-button>
                    <i-button v-if="canSetFinish()"
                              title="将状态设置为完成，并保存当前未保存的内容"
                              @click="finish"
                              icon="md-checkmark-circle">完成翻译</i-button>
                    <i-button v-if="canSetCancel()"
                              @click="cancel"
                              title="取消翻译，文章重新变成待译状态"
                              icon="ios-power">取消翻译</i-button>
                </button-group>
            </div>
            <p slot="extra">
                <span>{{saveStatus}}</span>
                <divider type="vertical"/>
                <span>字数：{{numeral(countInfo.characters).format('0,0')}}</span>
                <divider type="vertical"/>
                <span>正在翻译</span>
            </p>

            <div style="height: calc(100vh - 195px); margin: -16px;"
                 @keydown="hotSave">
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
                                <i-input v-model.trim="translateArticle.Translate_Title"
                                         placeholder="文章标题"></i-input>
                            </form-item>

                            <form-item label="正文" prop="article_content">
                                <editor v-model.trim="translateArticle.Translate_Content"
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
    import moment from 'moment'

    const DATE_FORMAT = 'YYYY-MM-DD HH:mi:ss'

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
                saveStatus: '',
                article: null,
                lastSaveTime: moment(),
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
            translateArticle: {
                handler(val, old) {
                    Countable.count(val.Translate_Content, countInfo => {
                        this.countInfo = countInfo
                    }, {stripTags: true})

                    if (moment().diff(this.lastSaveTime, 'seconds') > 30) {
                        this.lastSaveTime = moment()
                        this.save()
                    } else {
                        this.saveStatus = '未保存'
                    }
                },
                deep: true,
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
                    let data = resp.data
                    // 做个拦截，防止有人输入地址进入界面
                    if (this.cu.User_ID != data.Translate_User_ID) {
                        // 跳转到首页
                        this.$router.push('/')
                        return
                    }
                    this.loading = false
                    this.article = data
                    this.translateArticle= {
                        Translate_Title: data['Translate_Title'] ? data['Translate_Title'] : '',
                        Translate_Content: data['Translate_Content'] ? data['Translate_Content'] : '',
                    }
                })
            },

            /**
             * Ctrl + S 保存
             *
             * @param {object} e keydown 事件
             */
            hotSave(e) {
                // 快捷键 ctrl + s 保存
                if (e.keyCode === 83 && e.ctrlKey) {
                    e.preventDefault()
                    e.stopPropagation()
                    this.save()
                }
            },

            /**
             * 保存到服务器
             */
            save() {
                if (this.translateArticle['Translate_Title'] === this.article['Translate_Title'] &&
                    this.translateArticle['Translate_Content'] === this.article['Translate_Content']) {
                    this.saveStatus = '已保存'
                    // 如果内容没有变动，无需保存
                    return
                }
                this.saveStatus = '保存中...'
                let reqData = {
                    Article_Translate_ID: this.$route.params.id,
                    Translate_Title: this.translateArticle['Translate_Title'],
                    Translate_Content: this.translateArticle['Translate_Content'].replace(/<p><br><\/p>/g, "")
                }
                this.$api.translation.save(reqData).then(resp => {
                    this.saveStatus = '已保存'
                    let data = resp.data
                    if (data.error) {
                        this.$Message.error(data.error.message)
                    } else {
                        // 更新这两个字段
                        this.article['Translate_Title'] = reqData.Translate_Title
                        this.article['Translate_Content'] = reqData.Translate_Content
                        this.article['Translate_Last_Update_Time'] = moment().format(DATE_FORMAT)
                    }
                }).catch(err => {
                    this.saveStatus = '未保存'
                })
            },

            /**
             * 判断是否可以设置为完成
             *
             * @return {boolean}
             */
            canSetFinish(){
                // 如果是完成或者完成之后的状态，不能再点完成
                return ['TN', 'TW'].indexOf(this.article['Translate_Status']) > -1
            },


            /**
             * 判断是否可以设置为取消
             *
             * @return {boolean}
             */
            canSetCancel() {
                return this.article['Translate_Status'] === 'TW'
            },


            /**
             * 设置翻译完成
             */
            finish() {
                this.save()
                if (!this.canSetFinish()) return
                if (this.translateArticle['Translate_Title'].trim() === '' || this.translateArticle['Translate_Content'].trim() === '') {
                    this.$Message.error('译文标题或者内容为空，不能设置为完成！')
                    return
                }
                let params = {
                    Article_Translate_ID: this.article.Article_Translate_ID,
                    Translate_Status: 'TF',
                }
                this.$api.translation.status(params).then(resp => {
                    let data = resp.data
                    if (data.error) {
                        this.$Message.error(data.error.message)
                    } else {
                        // 跳转到详情界面
                        this.$router.push(`/translation/detail/${params.Article_Translate_ID}`)
                    }
                }).catch(err => {})
            },

            /**
             * 设置取消翻译
             */
            cancel() {
                this.save()
                if (!this.canSetCancel()) return
                let params = {
                    Article_Translate_ID: this.article.Article_Translate_ID,
                    Translate_Status: 'TN',
                }
                this.$api.translation.status(params).then(resp => {
                    let data = resp.data
                    if (data.error) {
                        this.$Message.error(data.error.message)
                    } else {
                        // 跳转到列表界面
                        this.$router.push(`/translation`)
                    }
                }).catch(err => {})
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