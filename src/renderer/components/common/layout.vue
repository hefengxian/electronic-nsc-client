<template>
    <div class="nsc">
        <div class="nsc-header">
            <div class="nsc-header-left">
                <a href="">
                    <img src="static/images/logo/logo.png"
                         alt="LOGO">
                    <span>外文体育信息采编系统</span>
                </a>
            </div>
            <div class="nsc-header-right">
                <a href="static/help.html"
                   target="_blank"
                   class="nsc-header-right-item">
                    <icon type="md-help-circle"></icon> 使用帮助
                </a>

                <dropdown transfer
                          placement="bottom-end"
                          trigger="click">
                    <div class="nsc-header-right-item">
                        <avatar icon="ios-person"/> &nbsp;
                        <span>{{userInfo['User_Name']}}_{{userInfo['User_Account']}}</span>
                        <icon type="md-arrow-dropdown"></icon>
                    </div>
                    <DropdownMenu slot="list">
                        <DropdownItem>
                            <icon type="ios-person"></icon>
                            个人中心
                        </DropdownItem>
                        <DropdownItem divided @click.native="logout">
                            <icon type="md-power"></icon>
                            退出
                        </DropdownItem>
                    </DropdownMenu>
                </dropdown>
            </div>
        </div>
        <div class="nsc-body">
            <div class="nsc-body-left">
                <div class="nsc-body-left-avatar">
                    <avatar icon="ios-person"/>
                </div>
                <ul class="nsc-body-left-menu">
                    <li v-for="(m, key) in menus" :key="key">
                        <router-link :to="m.link">
                            <icon size="20" :type="m.icon"></icon>
                            <span>{{m.label}}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="nsc-body-right">
                <slot name="body-right"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "layout",
        data() {
            let userInfo = this.$localStore.getItem(this.$localStore.Keys.USER_KEY)
            return {
                userInfo,
                menus: [
                    {
                        link: '/dashboard',
                        icon: 'ios-analytics',
                        label: '主页',
                    },
                    {
                        link: '/extraction-list',
                        icon: 'md-download',
                        label: '采集库',
                    },
                    {
                        link: '',
                        icon: 'md-swap',
                        label: '待译库',
                    },
                    {
                        link: '',
                        icon: 'md-done-all',
                        label: '待校库',
                    },
                    {
                        link: '',
                        icon: 'ios-create',
                        label: '待编库',
                    },
                    {
                        link: '',
                        icon: 'md-filing',
                        label: '成稿库',
                    },
                    {
                        link: '',
                        icon: 'ios-build',
                        label: '管理',
                    },
                    {
                        link: '',
                        icon: 'ios-person',
                        label: '个人中心',
                    },
                ],
            }
        },
        methods: {
            logout() {
                this.$localStore.clear()
                this.$router.push('/login')
            }
        },
    }
</script>

<style lang="less">

    .nsc {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vm;
        background-color: #f2f4f8;
        overflow: hidden;

        &-header {
            height: 60px;
            background-color: #fff;
            padding: 0 16px;
            display: flex;
            box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(0, 0, 0, 0.05);
            align-items: center;

            &-left {
                flex: 1;

                & a {
                    display: inline-block;
                    font-size: 20px;
                    font-weight: 700;
                    line-height: 60px;
                    color: #000;

                    & img {
                        max-height: 30px;
                        display: inline-block;
                        padding-right: 8px;
                        vertical-align: middle;
                        margin-top: -4px;
                    }
                }
            }
            &-right {
                flex: 1;
                display: flex;
                justify-content: flex-end;

                &-item {
                    line-height: 32px;
                    cursor: pointer;
                    margin-right: 16px;
                    user-select: none;

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
        }

        &-body {
            overflow: hidden;
            flex: 1;
            display: flex;

            &-left {
                height: 100vh;
                width: 70px;
                overflow: auto;
                background-color: #07080b;
                display: flex;
                flex-direction: column;
                // justify-content: center;
                padding: 16px 0;
                align-items: center;

                &-avatar {
                    padding-bottom: 16px;
                }

                &-menu {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    display: block;
                    width: 70px;

                    & li {
                        position: relative;
                        display: block;
                         &:hover a i, &:focus a i {
                             margin-top: -50px;
                         }

                        & a {
                            position: relative;
                            display: block;
                            padding: 0;
                            text-align: center;
                            height: 50px;
                            line-height: 50px;
                            overflow-y: hidden;
                            border: none;
                            color: #fff;

                            &:hover {
                                background-color: #2b85e4;
                            }

                            & i {
                                width: auto;
                                display: block;
                                margin: 0;
                                line-height: 50px;
                                border: none !important;
                                transition: margin-top 0.2s;
                            }
                        }


                    }
                }
            }
            &-right {
                height: 100vh;
                overflow: auto;
                padding: 0 16px;
                flex: 1;
            }
        }
    }

</style>