<template>
  <div id="query">
        <div :class="{data:hasData||this.$root.$data.isMoblie}" class="search">
        <el-input placeholder="请输入龙珠昵称" v-model="querytext" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="精确搜索" value="0"></el-option>
              <el-option label="模糊搜索" value="1"></el-option>
              <el-option label="UID搜索" value="2"></el-option>              
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="query"></el-button>
        </el-input>
        </div>
    <el-table 
      border
      :data="danmuData" 
      v-show="isHiddle"
      :row-class-name="tableRowClassName"
      >
      <el-table-column :fixed="this.$root.$data.isMoblie" prop="nn" label="斗鱼ID" width="100">
      </el-table-column>
      <el-table-column prop="rid" label="房间号" width="80">
          <template slot-scope="scope">
              <p>{{convertRoom(scope.row.rid)}}</p>
          </template>
      </el-table-column>
      <el-table-column prop="uid" label="龙珠UID" width="120">
      </el-table-column>
      <el-table-column prop="txt" label="发言" width="300">
      </el-table-column>
      <el-table-column label="时间" width="140">
          <template slot-scope="scope">
            <p>{{scope.row.date}}</p>
            <p>{{ scope.row.time}}</p>
          </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <el-popover
              ref="uidList"
              placement="right"
              width="150"
              trigger="click">
              <el-table :data="gridData">
                <el-table-column width="150" property="nn" label="龙珠ID"></el-table-column>
              </el-table>
            </el-popover>
            <el-button @click="find(scope.row)" v-popover:uidList type="primary" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      v-show="isHiddle"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :small="this.$root.$data.isMoblie"
      :current-page="currentPage"
      :page-size=20
      :total='total'>
    </el-pagination>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "query",
  data() {
    return {
      querytext: "",
      select: "0",
      danmuData: [],
      gridData: [],
      total: 0,
      currentPage: 1
    };
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
        if (row.rid === 2241164)  return 'warning-row';
        else return '';
    },
    convertRoom(rid){
        if(rid === 2241164) return '德云色';
        else if(rid === 19569) return '旭旭宝宝';
        else return '未知房间';
    },
    query() {
      this.handleCurrentChange(1);
    },
    find(data) {
      //暂时没用
      // let self = this;
      // axios
      //   .get("/api/danmu?uid=" + data.uid)
      //   .then(function(response) {
      //     self.$message({
      //       type: "success",
      //       message: "读取成功!"
      //     });
      //     self.gridData = response.data;
      //   })
      //   .catch(function(error) {
      //     self.gridData = [];
      //     self.$message.error(error.response.data);
      //   });
    },
    handleCurrentChange(cur) {
      let self = this;
      let queryStr;
      cur = cur - 1; 
      if(this.select==0)queryStr = "/api/danmu?douyunn=" + self.querytext + "&cur=" +cur;
      else if(this.select==1) queryStr = "/api/danmu?douyunn=" + self.querytext + "&cur=" +cur+"&fuzzy=true";
      else if(this.select==2) queryStr = "/api/danmu?uid=" + self.querytext+ "&cur=" +cur;
      axios
        .get(queryStr)
        .then(function(response) {
          self.$message({
            type: "success",
            message: "读取成功!"
          });
          response.data.result.forEach(element => {
            let tempTime = new Date(element.time);
            element.date = tempTime.toLocaleDateString();
            element.time = tempTime.toLocaleTimeString();
          });
          self.danmuData = response.data.result;
          self.total = response.data.total;
        })
        .catch(function(error) {
          self.$message.error(error.response.data);
          if(error.response.status==403)self.$router.push('/login');
        });
    }
  },
  computed: {
    isHiddle() {
      return this.hasData ?true:false;
    },
    hasData() {
      return this.danmuData.length !== 0;
    }
  }
};
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
.search{
  width: 30%;
  margin-left: 35%;
  margin-top: 10%;
}
.data.search{
  width: 100%;
  margin-left: 0%;
  margin-top: 0%;
}
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

</style>
