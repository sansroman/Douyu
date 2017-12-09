<template>
  <div class="login">
    <el-row :gutter="10" class="layout">
      <el-col :span="4" :offset="10">
          <div class="login-form">
              <el-form label-width="60px" label-position="right" :rules="rules" :model="formData" status-icon>
                <el-form-item label="账户" prop="username">
                  <el-input type="text" v-model="formData.username" ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input type="password" v-model="formData.password" ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="login">登陆</el-button>
                  <el-button @click="forget">忘记密码</el-button>
                </el-form-item>
              </el-form>
          </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "Login",
  data() {
    return {
      formData: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "请输入用户名或斗鱼id", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在6-20之间", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login(formData) {
      let router = this.$router;
      axios
        .post("/login", {
          username:this.formData.username,
          password:this.formData.password
        })
        .then(function(response) {
          console.log(response)
          let username =sessionStorage.setItem("username","1");
          let role =sessionStorage.setItem("roles","");
          router.push('/index');
        })
        .catch(function(error) {
          console.log(error);
        });

    },
    forget(formData) {
      axios
        .post("/api/register", {
          username:this.formData.username,
          password:this.formData.password
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body {
  width: 100%;
  height: 100%;
  background: #e6e6e6;
}

.layout {
  margin-top: 300px;
}
.login-form {
  background: #fff;
  padding: 2em 2em 1em 2em;
}
.login-form label {
  color: #000;
  font-weight: 500;
}
</style>
