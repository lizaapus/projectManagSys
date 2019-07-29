<template>
  <el-form class="mainC">
    <el-col :gutter="100">
      <el-col :span="2"></el-col>
      <el-col :span="22">
        <div class="addDiv">
          <el-button type="primary" @click="addNewItem">新建</el-button>
          <el-button type="primary" @click="addBatchItems">批量添加</el-button>
          <el-dialog :visible.sync="batchAddDialog" width="70%" center title="批量导入数据">
            <div class="batchDiv">
              <label>批量数据：</label>
              <el-input type="textarea" autosize placeholder="请输入内容" v-model="batchString"></el-input>
              <el-button type="primary" @click="formatBatch">格式化数据</el-button>
              <p v-html="tableHtml"></p>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="batchAddDialog = false">取 消</el-button>
              <el-button type="primary" @click="BatchSubmit">批量导入</el-button>
            </span>
          </el-dialog>
        </div>
        <el-form class="searchDiv">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="网站名称：">
              <input class="inputC" v-model="searchWebName" placeholder="网站名称" />
            </el-form-item>
            <el-form-item label="所在城市：">
              <input class="inputC" v-model="searchCity" placeholder="城市" />
            </el-form-item>
            <el-form-item label="起始URL：">
              <input class="inputC" v-model="searchStartUrl" placeholder="URL" />
            </el-form-item>
            <el-form-item label="数据最新时间">
              <el-date-picker placeholder="选择时间" v-model="sLatestTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="Search">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="listProject"
            border
            style="width:1190px"
            stripe
            @row-dblclick="rowClick"
            size="medium"
          >
            <el-table-column prop="WebName" label="网站名" width="120"></el-table-column>
            <el-table-column prop="Section" label="网站栏目" width="120"></el-table-column>
            <el-table-column prop="Source" label="来源" width="120"></el-table-column>
            <el-table-column prop="City" label="城市" width="120"></el-table-column>
            <el-table-column prop="StartUrl" label="起始Url" width="120"></el-table-column>
            <el-table-column prop="LastRunTime" label="上次运行时间" width="200"></el-table-column>
            <el-table-column prop="LatestTime" label="数据最新日期" width="200"></el-table-column>
            <el-table-column prop="Count" label="数据总数" width="80"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="UpdateItem(scope.row)" type="text" size="normal">编辑</el-button>
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

          <el-dialog :visible.sync="singleAddDialog" width="30%" center @close="RefreshList">
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
                  disabled
                  placeholder="上次运行时间"
                  v-model="form.LastRunTime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="上次最新日期" prop="LatestTime">
                <el-date-picker
                  placeholder="上次最新日期"
                  v-model="form.LatestTime"
                  style="width: 100%;"
                  disabled
                ></el-date-picker>
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
              <el-form-item label="备注" prop="DateXPath">
                <el-input
                  v-model="form.Remark"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="singleAddDialog = false">取 消</el-button>
              <el-button type="primary" @click="Submit">提 交</el-button>
            </span>
          </el-dialog>
        </el-form>
      </el-col>
    </el-col>
  </el-form>
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
      singleAddDialog: false,
      batchAddDialog: false,
      batchString:'',
      tableHtml:"",
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
        DateXPath: "ssf",
        Remark: ""
      }
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
    },
    sLatestTime: {
      get() {
        return this.$store.state.searchLatestTime;
      },
      set(value) {
        this.$store.commit("SET_SEARCH_LatestTime", value);
      }
    }
  },
  mounted: function() {
    //this.$store.dispatch("LOAD_ALL_COUNT");
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
    //双击修改
    rowClick(row, column, cell, event) {
      this.type = 1;
      this.form = row;
      this.singleAddDialog = true;
    },
    UpdateItem(row) {
      this.type = 1;
      this.form = row;
      this.singleAddDialog = true;
    },
    addNewItem() {
      this.type = 0;
      this.singleAddDialog = true;
    },
    addBatchItems() {
      this.type = 0;
      this.batchAddDialog = true;
    },
    //添加
    Submit() {
      switch (this.type) {
        case 0:
          this.form.id = this.uuid();
          alert(this.form.id);
          this.$store.dispatch("ADD_NEW_PROJECT", this.form);
          break;
        case 1:
          this.$store.dispatch("UPDATE_PROJECT", this.form);
          break;
      }
      this.singleAddDialog = false;
    },
    handleCurrentChange(val) {
      this.$store.dispatch("PAGE_CHANGED", val);
    },
    //刷新列表
    RefreshList() {
      this.$store.dispatch("PAGE_CHANGED", this.currentPage);
    },
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
    },
    formatBatch(){
      //console.log("enter1");
      var str1 = this.batchString.replace(/\n/g, "</td></tr><tr><td width='200px'>");
      console.log(str1);
      str1 = str1.replace(/\t/g, "</td><td width='200px'>");
      str1 = "<table border='1px' style='word-wrap:break-word;word-break:break-all;table-layout:fixed' cellspacing='0'><tr><td width='200px'>"+str1;
      console.log(str1);
      console.log(str1.length);
      this.tableHtml = str1.substr(0,str1.length-23) + "</table>";
      console.log(this.tableHtml);
      //console.log(this.batchString.split("\t"))
    },
    BatchSubmit(){

    }
  }
};
</script>
<style scoped>
.mainC {
  width: 100%;
  height: 100%;
}

.addDiv {
  margin-top: 100px;
  margin-left:40px;
  text-align: left;
}
.searchDiv {
  margin-top: 10px;
  margin-left:40px;
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
.inputC {
  width: 150px;
  height: 25px;
  border-radius: 5%;
}
.block {
  width: 20px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 175px;
}
.el-input__icon el-icon-time {
  visibility: hidden;
}
.el-input__prefix {
  visibility: hidden;
}
.batchDiv{
}
</style>

