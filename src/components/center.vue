<template>
  <div class="mainC">
    <el-col :gutter="100">
      <el-col :span="2"></el-col>
      <el-col :span="22">
        <div class="searchDiv">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="网站名称：">
              <input v-model="searchWebName" placeholder="网站名称" ></input>
            </el-form-item>
            <el-form-item label="所在城市：">
              <input v-model="searchCity" placeholder="城市" ></input>
            </el-form-item>
            <el-form-item label="起始URL：">
              <input v-model="searchStartUrl" placeholder="URL" ></input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="Search">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addNewItem">新建</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="listProject" border style="width:1030px" stripe @row-dblclick="rowClick">
            <!-- <el-table-column fixed prop="ID" label="ID" width="150"></el-table-column> -->
            <el-table-column prop="WebName" label="网站名" width="120"></el-table-column>
            <el-table-column prop="Section" label="网站栏目" width="120"></el-table-column>
            <el-table-column prop="Source" label="来源" width="120"></el-table-column>
            <el-table-column prop="City" label="城市" width="120"></el-table-column>
            <el-table-column prop="StartUrl" label="起始Url" width="120"></el-table-column>
            <el-table-column prop="LastRunTime" label="上次运行时间" width="120"></el-table-column>
            <el-table-column prop="LatestTime" label="数据最新日期" width="120"></el-table-column>
            <el-table-column prop="Count" label="数据总数" width="80"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <!-- <el-button @click="detailPorject(scope.row)" type="text" size="normal">查看</el-button> -->
                <el-button type="text" size="normal" @click="deleteItem(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="paginationC">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="AllCount"
            ></el-pagination>
          </div>

          <el-dialog :visible.sync="centerDialogVisible" width="30%" center>
            <el-form
              ref="ruleForm"
              :model="form"
              label-width="110px"
              size="mini"
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
                <el-date-picker
                  placeholder="上次运行时间"
                  v-model="form.LastRunTime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="上次最新日期" prop="LatestTime">
                <el-date-picker placeholder="上次最新日期" v-model="form.LatestTime" style="width: 100%;"></el-date-picker>
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
              <el-button type="primary" @click="Submit">提 交</el-button>
            </span>
          </el-dialog>
        </div>
      </el-col>
    </el-col>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { truncate } from "fs";
import { brotliCompress } from "zlib";
import { type } from "os";
export default {
  name: "center",
  data() {
    return {
      type: 0,
      centerDialogVisible: false,
      form: {
        id: "",
        WebName: "web1",
        Section: "sec1",
        Source: "souce1",
        City: "city1",
        StartUrl: "url1",
        LastRunTime: "",
        LatestTime: "",
        Count: "12",
        RowXPath: "3er",
        LinkXPath: "ff",
        DateXPath: "ssf"
      }
      // rules: {
      //   WebName: [
      //     { required: true, message: "请输入活动名称", trigger: "blur" },
      //     { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
      //   ],
      //   Section: [{ required: true, message: "请输入栏目", trigger: "blur" }],
      //   Source: [{ required: true, message: "请输入来源", trigger: "blur" }],
      //   City: [{ required: true, message: "请输入所在城市", trigger: "blur" }],
      //   StartUrl: [
      //     { required: true, message: "请选择起始Url", trigger: "blur" }
      //   ],
      //   LastRunTime: [
      //     { required: true, message: "请输入上次运行时间", trigger: "blur" }
      //   ],
      //   LatestTime: [
      //     { required: true, message: "请输入数据最新时间", trigger: "blur" }
      //   ],
      //   Count: [{ required: true, message: "请输入数据总量", trigger: "blur" }],
      //   RowXPath: [
      //     { required: true, message: "请输入RowXPath", trigger: "blur" }
      //   ],
      //   LinkXPath: [{ required: true, message: "LinkXPath", trigger: "blur" }],
      //   DateXPath: [{ required: true, message: "DateXPath", trigger: "blur" }]
      // }
    };
  },
  computed: {
    ...mapGetters(["listProject", "AllCount", "currentPage"]),
    searchWebName: {
      get() {
        return this.$store.state.searchWebName;
      },
      set(value) {
        this.$store.commit("SET_WENNAME", value);
      }
    },
    searchCity: {
      get() {
        return this.$store.state.searchCity;
      },
      set(value) {
        this.$store.commit("SET_CITY", value);
      }
    },
    searchStartUrl: {
      get() {
        return this.$store.state.searchStartUrl;
      },
      set(value) {
        this.$store.commit("SET_URL", value);
      }
    }
  },
  mounted: function() {
    this.$store.dispatch("LOAD_ALL_COUNT");
  },
  methods: {
    //按条件检索
    Search() {
      this.$store.dispatch("SEARCH_PROJECTS");
    },
    //删除
    deleteItem(row) {
      console.log(row);
      console.log("ENTER DELETE");
      var item = row.id;
      this.$store.dispatch("DELETE_PROJECT", item);
    },
    //查看
    detailPorject(row) {
      this.type = 2;
      this.form = row;
      centerDialogVisible = true;
    },
    //双击修改
    rowClick(row, column, cell, event) {
      this.type = 1;
      this.form = row;
      this.centerDialogVisible = true;
    },
    addNewItem() {
      this.type = 0;
      this.centerDialogVisible = true;
    },
    //添加
    Submit() {
      switch (this.type) {
        case 0:
          var id = "";
          while (id.length < 20) {
            id += Math.random()
              .toString(36)
              .substr(2);
          }
          this.form.id = id;
          this.$store.dispatch("ADD_NEW_PROJECT", this.form);
          break;
        case 1:
          this.$store.dispatch("UPDATE_PROJECT", this.form);
          break;
      }
      this.centerDialogVisible = false;
    },
    handleCurrentChange(val) {
      this.$store.dispatch("PAGE_CHANGED", val);
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
  margin-top: 60px;
  text-align: left;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.paginationC {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>

