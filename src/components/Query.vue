<template>
  <div id="query">
        <div style="margin-top: 15px;">
        <el-input placeholder="请输入内容" v-model="querytext" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="用户名" value="1"></el-option>
                <el-option label="ID" value="2"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        </div>
  </div>
</template>

<script>
export default {
  name: 'query',
  data(){
      return{
          querytext:'',
          select:''
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
