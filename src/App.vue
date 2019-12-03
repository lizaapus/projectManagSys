<template>
  <div id="app">
    <el-row :gutter="60">
      <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
        <leftNav />
      </el-col>
      <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
        <router-view />
      </el-col>
      <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1"></el-col>
    </el-row>
  </div>
</template>
<script>
// @ is an alias to /src
import leftNav from "@/components/leftNav.vue";
import right from "@/components/rightMsg.vue";

export default {
  name: "Appvue",
  components: {
    leftNav,
    right
  }
};
</script>

<style lang="stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
