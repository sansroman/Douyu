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
              <el-table-column prop="douyunn" label="申诉人" width="200">
              </el-table-column>
              <el-table-column prop="reason" label="申诉原因" >
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
              <el-table-column prop="process" label="处理人" width="200">
              </el-table-column>
              <el-table-column prop="date" label="处理时间" width="120">
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
          reason:"油了一下被封了30天",
          tag:0,
          process:"",
          date:"",
          query:[
            {
            txt:"秃子你的头会反光",
            date:14512235423
          }
          ]

        },{
          identifer:2,
          douyunn:"南门牛肉",
          reason:"油了一下被封了30天",
          tag:0,
          process:"",
          date:"",
          query:[
            {
            txt:"秃子你的头会反光",
            date:14512235423
          }
          ]

        },{
          identifer:3,
          douyunn:"秃胖传奇",
          reason:"油了一下被封了30天",
          tag:0,
          process:"",
          date:"",
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
          tag:1,
          process:"德云色丶甜甜圈",
          date:"2017-01-11",
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
          tag:2,
          process:"德云色丶甜甜圈",
          date:"2017-01-11",
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
    }
  },
  computed:{

  }

};
</script scoped>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>