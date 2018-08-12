<template>
    <layout>
        <!-- 页头 -->
        <div slot="nav-left">
            <Breadcrumb>
                <BreadcrumbItem>
                    <icon type="md-paper"></icon>
                    原文详情
                </BreadcrumbItem>
            </Breadcrumb>
        </div>

        <!-- 内容 -->
        <div slot="body-right">
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
                            <i-button @click="$router.push(`/extraction/edit/${article.Article_Detail_ID}`)" icon="md-create">编辑</i-button>
                            <i-button @click="handleActions('select')" v-if="article.Is_Selected !== 1" icon="md-checkmark">选择</i-button>
                            <i-button @click="handleActions('unselect')" v-if="article.Is_Selected !== 0" icon="md-close">取消选择</i-button>
                            <i-button @click="handleActions('delete')" icon="md-trash">删除</i-button>
                            <i-select style="width: 200px"
                                      @on-change="handleOnUserChange"
                                      @on-clear="handleOnUserChange"
                                      clearable
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

                    <div v-if="article.Article_Abstract"
                         class="article-abstract note-info">{{article.Article_Abstract}}</div>

                    <div class="article-content"
                         id="article-content"
                         v-html="article.Article_Content"></div>
                </card>
                <div class="info">
                    <card dis-hover :bordered="false">
                        <table>
                            <tr v-for="(item, key) in articleInfo"
                                :title="item.title"
                                :key="key">
                                <td>{{item.label}}:</td>
                                <td>{{item.value}}</td>
                            </tr>
                        </table>
                    </card>
                </div>
            </div>
        </div>
    </layout>
</template>

<script>
    import Countable from 'countable'
    import numeral from 'numeral'

    export default {
        name: "translation-detail",
        data () {
            return {
                loading: false,
                error: null,
                article: null,
                currentGroupUser: [],
                counter: {
                    all: 0,
                    characters: 0,
                    paragraphs: 0,
                    sentences: 0,
                    words: 0,
                },
            }
        },
        created () {
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
            getArticle () {
                if (!this.$route.params.id) return

                let id = this.$route.params.id

                this.error = this.article = null
                this.loading = true
                this.$api.extraction.detail({id}).then(resp => {
                    this.loading = false
                    this.article = resp.data
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
            doSelect (id, action = true) {
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

            handleOnUserChange(val) {
                console.log(val)
            }
        },
        components: {
            layout: require('../common/layout').default,
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getArticle()
            })
        },
    }
</script>

<style lang="less">
    .nsc-body-right {
        .content {
            display: flex;
            flex-direction: row;

            & .article-detail {
                flex: 1;

                & .article-action {
                    display: flex;
                    justify-content: flex-end;
                }

                & ul.article-meta {
                    text-align: center;
                    font-size: 12px;
                    & li {
                        display: inline-block;
                        padding: 0 16px;
                    }
                }

                & .article-title {
                    font-size: 35px;
                    line-height: 35px;
                    padding: 40px 0;
                    text-align: center;
                }
                & .article-abstract, & .article-content {
                    font-size: 18px;
                    letter-spacing: 1px;
                    font-weight: 400;
                    line-height: 32px;
                    margin-bottom: 50px;
                    margin-left: auto;
                    margin-right: auto;
                    width: 670px;
                    white-space: pre-line;
                    word-break: break-all;
                    word-wrap: break-word;

                    // 限制图片的最大宽度
                    img {
                        max-width: 660px !important;
                        text-align: center;
                    }

                    & p {
                        margin-bottom: 30px;
                    }
                }
                & .article-abstract {
                    padding: 15px 30px 15px 15px;
                    border-left: 5px solid #eee;
                    border-radius: 0 4px 4px 0;
                    &.note-info {
                        background-color: #f5f8fd;
                        border-color: #8bb4e7;
                        color: #010407;
                    }
                }
            }

            .info {
                margin-left: 16px;
                width: 340px;
                & table {
                    width: 100%;
                    table-layout: fixed;
                    & tr td {
                        padding: 3px 8px;
                        font-size: 12px;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;

                        &:first-child {
                            text-align: right;
                            width: 80px;
                        }
                    }
                }
            }
        }
    }
</style>