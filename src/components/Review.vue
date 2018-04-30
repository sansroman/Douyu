<template>
  <div class="review">
        <el-table 
              border
              :data="appearData" 
              >
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-table :data="scope.row.query">
                      <el-table-column label="发言"  prop="txt"></el-table-column>
                      <el-table-column label="时间" width="120" prop="date"></el-table-column>                      
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column :fixed="this.$root.$data.isMoblie" prop="identifer" label="申请人" width="100">
              </el-table-column>
              <el-table-column prop="nn" label="申请人手机" width="180">
              </el-table-column>
              <el-table-column prop="reason" label="申请社区" >
              </el-table-column>
              <el-table-column prop="processer" label="申请社区地址" width="180">
              </el-table-column>
              <el-table-column prop="date" label="处理时间" width="120">
              </el-table-column>
              <el-table-column prop="remark" label="备注" width="300">
              </el-table-column>
              <el-table-column 
              prop="tag" 
              label="处理状态" 
              width="100" 
              :filters="[{text:'待处理',value:0},{text:'已通过',value:1},{text:'已拒绝',value:2}]" 
              :filter-method="filterTag">
                  <template slot-scope="scope">
                    <el-tag
                      :type="tagType(scope.row.tag)"
                      close-transition>{{filterList[scope.row.tag]}}</el-tag>
                  </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="pass(scope.row)"  type="primary" size="small" :disabled="scope.row.tag!==0">通过</el-button>
                    <el-button @click="reject(scope.row)"  type="warning" size="small" :disabled="scope.row.tag!==0">拒绝</el-button>                    
                </template>
              </el-table-column>
        </el-table>
        <el-pagination
          background
          v-show='isHiddle'
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :small="this.$root.$data.isMoblie"
          :current-page="currentPage"
          :page-size="20"
          :total='total'>
        </el-pagination>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: "Appear",
  data() {
    return {
      total:0,
      appearData:[],
      currentPage:1,
      filterList:['待处理','已通过','已拒绝']
    };
  },
  methods: {
    handleCurrentChange(cur){
        let self = this;
        cur--;
        axios
          .get("/api/review?cur="+cur)
          .then(function (response) {
            self.appearData = response.data.result;
            self.total = response.data.total
          })
          .catch(function (error) {
            self.$message.error(error.response.data);
          });
      },
    register(formName) {

    },
    filterTag(value,row){
       return row.tag === value;
    },
    tagType(value){
        if (value === 0) return 'info'
        else if(value === 1) return 'success'
        else return 'danger'
    },
    pass(row){
       this.$prompt('请输入备注', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          row.tag = 1;
          row.process = "德云色丶甜甜圈";
          row.date =  new Date().toLocaleDateString(); 
          row.remark = value;
          this.$message({
            type: 'success',
            message: '审核通过'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消'
          });       
      });
       
    },
    reject(row){
       this.$prompt('请输入备注', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          row.tag = 2;
          row.process = "德云色丶甜甜圈";
          row.date =  new Date().toLocaleDateString(); 
          row.remark = value;
          this.$message({
            type: 'success',
            message: '已拒绝'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消'
          });       
      });
    }
  },
  mounted(){
    this.handleCurrentChange(1);

  }

};
</script scoped>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>