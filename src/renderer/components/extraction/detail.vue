<template>
    <div>
        <!-- 页头 -->
        <div class="nsc-body-right-nav">
            <div class="nsc-body-right-nav-left">
                <Breadcrumb>
                    <BreadcrumbItem to="/extraction">
                        <icon type="md-download"></icon>
                        采集库
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <icon type="md-paper"></icon>
                        原文详情
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>
            <div class="nsc-body-right-nav-right"></div>
        </div>

        <!-- 内容 -->
        <div class="loading" v-if="loading">
            Loading...
        </div>

        <div v-if="error"
             class="error">
            {{ error }}
        </div>

        <div v-if="article"
             class="content">
            <card dis-hover
                  :bordered="false"
                  class="article-detail">

                <!-- 操作 -->
                <div class="article-action">
                    <div>
                        <i-button @click="$router.push(`/extraction/edit/${article.Article_Detail_ID}`)"
                                  icon="md-create">编辑
                        </i-button>
                        <i-button @click="handleActions('select')" v-if="article.Is_Selected !== 1" icon="md-checkmark">
                            选择
                        </i-button>
                        <i-button @click="handleActions('unselect')" v-if="article.Is_Selected !== 0" icon="md-close">
                            取消选择
                        </i-button>
                        <i-button @click="handleActions('delete')" icon="md-trash">删除</i-button>
                        <i-select style="width: 200px"
                                  @on-change="handleOnUserChange"
                                  clearable
                                  v-model="translateUserID"
                                  :disabled="article.Is_Selected !== 1"
                                  placeholder="指定翻译人员">
                            <i-option v-for="(user, key) in currentGroupUser"
                                      :label="user.User_Name"
                                      :value="user.User_ID"
                                      :key="key"></i-option>
                        </i-select>
                    </div>
                </div>

                <div class="article-title">
                    {{article.Article_Title}}
                </div>

                <ul class="article-meta">
                    <li>
                        来源：<a :href="article.Article_URL" target="_blank">
                        <icon type="ios-link"></icon>
                        {{article.Article_Source}}
                    </a>
                    </li>
                    <li>发布：{{article.Article_PubTime}}</li>
                    <li>作者：{{article.Article_Author}}</li>
                </ul>

                <hr style="margin: 20px 0;">

                <!--<div v-if="article.Article_Abstract"
                     class="article-abstract note-info">{{article.Article_Abstract}}</div>-->

                <div class="article-content"
                     id="article-content"
                     v-html="article.Article_Content"></div>
            </card>
            <div class="info">
                <card dis-hover :bordered="false">
                    <div slot="title"><Icon type="md-information-circle" /> 详细信息</div>
                    <table>
                        <tr v-for="(item, key) in articleInfo"
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
</template>

<script>
    import Countable from 'countable'
    import numeral from 'numeral'

    export default {
        name: "translation-detail",
        data() {
            return {
                loading: false,
                error: null,
                article: null,
                currentGroupUser: [],
                translateUserID: '',
                counter: {
                    all: 0,
                    characters: 0,
                    paragraphs: 0,
                    sentences: 0,
                    words: 0,
                },
            }
        },
        created() {
            this.$api.system.currentGroupUser().then(resp => {
                this.currentGroupUser = resp.data
            })
            // this.getArticle()
        },
        computed: {
            articleInfo() {
                let a = this.article,
                    c = this.counter

                let isSelected = a['Is_Selected'] === 1

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
                ]
            }
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            // '$route': 'getArticle'
        },
        methods: {
            /**
             * 获取文章详情
             */
            getArticle() {
                if (!this.$route.params.id) return

                let id = this.$route.params.id

                this.error = this.article = null
                this.loading = true
                this.$api.extraction.detail({id}).then(resp => {
                    this.loading = false
                    this.article = resp.data
                    this.translateUserID = resp.data.Translate_User_ID ? resp.data.Translate_User_ID : ''
                    this.$nextTick(() => {
                        let el = document.getElementById('article-content')
                        if (el) {
                            Countable.count(el, counter => {
                                this.counter = counter
                            })
                        }
                    })
                }).catch(e => {
                    this.loading = false
                    this.error = e
                })
            },


            /**
             * 选择或者取消选择选定的文章
             *
             * @param {int} id 要操作的文章 ID
             * @param {boolean} action true 表示选择，false 表示取消选择
             */
            doSelect(id, action = true) {
                this.$api.extraction.select({ids: id, action: action ? 1 : 0}).then(resp => {
                    this.getArticle()
                })
            },


            /**
             * 操作的点击事件处理方法
             *
             * @param {string} type 类型，用来标记选择的是哪一项
             */
            handleActions(type) {
                let id = this.article['Article_Detail_ID']
                switch (type) {
                    case 'select':
                        this.doSelect(id)
                        break;
                    case 'unselect':
                        this.doSelect(id, false)
                        break;
                    case 'delete':
                        this.$Modal.error({
                            title: '删除文章',
                            content: `确定要删除这 1 篇文章`,
                            onOk: () => {
                                // delete from server
                                this.$api.extraction.remove({ids: id}).then(resp => {
                                    this.$router.push('/extraction')
                                })
                            }
                        })
                        break;
                }
            },

            /**
             * 指定翻译人
             *
             * @param val 选择框的值
             */
            handleOnUserChange(val) {
                if (this.article.Article_Translate_ID) {
                    let params = {
                        Article_Translate_ID: this.article.Article_Translate_ID,
                        Translate_Status: val ? 'TW' : 'TN',
                        User_ID: val ? val : this.article.Translate_User_ID,
                    }
                    // 调用开始翻译接口
                    this.$api.translation.status(params).then(resp => {
                        let data = resp.data
                        if (data.error) {
                            this.$Message.error(data.error.message)
                        } else {
                            this.$Message.success(val ? '设置成功' : '取消成功')
                            this.getArticle()
                        }
                    }).catch(err => {
                        this.$Message.error('设置失败')
                    })
                }
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.getArticle()
            })
        },
    }
</script>

<style lang="less">
</style>