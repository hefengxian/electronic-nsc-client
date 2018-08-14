<template>
    <div>
        <!-- 页头 -->
        <div class="nsc-body-right-nav">
            <div class="nsc-body-right-nav-left">
                <Breadcrumb>
                    <BreadcrumbItem to="/audit">
                        <icon type="md-create"></icon>
                        成稿库
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
                    <i-button @click="handleExport"
                              icon="md-create">导出 TXT</i-button>

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
                                    <p class="article-title">{{article.Audit_Title}}</p>
                                    <div class="article-content"
                                         id="translate-content"
                                         v-html="article.Audit_Content"></div>
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
                                    <Rate disabled
                                          style="font-size: 12px"
                                          :value="article.Translate_Score_By_Review ? article.Translate_Score_By_Review : 0" />
                                </td>
                            </tr>
                            <tr>
                                <td>编辑评分:</td>
                                <td><Rate disabled
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
    import Qs from 'query-string'

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
                        label: '校对',
                        title: '',
                        value: a['Review_User_Name'] ? a['Review_User_Name'] : '',
                    },
                    {
                        label: '校对开始',
                        title: '',
                        value: a['Review_Start_Time'] ? a['Review_Start_Time'] : '',
                    },
                    {
                        label: '校对完成',
                        title: '',
                        value: a['Review_End_Time'] ? a['Review_End_Time'] : '',
                    },
                    {
                        label: '编辑',
                        title: '',
                        value: a['Audit_User_Name'] ? a['Audit_User_Name'] : '',
                    },
                    {
                        label: '编辑开始',
                        title: '',
                        value: a['Audit_Start_Time'] ? a['Audit_Start_Time'] : '',
                    },
                    {
                        label: '编辑完成',
                        title: '',
                        value: a['Audit_End_Time'] ? a['Audit_End_Time'] : '',
                    },
                ]
            }
        },
        methods: {

            /**
             * 获取文章
             */
            getArticle() {
                if (!this.$route.params.id) return

                this.loading = true
                this.article = null
                this.$api.audit.detail({id: this.$route.params.id}).then(resp => {
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

            /**
             * 导出
             */
            handleExport() {
                let params = {
                    ids: this.article.Article_Translate_ID,
                    type: 'txt'
                }
                let url = `${window.BASE_URL}/public/export?${Qs.stringify(params)}`
                location.href = url
            }
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