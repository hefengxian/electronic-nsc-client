<template>
    <div class="error-page">
        <div class="content-con">
            <img :src="src" alt="">
            <div class="text-con">
                <h4>{{ code }}</h4>
                <h5>{{ desc }}</h5>
            </div>
            <div>
                <Button size="large" type="text" @click="backHome">返回首页</Button>
                <Button size="large" type="text">返回上一页({{ second }}s)</Button>

            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "error-content",
        props: {
            code: String,
            desc: String,
            src: String
        },
        data () {
            return {
                second: 5,
                timer: null
            }
        },
        methods: {
            backHome () {
                this.$router.replace('/dashboard')
            },
            backPrev () {
                this.$router.back()
            }
        },
        mounted () {
            this.timer = setInterval(() => {
                if (this.second === 0) this.backPrev()
                else this.second--
            }, 1000)
        },
        beforeDestroy () {
            clearInterval(this.timer)
        }
    }
</script>

<style lang="less">
    .error-page {
        width: 100%;
        height: 100vh;
        position: relative;
        background: #f8f8f9;
        .content-con {
            width: 700px;
            height: 600px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -60%);
            img {
                display: block;
                width: 100%;
                height: 100%;
            }
            .text-con {
                position: absolute;
                left: 0px;
                top: 0px;
                h4 {
                    position: absolute;
                    left: 0px;
                    top: 0px;
                    font-size: 80px;
                    font-weight: 700;
                    color: #348EED;
                }
                h5 {
                    position: absolute;
                    width: 700px;
                    left: 0px;
                    top: 100px;
                    font-size: 20px;
                    font-weight: 700;
                    color: #67647D;
                }
            }
            .back-btn-group {
                position: absolute;
                right: 0px;
                bottom: 20px;
            }
        }
    }
</style>
