<template>
  <div class="appear">
    <el-row :gutter="10" class="layout">
      <el-col :xl="{span:12,offset:6}" :xs="{span:22,offset:1}" :sm="{span:22,offset:1}" :md="{span:22,offset:1}" :lg="{span:12,offset:6}">
              <el-form label-width="100px" label-position="right" ref="ruleForm" :rules="rules" :model="ruleForm" status-icon>
                <el-form-item  prop="douyunn">
                  <el-input type="text" v-model="ruleForm.nn" >
                    <el-select class="uid_nn" v-model="select" slot="prepend" placeholder="请选择">
                      <el-option label="龙珠昵称" value="1"></el-option>
                      <el-option label="龙珠UID" value="2"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>               
                <el-form-item label="申诉原因" prop="reason">
                  <el-input type="textarea" v-model="ruleForm.reason" autosize></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="register('ruleForm')">提交</el-button>
                  <el-button @click="reset('ruleForm')">重置</el-button>
                </el-form-item>
              </el-form>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "Appear",
  data() {
    return {
      ruleForm: {
        reason: "",
        nn: ""
      },
      rules: {
        nn: [{ required: true, message: "请输入昵称或者UID", trigger: "blur" }],
        reason: [{ required: true, message: "请输入申诉原因", trigger: "blur" }]
      },
      select:1
    };
  },
  methods: {
    register(formName) {
      let self = this;
      this.$refs[formName].validate(vaild => {
        if (vaild) {
          axios
            .post("/appear", {
              douyunn: this.ruleForm.nn,
              reason: this.ruleForm.reason
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
        } else {
          return false;
        }
      });
    },
    reset(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    this.ruleForm.douyunn = sessionStorage.getItem("username");
  }
};
</script scoped>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-upload {
  width: 100%;
}
.el-upload-dragger {
  width: 100%;
}
.appear label{ 
      color: #fff;
}
.uid_nn{
  width: 130px;
}
</style>