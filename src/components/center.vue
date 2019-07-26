<template>
  <div class="mainC">
    <el-col :gutter="100">
      <el-col :span="2"></el-col>
      <el-col :span="22">
        <div class="searchDiv">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="网站名称：">
              <el-input v-model="sWebName" placeholder="网站名称"></el-input>
            </el-form-item>
            <el-form-item label="所在城市：">
              <el-input v-model="sCity" placeholder="城市"></el-input>
            </el-form-item>
            <el-form-item label="起始URL：">
              <el-input v-model="sStartUrl" placeholder="URL"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="Search">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addNewItem">新建</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="listProject" border style="width:100%" stripe @row-dblclick="rowClick">
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
                <el-button @click="detailPorject(scope.row)" type="text" size="normal">查看</el-button>
                <el-button type="text" size="normal" @click="deleteItem(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog :visible.sync="centerDialogVisible" width="30%" center>
            <el-form
              ref="ruleForm"
              :model="form"
              label-width="110px"
              size="mini"
              :rules="rules"
              class="demo-ruleForm"
            >
              <el-form-item label="网站名" prop="WebName">
                <el-input v-model="form.WebName"></el-input>
              </el-form-item>
              <el-form-item label="栏目" prop="Section">
                <el-input v-model="form.Section"></el-input>
              </el-form-item>
              <el-form-item label="来源" prop="Source">
                <el-input v-model="form.Source"></el-input>
              </el-form-item>
              <el-form-item label="地址" prop="City">
                <el-input v-model="form.City"></el-input>
              </el-form-item>
              <el-form-item label="起始Url" prop="StartUrl">
                <el-input v-model="form.StartUrl"></el-input>
              </el-form-item>

              <el-form-item label="上次运行时间" prop="LastRunTime">
                <el-input v-model="form.LastRunTime"></el-input>
              </el-form-item>
              <el-form-item label="上次最新日期" prop="LatestTime">
                <el-input v-model="form.LatestTime"></el-input>
              </el-form-item>
              <el-form-item label="数据总数" prop="Count">
                <el-input v-model="form.Count"></el-input>
              </el-form-item>
              <el-form-item label="RowXPath" prop="RowXPath">
                <el-input v-model="form.RowXPath"></el-input>
              </el-form-item>
              <el-form-item label="LinkXPath" prop="LinkXPath">
                <el-input v-model="form.LinkXPath"></el-input>
              </el-form-item>
              <el-form-item label="DateXPath" prop="DateXPath">
                <el-input v-model="form.DateXPath"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addItem">提 交</el-button>
            </span>
          </el-dialog>
        </div>
      </el-col>
    </el-col>
    <!-- 
    <div></div>-->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { truncate } from "fs";
export default {
  name: "center",
  data() {
    return {
      centerDialogVisible: false,
      form: {
        id: "",
        WebName: "web1",
        Section: "sec1",
        Source: "souce1",
        City: "city1",
        StartUrl: "url1",
        LastRunTime: "23",
        LatestTime: "34",
        Count: "12",
        RowXPath: "3er",
        LinkXPath: "ff",
        DateXPath: "ssf"
      },
      rules: {
        WebName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        Section: [{ required: true, message: "请输入栏目", trigger: "blur" }],
        Source: [{ required: true, message: "请输入来源", trigger: "blur" }],
        City: [{ required: true, message: "请输入所在城市", trigger: "blur" }],
        StartUrl: [
          { required: true, message: "请选择起始Url", trigger: "blur" }
        ],
        LastRunTime: [
          { required: true, message: "请输入上次运行时间", trigger: "blur" }
        ],
        LatestTime: [
          { required: true, message: "请输入数据最新时间", trigger: "blur" }
        ],
        Count: [{ required: true, message: "请输入数据总量", trigger: "blur" }],
        RowXPath: [
          { required: true, message: "请输入RowXPath", trigger: "blur" }
        ],
        LinkXPath: [{ required: true, message: "LinkXPath", trigger: "blur" }],
        DateXPath: [{ required: true, message: "DateXPath", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapGetters(["listProject", "sWebName", "sCity", "sStartUrl"])
  },
  mounted: function() {
    this.$store.dispatch("LOAD_PROJECT_LIST");
  },
  methods: {
    //按条件检索
    Search() {
      this.$store.dispatch("", { amount: 10 });
    },
    //删除
    deleteItem(row) {
      var item = row.ID;
      this.$store.dispatch("DELETE_PROJECT", item);
    },
    //查看
    detailPorject(row) {
      console.log(row);
      centerDialogVisible = true;
      this.$store.dispatch("", row);
    },
    //双击修改
    rowClick(row, column, cell, event) {
      console.log(row, column, cell, event);
      this.centerDialogVisible = true;
    },
    addNewItem() {
      this.centerDialogVisible = true;
    },
    //添加
    addItem() {
      var id = "";
      while (id.length < 20) {
        id += Math.random()
          .toString(36)
          .substr(2);
      }
      this.form.id = id;
      this.$store.dispatch("ADD_NEW_PROJECT", this.form);
      this.centerDialogVisible = false;
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

