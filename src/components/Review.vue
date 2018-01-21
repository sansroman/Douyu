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
              <el-table-column :fixed="this.$root.$data.isMoblie" prop="identifer" label="申诉编号" width="100">
              </el-table-column>
              <el-table-column prop="douyunn" label="申诉人" width="180">
              </el-table-column>
              <el-table-column prop="reason" label="申诉原因" >
              </el-table-column>
              <el-table-column prop="process" label="处理人" width="180">
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
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: "Appear",
  data() {
    return {
      appearData:[
        {
          identifer:1,
          douyunn:"南门头牛肉丸",
          reason:"起哄被封了30天",
          tag:0,
          process:"",
          date:"",
          remark:"",
          query:[
            {
            txt:"#上香",
            date:"2017-01-01"
          }
          ]

        },{
          identifer:2,
          douyunn:"德云色丶克烈娃",
          reason:"房管真的真实，直接给我了30天",
          tag:0,
          process:"",
          date:"",
          remark:"",
          query:[
            {
            txt:"房管来个禁言套餐",
            date:"2017-12-31"
          }
          ]

        },{
          identifer:3,
          douyunn:"秃胖传奇",
          reason:"油了一下被封了30天",
          tag:0,
          process:"",
          date:"",
          remark:"",
          query:[
            {
            txt:"秃子你的头会反光",
            date:14512235423
          }
          ]

        },{
          identifer:4,
          douyunn:"南门头牛肉丸",
          reason:"油了一下被封了30天",
          tag:0,
          remark:"",
          query:[
            {
            txt:"秃子你的头会反光",
            date:"2017-12-30"
            },
            {
            txt:"666666",
            date:"2017-12-30"
            },
            {
            txt:"德云色去哪我去哪",
            date:"2017-12-30"
            }
          ]

        },{
          identifer:4,
          douyunn:"开哥无敌",
          reason:"给你爸解封",
          tag:0,
          remark:"",
          query:[
            {
            txt:"NMSL",
            date:"2017-12-30"
            },
            {
            txt:"垃圾主播",
            date:"2017-12-30"
            },
            {
            txt:"云色缺德",
            date:"2017-12-30"
            }
          ]

        }
        
      ],
      filterList:['待处理','已通过','已拒绝']
    };
  },
  methods: {
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
  computed:{

  }

};
</script scoped>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>