<template>
  <div class="nsc-login" :style="loginBGImage">
    <div class="login-container">
      <div class="logo">
        <img src="static/images/logo/logo.png" alt="LOGO">
      </div>
      <div class="title">外文体育信息采编系统</div>
      <p class="info">用户登录</p>
      <div class="login-form">
        <div class="form-item">
          <input type="text" placeholder="账号">
        </div>
        <div class="form-item">
          <input type="password" placeholder="密码">
        </div>
      </div>
      <div class="submit">
        <i-button type="primary" size="large" long>登 录</i-button>
      </div>

      <div class="copyright">
        <p>&copy; 国家体育总局体育信息中心</p>
      </div>
    </div>
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
    data() {
      return {
        bgIndex: Math.floor(Math.random() * bgImages.length),
        intervalId: null
      }
    },
    created() {
      if (this.intervalId == null) {
        this.intervalId = setInterval(() => {
          this.bgIndex = Math.floor(Math.random() * bgImages.length)
        }, 5000)
      }
    },
    computed: {
      loginBGImage() {
        return {
          background: `url(static/images/backgrounds/${bgImages[this.bgIndex]})`
        }
      }
    },
    beforeDestroy() {
      if (this.intervalId != null) {
        clearInterval(this.intervalId)
      }
    }
  }
</script>

<style lang="less">
  .nsc-login {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    transition: all 1s ease-in-out;

    & .login-container {
      width: 360px;
      height: 100vh;
      padding-top: 100px;
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

      & .info {
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
