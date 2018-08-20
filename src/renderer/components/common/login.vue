<template>
    <div class="nsc-login">
        <div v-for="(src, key) in bgImages"
             :style="{'background-image': `url(static/images/backgrounds/${src})`, opacity: key === bgIndex ? 1 : 0}"

             class="background-image"></div>
        <div class="login-container">
            <div class="logo">
                <img src="static/images/logo/logo.png" alt="LOGO">
            </div>
            <div class="title">外文体育信息采编系统</div>
            <p class="sub-title">用户登录</p>
            <div class="login-form" @keypress.enter="handleSubmit">
                <div class="form-item">
                    <input type="text"
                           v-model="username"
                           placeholder="账号">
                </div>
                <div class="form-item">
                    <input type="password"
                           v-model="password"
                           placeholder="密码">
                </div>
            </div>
            <div class="submit">
                <i-button type="primary"
                          @click="handleSubmit"
                          :loading="loading"
                          size="large"
                          long>登 录</i-button>
            </div>

            <div class="copyright">
                <p>&copy; 国家体育总局体育信息中心</p>
            </div>
        </div>

        <!-- 预加载，避免图片切换的时候闪屏 -->
        <!--<img v-for="(src, key) in bgImages"
             :src="`static/images/backgrounds/${src}`"
             :key="key"
             alt="preload"
             style="display: none">-->
    </div>
</template>

<script>
    const bgImages = [
        '0001.jpg',
        '0002.jpg',
        '0004.jpg',
        '0005.jpg',
        '0006.jpg',
        '0007.jpg',
        '03309_damnationcreektrail_1920x1080.jpg',
        '04115_victoriasview_1920x1080.jpg',
        '04118_friolero_1920x1080.jpg',
        '04134_sassolungo_1920x1080.jpg',
        '04140_coloradobackroad_1920x1080.jpg',
        '04149_mountainlake_1920x1080.jpg',
        '04151_landmannalaugarinthesummer_1920x1080.jpg',
        '04156_coloursofmiddleearth_1920x1080.jpg',
        '04158_morningatthedeschutes_1920x1080.jpg'
    ]
    export default {
        name: 'Login',
        data () {
            return {
                loading: false,
                username: '',
                password: '',
                bgIndex: Math.floor(Math.random() * bgImages.length),
                intervalId: null,
                bgImages,
            }
        },
        created () {
            // 首页图片轮换
            if (this.intervalId == null) {
                this.intervalId = setInterval(() => {
                    this.bgIndex = Math.floor(Math.random() * bgImages.length)
                }, 5000)
            }
        },
        computed: {
            loginBGImage () {
                return {
                    'background-image': `url(static/images/backgrounds/${bgImages[this.bgIndex]})`
                }
            }
        },
        methods: {
            handleSubmit() {
                let data = {
                    grant_type: 'password',
                    client_id: '',
                    client_secret: '',
                    scope: '',
                    username: this.username,
                    password: this.password,
                }
                this.loading = true
                this.$api.public.login(data).then(resp => {
                    this.loading = false
                    let oauth = resp.data
                    // 存储 Token 信息
                    this.$localStore.setItem(this.$localStore.Keys.OAUTH_KEY, oauth)
                    // 设置 axios 请求头
                    this.$api.setAuthorization(oauth)

                    // 获取其他信息；用户信息，权限信息
                    Promise.all([
                        this.$api.system.userInfo(),
                        this.$api.system.privileges(),
                    ]).then(responses => {
                        this.$localStore.setItem(this.$localStore.Keys.USER_KEY, responses[0].data)
                        this.$localStore.setItem(this.$localStore.Keys.PRIVILEGE_KEY, responses[1].data)
                        // 跳转
                        this.$router.push('/dashboard')
                    })
                }).catch(e => {
                    this.loading = false
                    if (e.response && e.response.data.error === 'invalid_credentials') {
                        this.$Message.error("账号或者密码错误")
                    }
                })
            },
        },
        beforeDestroy () {
            if (this.intervalId != null) {
                clearInterval(this.intervalId)
            }
        },
        beforeRouteEnter(to, from, next) {

            let Vue = require('vue').default
            if (Vue.localStore.getItem(Vue.localStore.Keys.OAUTH_KEY)) {
                // 如果用户已经登录了，直接进入主页
                next('/dashboard')
            } else {
                next()
            }
        }
    }
</script>

<style lang="less">
    .nsc-login {
        width: 100%;
        height: 100vh;
        overflow: hidden;

        & .background-image {
            width: 100%;
            height: 100vh;
            left: 0;
            top: 0;
            position: absolute;
            overflow: hidden;
            z-index: -1;
            background-size: cover;
            backface-visibility: hidden;
            transition: all 1s ease-in-out;
        }

        & .login-container {
            width: 360px;
            height: 100vh;
            padding-top: 10vh;
            margin: auto;

            & .logo {
                margin-bottom: 16px;
                text-align: center;
            }

            & .title {
                font-size: 28px;
                font-weight: 700;
                text-align: center;
                color: #fff;
            }

            & .sub-title {
                margin: 16px 0;
                text-align: center;
                color: #fff;
            }

            & .login-form {
                margin-top: 16px;
                border-radius: 4px;
                background-color: #fff;

                & .form-item {
                    padding: 10px 15px;
                    font-size: 14px;

                    & input {
                        width: 100%;
                        height: 34px;
                        display: block;
                        padding: 6px 12px;
                        border-radius: 2px;
                        border-width: 0;
                        border-color: transparent;
                    }
                    & input:focus {
                        outline: 0;
                    }
                }
            }

            & .submit {
                margin-top: 32px;
            }

            & .copyright {
                margin-top: 32px;
                color: #fff;
                text-align: center;
            }
        }
    }
</style>
