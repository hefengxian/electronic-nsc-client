<template>
    <layout>
        <div slot="body-right">
            <div style="padding: 16px 0;">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <icon type="md-download"></icon>
                        采集库
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>

            <card dis-hover
                  class="nsc-form"
                  :bordered="false">
                <i-form label-position="top" v-model="form">
                    <row :gutter="24">
                        <i-col :span="6">
                            <form-item label="采集时间">
                                <DatePicker type="daterange"
                                            :options="datepickerOptions"
                                            placement="bottom-start"
                                            split-panels
                                            placeholder="选择日期范围"
                                            style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col :span="6">
                            <form-item label="选择状态">
                                <i-select v-model="form.selected">
                                    <i-option value=""></i-option>
                                    <i-option value="1">已选</i-option>
                                    <i-option value="0">未选</i-option>
                                </i-select>
                            </form-item>
                        </i-col>
                        <i-col :span="6">
                            <form-item label="原文语种">
                                <i-select v-model="form.language">
                                    <i-option value=""></i-option>
                                    <i-option v-for="(lan, key) in languages"
                                              :key="key"
                                              :value="lan.value">{{lan.label}}
                                    </i-option>
                                </i-select>
                            </form-item>
                        </i-col>
                        <i-col :span="6">
                            <form-item label="关键词">
                                <i-input placeholder="关键词：标题、摘要、作者"
                                         v-model="form.keyword"
                                         search></i-input>
                            </form-item>
                        </i-col>
                    </row>
                </i-form>
            </card>

            <card dis-hover
                  class="nsc-list margin-top-16"
                  :bordered="false">
                <div class="nsc-list-header">
                    <div class="nsc-list-header-left">
                        <Dropdown placement="bottom-start" trigger="click">
                            <Button>
                                批量...
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem>标记已读</DropdownItem>
                                <DropdownItem>选择</DropdownItem>
                                <DropdownItem>取消选择</DropdownItem>
                                <DropdownItem divided>删除</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Button>
                            <icon type="md-add"></icon>
                            新建文章
                        </Button>
                    </div>
                    <div class="nsc-list-header-right">
                    </div>
                </div>
                <div class="nsc-list-body margin-top-8 margin-bottom-8">
                    <!--<i-table :columns="columns" :data="listData.data"></i-table>
                    <br>-->
                    <div class="ivu-table-wrapper ivu-table ivu-table-default" style="">
                        <table style="width: 100%; border: 0;" cellspacing="0" cellpadding="0">
                            <thead>
                            <tr>
                                <th class="ivu-table-cell ivu-table-column-center" style="width: 50px">
                                    <checkbox ></checkbox>
                                </th>
                                <th class="ivu-table-cell" >标题/摘要</th>
                                <th class="ivu-table-cell" style="width: 150px">来源</th>
                                <th class="ivu-table-cell ivu-table-column-center" style="width: 150px">采集时间</th>
                                <th class="ivu-table-cell ivu-table-column-center" style="width: 200px">操作</th>
                            </tr>
                            </thead>
                            <tbody class="ivu-table-tbody">
                            <tr v-for="(article, key) in listData.data"
                                @mouseenter="$set(article, '_showAction', true)"
                                @mouseleave="$set(article, '_showAction', false)"
                                :key="key">
                                <td class="ivu-table-cell ivu-table-column-center">
                                    <checkbox ></checkbox>
                                </td>
                                <td class="ivu-table-cell">{{article.Article_Title}}</td>
                                <td class="ivu-table-cell">{{article.Article_Source}}</td>
                                <td class="ivu-table-cell ivu-table-column-center">{{article.Extracted_Time}}</td>
                                <td class="ivu-table-cell ivu-table-column-center">
                                    <ButtonGroup
                                                 v-if="article._showAction">
                                        <Button icon="md-eye"></Button>
                                        <Button icon="md-checkmark"></Button>
                                        <Button icon="md-trash"></Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="nsc-list-footer">
                    <div class="nsc-list-footer-left">
                    </div>
                    <div class="nsc-list-footer-right">
                        <Page :total="listData.total"
                              style="font-size: 12px;"
                              show-elevator
                              placement="top"
                              show-sizer/>
                    </div>
                </div>
            </card>
        </div>
    </layout>
</template>

<script>
    import api from '../../api/'

    export default {
        data () {
            return {
                form: {
                    extracted_time: '',
                    selected: '',
                    language: '',
                    keyword: '',
                },
                languages: [
                    {
                        value: 'zh-cn',
                        label: '汉语',
                    },
                    {
                        value: 'en',
                        label: 'English',
                    },
                ],
                datepickerOptions: {
                    shortcuts: [
                        {
                            text: '今天',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '昨天',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近 7 天',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        }
                    ]
                },
                columns: [
                    {
                        type: 'selection',
                        width: 50,
                        align: 'center'
                    },
                    {
                        title: '标题/摘要',
                        key: 'Article_Title',
                    },
                    {
                        title: '来源',
                        width: 150,
                        key: 'Article_Source',
                    },
                    {
                        title: '采集时间',
                        width: 150,
                        key: 'Extracted_Time',
                    },
                    {
                        title: '操作',
                        width: 150,
                        render(h, params) {
                            return '...'
                        }
                    },
                ],
                listData: {
                    data: [
                        {
                            "Article_Detail_ID": "1",
                            "Article_Content_ID": null,
                            "Website_Group_ID": null,
                            "Author_ID": null,
                            "Author_Raw_ID": null,
                            "Website_No": "S0001",
                            "Domain_Code": null,
                            "Media_Type_Code": "O",
                            "RefPage_Type": null,
                            "RefPage_URL_ID": null,
                            "Is_Manual_Added": "0",
                            "Website_Column_Level": "0",
                            "Website_Important_Level": "B",
                            "Article_URL": "https:\/\/vue-loader.vuejs.org\/guide\/pre-processors.html#sass",
                            "Article_Title": "Hello Test",
                            "Article_Abstract": null,
                            "Article_Focus_Keywords": null,
                            "Article_Search_Keywords": null,
                            "Article_Emotion_Keywords": null,
                            "Record_MD5_ID": "6419c0a50744051e66f4ef3cea894a26",
                            "Article_Title_FingerPrint": null,
                            "Article_Content": "Hello",
                            "Article_Content_FingerPrint": null,
                            "Article_RawID": null,
                            "Article_Is_Reply": "0",
                            "Article_Reply_No": null,
                            "Article_Author": "Tom",
                            "Article_Source": "BBC Sport",
                            "Article_ViewCount": null,
                            "Article_ReplyCount": null,
                            "Article_ForwardCount": null,
                            "Article_PubTime_Str": null,
                            "Article_PubTime": "2018-08-10 02:11:45",
                            "Article_Section_ID": null,
                            "Article_Local_Htm_Filename": null,
                            "Article_Local_Img_Filename": null,
                            "Extracted_Time": "2018-08-10 02:11:45",
                            "Article_Emotion_Type": null,
                            "Processed_Flag": null,
                            "Attachment_Status": "N",
                            "Article_ImgSrc": null,
                            "Topic_Record_MD5_ID": null,
                            "Is_Need_Reply": "0",
                            "Node_ID": null,
                            "Microblog_Type": null,
                            "Video_Length": null,
                            "Province_Name": null,
                            "City_Name": null,
                            "County_Name": null,
                            "Importance_Score": null,
                            "Is_Read": "1",
                            "Read_Time": "2018-08-10 02:11:47",
                            "Read_User_ID": "1",
                            "Is_Selected": "0",
                            "Selected_Time": "2018-08-10 02:11:45",
                            "Selected_User_ID": null,
                            "Raw_Language_Code": null,
                            "Read_User_Name": "\u8d85\u7ea7\u7ba1\u7406\u5458",
                            "Selected_User_Name": null
                        },
                        {
                            "Article_Detail_ID": "1",
                            "Article_Content_ID": null,
                            "Website_Group_ID": null,
                            "Author_ID": null,
                            "Author_Raw_ID": null,
                            "Website_No": "S0001",
                            "Domain_Code": null,
                            "Media_Type_Code": "O",
                            "RefPage_Type": null,
                            "RefPage_URL_ID": null,
                            "Is_Manual_Added": "0",
                            "Website_Column_Level": "0",
                            "Website_Important_Level": "B",
                            "Article_URL": "https:\/\/vue-loader.vuejs.org\/guide\/pre-processors.html#sass",
                            "Article_Title": "Hello Test",
                            "Article_Abstract": null,
                            "Article_Focus_Keywords": null,
                            "Article_Search_Keywords": null,
                            "Article_Emotion_Keywords": null,
                            "Record_MD5_ID": "6419c0a50744051e66f4ef3cea894a26",
                            "Article_Title_FingerPrint": null,
                            "Article_Content": "Hello",
                            "Article_Content_FingerPrint": null,
                            "Article_RawID": null,
                            "Article_Is_Reply": "0",
                            "Article_Reply_No": null,
                            "Article_Author": "Tom",
                            "Article_Source": "BBC Sport",
                            "Article_ViewCount": null,
                            "Article_ReplyCount": null,
                            "Article_ForwardCount": null,
                            "Article_PubTime_Str": null,
                            "Article_PubTime": "2018-08-10 02:11:45",
                            "Article_Section_ID": null,
                            "Article_Local_Htm_Filename": null,
                            "Article_Local_Img_Filename": null,
                            "Extracted_Time": "2018-08-10 02:11:45",
                            "Article_Emotion_Type": null,
                            "Processed_Flag": null,
                            "Attachment_Status": "N",
                            "Article_ImgSrc": null,
                            "Topic_Record_MD5_ID": null,
                            "Is_Need_Reply": "0",
                            "Node_ID": null,
                            "Microblog_Type": null,
                            "Video_Length": null,
                            "Province_Name": null,
                            "City_Name": null,
                            "County_Name": null,
                            "Importance_Score": null,
                            "Is_Read": "1",
                            "Read_Time": "2018-08-10 02:11:47",
                            "Read_User_ID": "1",
                            "Is_Selected": "0",
                            "Selected_Time": "2018-08-10 02:11:45",
                            "Selected_User_ID": null,
                            "Raw_Language_Code": null,
                            "Read_User_Name": "\u8d85\u7ea7\u7ba1\u7406\u5458",
                            "Selected_User_Name": null
                        },
                        {
                            "Article_Detail_ID": "1",
                            "Article_Content_ID": null,
                            "Website_Group_ID": null,
                            "Author_ID": null,
                            "Author_Raw_ID": null,
                            "Website_No": "S0001",
                            "Domain_Code": null,
                            "Media_Type_Code": "O",
                            "RefPage_Type": null,
                            "RefPage_URL_ID": null,
                            "Is_Manual_Added": "0",
                            "Website_Column_Level": "0",
                            "Website_Important_Level": "B",
                            "Article_URL": "https:\/\/vue-loader.vuejs.org\/guide\/pre-processors.html#sass",
                            "Article_Title": "Hello Test",
                            "Article_Abstract": null,
                            "Article_Focus_Keywords": null,
                            "Article_Search_Keywords": null,
                            "Article_Emotion_Keywords": null,
                            "Record_MD5_ID": "6419c0a50744051e66f4ef3cea894a26",
                            "Article_Title_FingerPrint": null,
                            "Article_Content": "Hello",
                            "Article_Content_FingerPrint": null,
                            "Article_RawID": null,
                            "Article_Is_Reply": "0",
                            "Article_Reply_No": null,
                            "Article_Author": "Tom",
                            "Article_Source": "BBC Sport",
                            "Article_ViewCount": null,
                            "Article_ReplyCount": null,
                            "Article_ForwardCount": null,
                            "Article_PubTime_Str": null,
                            "Article_PubTime": "2018-08-10 02:11:45",
                            "Article_Section_ID": null,
                            "Article_Local_Htm_Filename": null,
                            "Article_Local_Img_Filename": null,
                            "Extracted_Time": "2018-08-10 02:11:45",
                            "Article_Emotion_Type": null,
                            "Processed_Flag": null,
                            "Attachment_Status": "N",
                            "Article_ImgSrc": null,
                            "Topic_Record_MD5_ID": null,
                            "Is_Need_Reply": "0",
                            "Node_ID": null,
                            "Microblog_Type": null,
                            "Video_Length": null,
                            "Province_Name": null,
                            "City_Name": null,
                            "County_Name": null,
                            "Importance_Score": null,
                            "Is_Read": "1",
                            "Read_Time": "2018-08-10 02:11:47",
                            "Read_User_ID": "1",
                            "Is_Selected": "0",
                            "Selected_Time": "2018-08-10 02:11:45",
                            "Selected_User_ID": null,
                            "Raw_Language_Code": null,
                            "Read_User_Name": "\u8d85\u7ea7\u7ba1\u7406\u5458",
                            "Selected_User_Name": null
                        },
                    ],
                    total: 1
                }
            }
        },
        mounted () {
        },
        methods: {},
        components: {
            layout: require('../common/layout').default
        }
    }
</script>

<style lang="less">

</style>