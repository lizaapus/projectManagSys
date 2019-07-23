<template>
  <el-row :gutter="10">
    <el-col :xs="6" :sm="6" :md="6" :lg="3" :xl="3">
      <leftNav msg="Welcome to Your Vue.js App" />
    </el-col>
    <el-col :xs="16" :sm="16" :md="12" :lg="18" :xl="18">
      <center></center>
    </el-col>
    <el-col :xs="2" :sm="2" :md="6" :lg="3" :xl="3">
      <right></right>
    </el-col>
  </el-row>
</template>

<script>
// @ is an alias to /src
import leftNav from "@/components/leftNav.vue";
import center from "@/components/center.vue";
import right from "@/components/rightMsg.vue";

export default {
  name: "home",
  components: {
    leftNav,
    center,
    right
  }
};
</script>
