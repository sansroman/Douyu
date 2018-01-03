<template>
  <div class="login">
    <el-row :gutter="10" class="layout">
      <el-col :xl="{span:8,offset:8}" :xs="{span:22,offset:1}" :sm="{span:22,offset:1}" :md="{span:22,offset:1}" :lg="{span:8,offset:8}">
          <div class="login-form">
              <el-form label-width="100px" label-position="right" ref="ruleForm" :rules="rules" :model="ruleForm" status-icon>
                <el-form-item label="斗鱼ID" prop="douyunn">
                  <el-input type="text" v-model="ruleForm.reason" ></el-input>
                </el-form-item>               
                <el-form-item label="申诉原因" prop="reason">
                  <el-input type="textarea" v-model="ruleForm.reason" autosize></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="register('ruleForm')">提交</el-button>
                  <el-button @click="reset('ruleForm')">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-upload
                    drag
                    action="/file"
                    multiple=>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
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
  name: "Appear",
  data() {
    return {
      ruleForm: {
        reason: "",
        douyunn:""
      },
      rules:{
          douyunn:[{required:true,message:'请输入斗鱼ID',trigger:'blur'}],
          reason:[{required:true,message:'请输入申诉原因',trigger:'blur'}]
      }
    };
  },
  methods: {
    register(formName) {
      let self = this;
      this.$refs[formName].validate((vaild)=>{
        if (vaild) {
          axios
        .post("/appear", {
          douyunn:this.ruleForm.douyunn,
          reason:this.ruleForm.reason
        })
        .then(function(response) {
          self.$message({
            type: "success",
            message: "提交成功!"
          });
        })
        .catch(function(error) {
          console.log(error);
        });
        }else{
          return false;
        }
      })

    },
    reset(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script scoped>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .layout{
      margin-top: 20px;
    }
</style>