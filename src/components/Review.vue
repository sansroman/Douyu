<template>
  <div class="review">

  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: "Appear",
  data() {
    return {
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

</style>