<template>
  <div class="login">
    <el-row class="layout">
      <el-col  class="loginBox" :xl="{span:6,offset:9}" :xs="24" :sm="24" :md="24" :lg="{span:6,offset:9}">
        <div class="login-form">
          <el-form label-width="60px" label-position="right" ref="ruleForm" :rules="rules" :model="ruleForm" status-icon>
            <el-form-item class="loginText"  label="账户" prop="username">
              <el-input type="text" v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item  class="loginText" label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login('ruleForm')">登陆</el-button>
              <el-button @click="reset('ruleForm')">注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "Login",
    data() {
      return {
        ruleForm: {
          username: "",
          password: ""
        },
        rules: {
          username: [{
            required: true,
            message: "请输入用户名或斗鱼id",
            trigger: "blur"
          }],
          password: [{
              required: true,
              message: "请输入密码",
              trigger: "blur"
            },
            {
              min: 6,
              max: 20,
              message: "长度在6-20之间",
              trigger: "blur"
            }
          ]
        }
      };
    },
    methods: {
      login(formName) {
        let selt = this;
        this.$refs[formName].validate(vaild => {
          if (vaild) {
            axios
              .post("/login", {
                username: this.ruleForm.username,
                password: this.ruleForm.password
              })
              .then(function (response) {
                if(response.data.roles.manager==3)selt.$router.push("/index/total");
                else if(response.data.roles.query==3){
                  selt.$router.push("/index/query");
                }else{
                  selt.$router.push("index");
                }
              })
              .catch(function (error) {
                selt.$message.error(error.response.data);
              });
          } else {
            return false;
          }
        });
      },
      reset(formName) {
        this.$router.push("/register");
      }
    }
  };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .loginText label{
    color:gray;
    width: 100%;
    height: 100%;
  }

  .login .layout {
    margin-top: 300px;
  }

  .loginBox{
    background: #fff;
    padding: 2em;
    opacity: 0.9;
  }


</style>
