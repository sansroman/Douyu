<template>
  <div class="index">
      <el-container>
            <el-aside
            width="200px">
                <el-menu
                default-active="total"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                router>
                <el-menu-item index="/index/total">
                    <i class="el-icon-menu"></i>
                    <span slot="title">网站总览</span>
                </el-menu-item>                    
                <el-menu-item index="/index/query">
                    <i class="el-icon-menu"></i>
                    <span slot="title">弹幕查询</span>
                </el-menu-item>
                <el-menu-item index="/index/manager">
                    <i class="el-icon-menu"></i>                    
                    <span slot="title">用户管理</span>
                </el-menu-item>
                </el-menu>
          </el-aside>
          <el-main>
              <router-view></router-view>
          </el-main>
      </el-container>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.index,.el-container,.el-container ul{
    height: 100%;
}
</style>
