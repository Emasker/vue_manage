<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商后台管理</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          {{ isCollapse ? '展开▷' : '◁收起' }}
        </div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse-transition="false"
          :collapse="isCollapse"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNacState('/' + subItem.path)"
              ><template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu></el-aside
      >
      <!-- 内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
      
<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
      activePath: '',
    }
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    //折叠菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //退出登陆
    logout() {
      //清除token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.mag)
      this.menuList = res.data
    },
    //保存链接激活状态
    saveNacState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
}
</script>
      
<style lang="less" scoped>
.el-container {
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 4px;
    align-items: center;
    color: #fff;
    font-size: 20px;
    img {
      height: 55px;
      width: 55px;
    }
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
      .iconfont {
        margin-right: 10px;
      }
    }

    .toggle-button {
      background-color: #4a5064;
      color: #fff;
      font-size: 10px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
      letter-spacing: 0.2em;
    }
  }
  .el-main {
    background-color: #e9eef3;
  }
}
.home_container {
  height: 100%;
}
</style>