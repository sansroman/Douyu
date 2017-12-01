<template>
  <div class="login">
    <el-row :gutter="10" class="layout">
      <el-col :span="4" :offset="10">
          <div class="login-form">
              <el-form label-width="50px" label-position="right">
                <el-form-item label="账户">
                  <el-input type="text" v-model="formData.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input type="password" v-model="formData.password"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">登陆</el-button>
                  <el-button>忘记密码</el-button>
                </el-form-item>
              </el-form>
          </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return{
      formData : {
        username:'',
        password:''
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body{
  width: 100%;
  height: 100%;
  background:#e6e6e6;
}

.layout{
  margin-top:300px;
}
.login-form{
  background: #fff;
  padding: 2em 2em 1em 2em;
}
.login-form label{
    color: #000;
    font-weight: 500;
}

</style>
