<template>
    <div>
        <!-- 页头 -->
        <div class="nsc-body-right-nav">
            <div class="nsc-body-right-nav-left">
                <Breadcrumb>
                    <BreadcrumbItem to="/proofreading">
                        <icon type="md-done-all"></icon>
                        待校库
                    </BreadcrumbItem>
                    <BreadcrumbItem :to="`/proofreading/detail/${$route.params.id}`">
                        <icon type="md-done-all"></icon>
                        校对译文
                    </BreadcrumbItem>
                    <BreadcrumbItem>{{article ? article.Article_Title : ''}}</BreadcrumbItem>
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
                              icon="md-checkmark-circle">完成校对</i-button>
                </button-group>

                <div style="display: inline-block; margin-left: 16px; font-size: 12px;"> 评分：
                    <Rate v-model="translateArticle.score" />
                </div>
            </div>
            <p slot="extra">
                <span>{{saveStatus}}</span>
                <divider type="vertical"/>
                <span>字数：{{numeral(characterCount).format('0,0')}}</span>
                <divider type="vertical"/>
                <span>正在校对</span>
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
                                <i-input v-model.trim="translateArticle.title"
                                         placeholder="文章标题"></i-input>
                            </form-item>

                            <form-item label="正文" prop="article_content">
                                <editor v-model.trim="translateArticle.content"
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
                    title: '',
                    content: '',
                    score: 0,
                },
                contentCount: {
                    paragraphs: 0,
                    sentences: 0,
                    words: 0,
                    characters: 0,
                    all: 0
                },
                titleCount: {
                    paragraphs: 0,
                    sentences: 0,
                    words: 0,
                    characters: 0,
                    all: 0
                }
            }
        },
        watch: {
            translateArticle: {
                handler(val, old) {
                    Countable.count(val.content, countInfo => {
                        this.contentCount = countInfo
                    }, {stripTags: true})
                    Countable.count(val.title, countInfo => {
                        this.titleCount = countInfo
                    })

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
        computed: {
            characterCount() {
                return this.titleCount.characters + this.contentCount.characters
            }
        },
        methods: {
            /**
             * 获取文章
             */
            getArticle () {
                if (!this.$route.params.id) return

                this.loading = true
                this.article = null
                this.$api.proofreading.detail({id: this.$route.params.id}).then(resp => {
                    let data = resp.data
                    // 做个拦截，防止有人输入地址进入界面
                    if (this.cu.User_ID != data.Review_User_ID) {
                        // 跳转到首页
                        this.$router.push('/')
                        return
                    }
                    this.loading = false
                    this.article = data
                    this.translateArticle= {
                        title: data['Review_Title'] ? data['Review_Title'] : '',
                        content: data['Review_Content'] ? data['Review_Content'] : '',
                        score: data['Translate_Score_By_Review'] ? data['Translate_Score_By_Review'] : 0,
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
                if (this.translateArticle['title'] === this.article['Review_Title'] &&
                    this.translateArticle['content'] === this.article['Review_Content'] &&
                    this.translateArticle.score === this.article['Translate_Score_By_Review']) {
                    this.saveStatus = '已保存'
                    // 如果内容没有变动，无需保存
                    return
                }
                this.saveStatus = '保存中...'
                let reqData = {
                    Article_Translate_ID: this.$route.params.id,
                    Review_Title: this.translateArticle.title,
                    Review_Content: this.translateArticle.content.replace("<p><br></p>", ""),
                    Score: this.translateArticle.score,
                    Character_Count: this.characterCount,
                }
                this.$api.proofreading.save(reqData).then(resp => {
                    let data = resp.data
                    if (data.error) {
                        this.saveStatus = '保存失败'
                        this.$Message.error(data.error.message)
                    } else {
                        this.saveStatus = '已保存'
                        // 更新这两个字段
                        this.article['Review_Title'] = reqData.Review_Title
                        this.article['Review_Content'] = reqData.Review_Content
                    }
                }).catch(err => {
                    this.saveStatus = '保存失败'
                })
            },

            /**
             * 判断是否可以设置为完成
             *
             * @return {boolean}
             */
            canSetFinish(){
                // 如果是完成或者完成之后的状态，不能再点完成
                return ['RW'].indexOf(this.article['Translate_Status']) > -1
            },

            /**
             * 设置翻译完成
             */
            finish() {
                this.save()
                if (!this.canSetFinish()) return
                if (this.translateArticle['title'].trim() === '' || this.translateArticle['content'].trim() === '') {
                    this.$Message.error('译文标题或者内容为空，不能设置为完成！')
                    return
                }
                let params = {
                    Article_Translate_ID: this.article.Article_Translate_ID,
                    Translate_Status: 'RF',
                }
                this.$api.proofreading.status(params).then(resp => {
                    let data = resp.data
                    if (data.error) {
                        this.$Message.error(data.error.message)
                    } else {
                        // 跳转到详情界面
                        this.$router.push(`/proofreading/detail/${params.Article_Translate_ID}`)
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