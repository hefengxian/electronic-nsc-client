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
                    <BreadcrumbItem>
                        <icon type="md-paper"></icon>
                        译文详情
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>
            <div class="nsc-body-right-nav-right"></div>
        </div>

        <!-- 页体 -->
        <div v-if="article">
            <card dis-hover
                  :bordered="false">
                <div>
                    <!-- 开始翻译 -->
                    <i-button v-if="article['Translate_Status'] === 'TF'"
                              @click="start(article)"
                              icon="md-done-all">开始校对</i-button>

                    <!-- 继续翻译 -->
                    <i-button v-if="article['Translate_Status'] === 'RW' && cu['User_ID'] === article['Review_User_ID']"
                              @click="$router.push(`/proofreading/proofread/${article['Article_Translate_ID']}`)"
                              icon="md-done-all">继续校对</i-button>

                    <!-- 修改翻译 -->
                    <i-button v-if="article['Translate_Status'] === 'RF' && cu['User_ID'] === article['Review_User_ID']"
                              @click="$router.push(`/proofreading/proofread/${article['Article_Translate_ID']}`)"
                              icon="md-create">修改校对</i-button>

                    <!-- 显示原文 -->
                    <i-button @click="isShowRawArticle = !isShowRawArticle"
                              :icon="isShowRawArticle ? 'md-eye-off' : 'md-eye'">{{isShowRawArticle ? '隐藏' : '显示'}}原文</i-button>
                </div>
            </card>

            <div style="display: flex;" class="margin-top-16">
                <row :gutter="16" style="flex: 1;">
                    <!-- 原文 -->
                    <i-col span="12" v-show="isShowRawArticle">
                        <card dis-hover :bordered="false">
                            <!-- 标题 -->
                            <div slot="title" ><icon type="md-paper"></icon> 原文</div>

                            <div class="content">
                                <div class="article-detail">
                                    <p class="article-title">{{article.Article_Title}}</p>
                                    <div class="article-content"
                                         id="article-content"
                                         v-html="article.Article_Content"></div>
                                </div>
                            </div>
                        </card>
                    </i-col>

                    <!-- 译文（如果有的话） -->
                    <i-col :span="isShowRawArticle ? 12 : 24">
                        <card dis-hover :bordered="false">
                            <!-- 标题 -->
                            <div slot="title"><icon type="md-paper"></icon> 译文</div>

                            <div class="content">
                                <div class="article-detail">
                                    <p class="article-title">{{article['Translate_Status'] === 'TF' ? article.Translate_Title : article.Review_Title}}</p>
                                    <div class="article-content"
                                         id="translate-content"
                                         v-html="article['Translate_Status'] === 'TF' ? article.Translate_Content : article.Review_Content"></div>
                                </div>
                            </div>
                        </card>
                    </i-col>
                </row>

                <!-- 操作信息 -->
                <div class="info">
                    <card dis-hover :bordered="false">
                        <div slot="title"><Icon type="md-information-circle" /> 原文信息</div>
                        <table>
                            <tr v-for="(item, key) in rawArticleInfo"
                                :title="item.title"
                                :key="key">
                                <td>{{item.label}}:</td>
                                <td v-html="item.value"></td>
                            </tr>
                        </table>
                    </card>
                    <card dis-hover :bordered="false" class="margin-top-16">
                        <div slot="title"><Icon type="md-information-circle" /> 译文信息</div>
                        <table>
                            <tr v-for="(item, key) in tranArticleInfo"
                                :title="item.title"
                                :key="key">
                                <td>{{item.label}}:</td>
                                <td v-html="item.value"></td>
                            </tr>
                            <tr>
                                <td>校对评分:</td>
                                <td>
                                    <Rate allow-half
                                          disabled
                                          style="font-size: 12px"
                                          :value="article.Translate_Score_By_Review ? article.Translate_Score_By_Review : 0" />
                                </td>
                            </tr>
                            <tr>
                                <td>编辑评分:</td>
                                <td><Rate allow-half
                                          disabled
                                          style="font-size: 12px"
                                          :value="article.Translate_Score_By_Audit ? article.Translate_Score_By_Audit : 0" /></td>
                            </tr>
                        </table>
                    </card>
                    <card dis-hover :bordered="false" class="margin-top-16">
                        <div slot="title"><Icon type="md-information-circle" /> 操作信息</div>
                        <table>
                            <tr v-for="(item, key) in actionInfo"
                                :title="item.title"
                                :key="key">
                                <td>{{item.label}}:</td>
                                <td v-html="item.value"></td>
                            </tr>
                        </table>
                    </card>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import Countable from 'countable'
    import numeral from 'numeral'

    export default {
        data() {
            return {
                cu: this.$localStore.getItem(this.$localStore.Keys.USER_KEY),   // 当前登录用户
                article: null,
                loading: false,
                isShowRawArticle: true,

                adCounter: {
                    all: 0,
                    characters: 0,
                    paragraphs: 0,
                    sentences: 0,
                    words: 0,
                },
                atCounter: {
                    all: 0,
                    characters: 0,
                    paragraphs: 0,
                    sentences: 0,
                    words: 0,
                },
            }
        },
        computed: {
            // 原文信息
            rawArticleInfo() {
                let a = this.article,
                    c = this.adCounter
                return [
                    {
                        label: '段落数',
                        title: '正文段落数',
                        value: numeral(c.paragraphs).format(','),
                    },
                    {
                        label: '词数',
                        title: '正文词数',
                        value: numeral(c.words).format(','),
                    },
                    {
                        label: '字数',
                        title: '正文字数',
                        value: numeral(c.characters).format(','),
                    },
                    {
                        label: '字符数',
                        title: '正文字符数，包括空格在内的一切字符',
                        value: numeral(c.all).format(','),
                    },
                    {
                        label: '原文作者',
                        title: '',
                        value: a['Article_Author'] ? a['Article_Author'] : '',
                    },
                    {
                        label: '采集时间',
                        title: '',
                        value: a['Extracted_Time'] ? a['Extracted_Time'] : '',
                    },
                    {
                        label: '发布时间',
                        title: '',
                        value: a['Article_PubTime'] ? a['Article_PubTime'] : '',
                    },
                    {
                        label: '原文链接',
                        title: '',
                        value: a['Article_URL'] ? `<a href="${a['Article_URL']}" target="_blank">${a['Article_URL']}</a>` : '',
                    },
                ]
            },
            // 译文信息
            tranArticleInfo() {
                let c = this.atCounter
                return [
                    {
                        label: '段落数',
                        title: '正文段落数',
                        value: numeral(c.paragraphs).format(','),
                    },
                    {
                        label: '词数',
                        title: '正文词数',
                        value: numeral(c.words).format(','),
                    },
                    {
                        label: '字数',
                        title: '正文字数',
                        value: numeral(c.characters).format(','),
                    },
                    {
                        label: '字符数',
                        title: '正文字符数，包括空格在内的一切字符',
                        value: numeral(c.all).format(','),
                    },
                ]
            },
            // 操作信息
            actionInfo() {
                let a = this.article
                let isSelected = a['Is_Selected'] === 1
                return [
                    {
                        label: '阅读',
                        title: '',
                        value: a['Read_User_Name'] ? a['Read_User_Name'] : '',
                    },
                    {
                        label: '阅读时间',
                        title: '',
                        value: a['Read_Time'] ? a['Read_Time'] : '',
                    },
                    {
                        label: '选择',
                        title: '',
                        value: isSelected ? (a['Selected_User_Name'] ? a['Selected_User_Name'] : '') : '',
                    },
                    {
                        label: '选择时间',
                        title: '',
                        value: isSelected ? (a['Selected_Time'] ? a['Selected_Time'] : '') : '',
                    },
                    {
                        label: '翻译',
                        title: '',
                        value: a['Translate_User_Name'] ? a['Translate_User_Name'] : '',
                    },
                    {
                        label: '翻译开始',
                        title: '',
                        value: a['Translate_Start_Time'] ? a['Translate_Start_Time'] : '',
                    },
                    {
                        label: '翻译完成',
                        title: '',
                        value: a['Translate_End_Time'] ? a['Translate_End_Time'] : '',
                    },
                    {
                        label: '最后更新',
                        title: '',
                        value: a['Translate_Last_Update_Time'] ? a['Translate_Last_Update_Time'] : '',
                    },
                ]
            }
        },
        methods: {
            /**
             * 处理点击开始校对的按钮
             *
             * @param {object} article 当前文章
             */
            start(article) {
                let params = {
                    Article_Translate_ID: article.Article_Translate_ID,
                    Translate_Status: 'RW',
                }
                this.$api.proofreading.status(params).then(resp => {
                    let data = resp.data
                    if (data.error) {
                        this.$Message.error(data.error.message)
                    } else {
                        // 跳转到翻译界面
                        this.$router.push(`/proofreading/proofread/${params.Article_Translate_ID}`)
                    }
                }).catch(err => {

                })
            },

            /**
             * 获取文章
             */
            getArticle() {
                if (!this.$route.params.id) return

                this.loading = true
                this.article = null
                this.$api.proofreading.detail({id: this.$route.params.id}).then(resp => {
                    this.loading = false
                    this.article = resp.data

                    this.$nextTick(() => {
                        let adEl = document.getElementById('article-content')
                        let atEl = document.getElementById('translate-content')
                        if (adEl) {
                            Countable.count(adEl, counter => {
                                this.adCounter = counter
                            })
                        }
                        if (atEl) {
                            Countable.count(atEl, counter => {
                                this.atCounter = counter
                            })
                        }
                    })
                })
            },

        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.getArticle()
            })
        }
    }
</script>

<style>

</style>