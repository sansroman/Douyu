<template>
  <div class="login">
    <el-row :gutter="10" class="layout">
      <el-col :xl="{span:8,offset:8}" :xs="{span:22,offset:1}" :sm="{span:22,offset:1}" :md="{span:22,offset:1}" :lg="{span:8,offset:8}">
          <div id="register-form">
              <el-form label-width="100px" label-position="right" ref="ruleForm" :rules="rules" :model="ruleForm" status-icon>
                <el-form-item label="账户" prop="username">
                  <el-input type="text" v-model="ruleForm.username" ></el-input>
                </el-form-item>             
                <el-form-item label="密码" prop="password">
                  <el-input type="password" v-model="ruleForm.password" ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                  <el-input type="password" v-model="ruleForm.checkPass" ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-form-item label="真实姓名" prop="full_name">
                  <el-input type="text" v-model="ruleForm.full_name" ></el-input>
                </el-form-item>
                  <el-form-item label="社区名称" prop="community_name">
                  <el-input type="text" v-model="ruleForm.community_name" ></el-input>
                </el-form-item>
                <el-form-item label="负责人手机" prop="community_phone">
                  <el-input type="text" v-model="ruleForm.community_phone" ></el-input>
                </el-form-item>
                <el-form-item label="社区位置" prop="community_position">
                  <el-input type="text" v-model="ruleForm.community_position" ></el-input>
                </el-form-item>

                
                
                  <el-button type="primary" @click="register('ruleForm')">注册</el-button>
                  <el-button @click="reset('ruleForm')">重置</el-button>
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
  name: "Register",
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
        checkPass: "",
        fullName:"",
        community_name:"",
        community_phone:"",
        community_position:""
      }
    };
  },
  methods: {
    register(formName) {
      let router = this.$router;
      this.$refs[formName].validate(vaild => {
        if (vaild) {
          axios
            .post("/register", {
              username: this.ruleForm.username,
              password: this.ruleForm.password,
              fullName:this.ruleForm.fullName,
              community_position:this.ruleForm.community_position,
              community_name:this.ruleForm.community_name,
              community_phone:this.ruleForm.community_phone
            })
            .then(function(response) {
              router.push("/login");
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    reset(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script scoped>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.layout {
  margin-top: 20px;
}
#register-form label {
  color: #fff;
}
</style>