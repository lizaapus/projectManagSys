<template>
  <div class="hello">
    <el-col :span="24">
      <el-avatar icon="el-icon-user-solid"></el-avatar>
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="white"
        text-color="black"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="1">
          <router-link to="/ProjectManager" class="linkStyle">
            <div>项目管理</div>
          </router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/FundProManager" class="linkStyle">
            <div>基金管理</div>
          </router-link>
        </el-menu-item>
        <!-- <el-menu-item index="3">
          <i class="el-icon-document"></i>
          <span slot="title">导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">导航四</span>
        </el-menu-item>-->
      </el-menu>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  methods: {}
};
</script>

<style scoped lang="stylus">
.hello {
  margin-top: 40px;
  background-color: light_blue;
}

.el-menu-vertical-demo {
  width: 200px;
  text-align: center;
  height: 750px;
  margin-top: 40px;
}

.el-menu-vertical-demo el-menu-item {
  width: 200px;
}
</style>
