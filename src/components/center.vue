<template>
  <div class="mainC">
    <el-col :gutter="100">
      <el-col :span="2"></el-col>
      <el-col :span="22">
        <div class="searchDiv">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="网站名称：">
              <el-input v-model="formInline.user" placeholder="网站名称"></el-input>
            </el-form-item>
            <el-form-item label="起始URL：">
              <el-input v-model="formInline.user" placeholder="URL"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="tableData" border style="width:100%" stripe @row-dblclick="rowClick">
            <el-table-column fixed prop="ID" label="ID" width="150"></el-table-column>
            <el-table-column prop="WebName" label="网站名" width="120"></el-table-column>
            <el-table-column prop="Section" label="网站栏目" width="120"></el-table-column>
            <el-table-column prop="Source" label="来源" width="120"></el-table-column>
            <el-table-column prop="City" label="城市" width="120"></el-table-column>
            <el-table-column prop="StartUrl" label="起始Url" width="120"></el-table-column>
            <el-table-column prop="LastRunTime" label="上次运行时间" width="120"></el-table-column>
            <el-table-column prop="LatestTime" label="数据最新日期" width="120"></el-table-column>
            <el-table-column prop="count" label="数据总数" width="140"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="normal">查看</el-button>
                <el-button type="text" size="normal">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-col>
    <!-- 
    <div></div>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "center",
  data() {
    return {
      formInline: {
        user: "",
        region: ""
      },
      tableData: [
        {
          ID: 1,
          WebName: "",
          Section: "",
          Source: "",
          City: "",
          StartUrl: "",
          LastRunTime: Date.now,
          LatestTime: Date.now,
          count: 100
        },
        {
          ID: 2,
          WebName: "",
          Section: "",
          Source: "",
          City: "",
          StartUrl: "",
          LastRunTime: Date.now,
          LatestTime: Date.now,
          count: 100
        },
        {
          ID: 3,
          WebName: "",
          Section: "",
          Source: "",
          City: "",
          StartUrl: "",
          LastRunTime: Date.now,
          LatestTime: Date.now,
          count: 100
        },
        {
          ID: 4,
          WebName: "",
          Section: "",
          Source: "",
          City: "",
          StartUrl: "",
          LastRunTime: Date.now,
          LatestTime: Date.now,
          count: 100
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["projectList"])
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    handleClick(row) {
      console.log(row);
    }
  }
};
</script>
<style scoped>
.mainC {
  width: 100%;
  height: 100%;
}
.searchDiv {
  margin-top: 130px;
  text-align: left;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
</style>

