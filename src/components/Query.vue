<template>
  <div id="query">
        <div style="margin-top: 15px;">
        <el-input placeholder="请输入内容" v-model="querytext" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="用户名" value="1"></el-option>
                <el-option label="ID" value="2"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="query()"></el-button>
        </el-input>
        </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'query',
  data(){
      return{
          querytext:'',
          select:''
      }
  },
  methods:{
    query(querytext){
      let self = this;
      axios
            .get("/api/danmu?douyunn="+self.querytext)
            .then(function(response) {
              self.$message({
                type: 'success',
                message: '读取成功!'
              });
            })
            .catch(function(error) {
                this.$message.error(error);   
            });
    }
  }
}
</script>

<style>
#query {
  color: #2c3e50;
}
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
