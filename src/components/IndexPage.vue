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
                <el-menu-item v-show="isSuper" index="/index/total">
                    <i class="el-icon-menu"></i>
                    <span slot="title">网站总览</span>
                </el-menu-item>                    
                <el-menu-item v-show="isAdmin" index="/index/query">
                    <i class="el-icon-menu"></i>
                    <span slot="title">弹幕查询</span>
                </el-menu-item>
                <el-menu-item v-show="isSuper" index="/index/manager">
                    <i class="el-icon-menu"></i>                    
                    <span slot="title">用户管理</span>
                </el-menu-item>
                <el-menu-item v-show="isAdmin" index="/index/mute">
                    <i class="el-icon-menu"></i>                    
                    <span slot="title">禁言查询</span>
                </el-menu-item>              
                </el-menu>
          </el-aside>
          <el-main>
              <router-view></router-view>
              <h3 v-show="!isAdmin">功能等待开发</h3>
          </el-main>
      </el-container>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
        roles:{}
    };
  },
  mounted(){
      this.roles = JSON.parse(sessionStorage.getItem('roles'));
  },
  computed:{
      isSuper(){
          return this.roles.manager&&this.roles.manager>2
      },
      isAdmin(){
          return this.roles.query&&this.roles.query>2;
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.index,.el-container,.el-container ul{
    height: 100%;
}
</style>
