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
                <button-group size="small" class="nsc-header-right-item">
                    <i-button @click="$router.back()"
                              title="向后"
                              icon="ios-arrow-back"></i-button>
                    <i-button @click="$router.forward()"
                              title="向前"
                              icon="ios-arrow-forward"></i-button>
                </button-group>

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
                        <span>{{userInfo['User_Name']}}</span>
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
                <!--  -->
                <div class="nsc-body-right-nav">
                    <div class="nsc-body-right-nav-left">
                        <slot name="nav-left"></slot>
                    </div>
                    <div class="nsc-body-right-nav-right">
                        <slot name="nav-right"></slot>
                    </div>
                </div>
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
                        link: '/extraction',
                        icon: 'md-download',
                        label: '采集库',
                    },
                    {
                        link: '/translation',
                        icon: 'md-swap',
                        label: '待译库',
                    },
                    {
                        link: '/proofreading',
                        icon: 'md-done-all',
                        label: '待校库',
                    },
                    {
                        link: '/audit',
                        icon: 'ios-create',
                        label: '待编库',
                    },
                    {
                        link: '/finished',
                        icon: 'md-filing',
                        label: '成稿库',
                    },
                    {
                        link: '/management',
                        icon: 'ios-build',
                        label: '管理',
                    },
                    {
                        link: '/personal-center',
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
            },
        },
    }
</script>

<style lang="less"></style>