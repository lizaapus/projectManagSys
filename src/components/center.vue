<template>
  <el-form class="mainC">
    <el-col :gutter="100">
      <el-col :span="2"></el-col>
      <el-col :span="22">
        <div class="addDiv">
          <el-button type="primary" @click="addNewItem">新建</el-button>
          <el-button type="primary" @click="addBatchItems">批量添加</el-button>
          <el-dialog
            :visible.sync="batchAddDialog"
            width="70%"
            min-height="400px"
            center
            title="批量导入数据"
            @close="RefreshList"
            :before-close="handleClose"
          >
            <table class="batchDiv" width="100%">
              <tr width="100%">
                <td width="60px" v-show="isReload">
                  <label width="80px">批量数据：</label>
                </td>
                <td width="80%" v-show="isReload">
                  <el-input type="textarea" autosize placeholder="请输入内容" v-model="batchString"></el-input>
                </td>
                <td width="10%">
                  <el-button type="primary" @click="formatBatch" v-text="buttonText"></el-button>
                </td>
              </tr>
            </table>
            <p v-html="tableHtml"></p>
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
              <el-select v-model="searchCity" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in ProvinceList"
                  :key="item.省市代码"
                  :label="item.省市名称"
                  :value="item.省市代码"
                ></el-option>
              </el-select>
              <!-- <input class="inputC" v-model="searchCity" placeholder="城市" /> -->
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
          <el-table :data="listProject" border style="width:1190px" stripe size="medium">
            <el-table-column prop="WebName" label="网站名" width="120"></el-table-column>
            <el-table-column prop="Section" label="网站栏目" width="120"></el-table-column>
            <el-table-column prop="Source" label="来源" width="120"></el-table-column>
            <el-table-column prop="CityCode" label="城市" width="120"></el-table-column>
            <el-table-column prop="Url" label="起始Url" width="120">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :href="scope.row.Url"
                  v-text="scope.row.Url"
                  target="_blank"
                ></el-link>
              </template>
            </el-table-column>
            <el-table-column prop="LastRunTime" label="上次运行时间" width="200"></el-table-column>
            <el-table-column prop="LastDataTime" label="数据最新日期" width="200"></el-table-column>
            <el-table-column prop="DataCount" label="数据总数" width="80">
              <template slot-scope="scope">
                <el-button
                  @click="SearchDatas(scope.row)"
                  type="text"
                  size="normal"
                  v-text="scope.row.DataCount"
                ></el-button>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="UpdateItem(scope.row)" type="text" size="normal">编辑</el-button>
                <!-- <el-button type="text" size="normal" @click="deleteItem(scope.row)">删除</el-button> -->
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

          <el-dialog
            :visible.sync="singleAddDialog"
            width="30%"
            center
            @close="RefreshList"
            :before-close="handleClose"
          >
            <el-form
              ref="form"
              :rules="rules"
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
              <el-form-item label="城市" prop="City">
                <!-- <el-input v-model="form.City"></el-input> -->
                <el-select v-model="form.CityCode" clearable filterable placeholder="请选择">
                  <el-option
                    v-for="item in ProvinceList"
                    :key="item.省市代码"
                    :label="item.省市名称"
                    :value="item.省市代码"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="起始地址" prop="Url">
                <el-input v-model="form.Url"></el-input>
              </el-form-item>

              <el-form-item label="上次运行时间" prop="LastRunTime">
                <el-date-picker
                  disabled
                  placeholder="上次运行时间"
                  v-model="form.LastRunTime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="上次最新日期" prop="LastDataTime">
                <el-date-picker
                  placeholder="上次最新日期"
                  v-model="form.LastDataTime"
                  style="width: 100%;"
                  disabled
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="数据总数" prop="DataCount">
                <el-input v-model="form.DataCount" disabled></el-input>
              </el-form-item>
              <el-form-item label="是否解析" prop="IsParsed">
                <el-checkbox v-model="form.IsParsed"></el-checkbox>
              </el-form-item>
              <el-form-item label="是否渲染" prop="NeedRender">
                <el-checkbox v-model="form.NeedRender" disabled></el-checkbox>
              </el-form-item>
              <el-form-item label="行XPath" prop="RowXPath">
                <el-input v-model="form.RowXPath"></el-input>
              </el-form-item>
              <el-form-item label="链接XPath" prop="LinkXPath">
                <el-input v-model="form.LinkXPath" placeholder="相对路径，以 “.” 开头"></el-input>
              </el-form-item>
              <el-form-item label="标题XPath" prop="TitleXPath">
                <el-input v-model="form.TitleXPath" placeholder="相对路径，以 “.” 开头"></el-input>
              </el-form-item>
              <el-form-item label="日期XPath" prop="DateXPath">
                <el-input v-model="form.DateXPath" placeholder="相对路径，以 “.” 开头"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="Remark">
                <el-input
                  v-model="form.Remark"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <!-- <el-button @click="singleAddDialog = false">取 消</el-button> -->
              <el-button type="danger" v-show="isCanDelete" @click="deleteItem">删除</el-button>
              <el-button type="primary" @click="Submit">提 交</el-button>
            </span>
          </el-dialog>

          <el-dialog
            :title="dataDialogtitle"
            :visible.sync="dataListDialog"
            width="80%"
            :before-close="handleClose"
          >
            <el-table :data="DataList" border stripe>
              <el-table-column property="Url" label="网址" min-width="250">
                <template slot-scope="scope">
                  <!-- <a :href="scope.row.Url" v-text="scope.row.Url" target="_blank"></a> -->
                  <el-link
                    type="primary"
                    :href="scope.row.Url"
                    v-text="scope.row.Url"
                    target="_blank"
                  ></el-link>
                </template>
              </el-table-column>
              <el-table-column property="Title" label="标题" min-width="250"></el-table-column>
              <el-table-column property="PublishDate" label="发布日期" width="100"></el-table-column>
            </el-table>
            <div class="paginationC">
              <el-pagination
                @current-change="DataCurrentChange"
                :current-page="DataCurrentPage"
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="DataCount"
              ></el-pagination>
            </div>
          </el-dialog>
        </el-form>
      </el-col>
    </el-col>
  </el-form>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { truncate, truncateSync } from "fs";
import { brotliCompress } from "zlib";
import { type } from "os";
export default {
  name: "center",
  data() {
    return {
      type: 0,
      singleAddDialog: false,
      batchAddDialog: false,
      dataListDialog: false,
      batchString: "",
      tableHtml: "",
      fullscreenLoading: false,
      buttonText: "格式化数据",
      isReload: true,
      isCanDelete: false,
      dataDialogtitle: "",
      form: {
        WebName: "",
        Section: "",
        Source: "",
        CityCode: "",
        Url: "",
        LastRunTime: "",
        LastDataTime: "",
        DataCount: 0,
        IsParsed: false,
        NeedRender: false,
        RowXPath: "",
        LinkXPath: "",
        TitleXPath: "",
        DateXPath: "",
        Remark: ""
      },
      rules: {
        Url: [{ required: true, message: "请输入起始网址", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapGetters([
      "listProject",
      "AllCount",
      "currentPage",
      "ProvinceList",
      "DataList",
      "DataCount",
      "DataCurrentPage"
    ]),
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
    this.$store.dispatch("LOAD_PROVINCE");
    //this.$store.dispatch("LOAD_ALL_COUNT");
  },
  methods: {
    //按条件检索
    Search() {
      this.$store.dispatch("SEARCH_PROJECTS");
    },
    //删除
    deleteItem() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("DELETE_PROJECT", this.form._id).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.singleAddDialog = false;
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          //this.singleAddDialog = false;
        });
    },
    //双击修改
    rowClick(row, column, cell, event) {
      this.type = 1;
      this.isCanDelete = true;
      this.form = row;
      this.ProvinceList.forEach(pelement => {
        if (pelement.省市名称 == row.CityCode) {
          this.form.CityCode = pelement.省市代码;
        }
      });
      this.singleAddDialog = true;
    },
    UpdateItem(row) {
      this.type = 1;
      this.isCanDelete = true;
      this.form = row;
      this.ProvinceList.forEach(pelement => {
        if (pelement.省市名称 == row.CityCode) {
          this.form.CityCode = pelement.省市代码;
        }
      });
      this.singleAddDialog = true;
    },
    SearchDatas(row) {
      this.dataDialogtitle = row.WebName + ":  " + row.Section;
      this.$store.dispatch("SEARCHID_CHANGED", row._id);
      this.$store.dispatch("LOAD_DATA_COUNT", row._id);
      this.dataListDialog = true;
    },
    addNewItem() {
      this.type = 0;
      this.isCanDelete = false;
      this.singleAddDialog = true;
      this.form.WebName = "";
      this.form.Section = "";
      this.form.LinkXPath = "";
      this.form.TitleXPath = "";
      this.form.DateXPath = "";
      this.form.Remark = "";
      this.form.Source = "";
      this.form.CityCode = null;
      this.form.Url = "";
      this.form.LastRunTime = null;
      this.form.LastDataTime = null;
      this.form.DataCount = 0;
      this.form.IsParsed = true;
      this.form.RowXPath = "";
    },
    addBatchItems() {
      this.type = 0;
      this.isCanDelete = false;
      this.batchAddDialog = true;
    },
    //add or update
    Submit() {
      if (this.form.Url != "") {
        switch (this.type) {
          case 0:
            this.$store.dispatch("ADD_NEW_PROJECT", this.form);
            this.$store.dispatch("SEARCH_PROJECTS", this.form);
            break;
          case 1:
            this.$store.dispatch("UPDATE_PROJECT", this.form);
            break;
        }
        this.singleAddDialog = false;
        // this.initForm();
      }
    },
    handleCurrentChange(val) {
      this.$store.dispatch("PAGE_CHANGED", val);
    },
    DataCurrentChange(val) {
      this.$store.dispatch("DATA_PAGE_CHANGED", val);
    },
    handleClose(done) {
      done();
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
    formatBatch() {
      if (this.isReload) {
        this.isReload = false;
        this.buttonText = "重新加载数据";
        var str1 = this.batchString.replace(
          /\n/g,
          "</td></tr><tr><td width='200px'>"
        );
        str1 = str1.replace(/\t/g, "</td><td width='200px'>");
        str1 =
          "<table border='1px' style='word-wrap:break-word;word-break:break-all;table-layout:fixed' cellspacing='0'><tr><td width='200px'>" +
          str1;
        this.tableHtml = str1.substr(0, str1.length - 23) + "</table>";
        //this.tableHtml = "";
      } else {
        this.isReload = true;
        this.buttonText = "格式化数据";

        //this.batchString = "";
      }
    },
    BatchSubmit() {
      let sCount = 0;
      let items = this.batchString.split("\n");
      if (items.length >= 2) {
        // const loading = this.$loading({
        //   lock: true,
        //   text: "批量导入数据中",
        //   spinner: "el-icon-loading",
        //   background: "rgba(0, 0, 0, 0.7)"
        // });
        var keys = items[0].split("\t");
        for (var i = 1, len = items.length; i < len; i++) {
          var item = items[i].split("\t");
          if (item.length > 1) {
            var dic = new Array();
            for (var j = 0, jlen = keys.length; j < jlen; j++) {
              dic[keys[j]] = item[j];
            }
            var str = dic["City"] == undefined ? null : dic["City"];
            var itemCityCode = null;
            if (str != null) {
              this.ProvinceList.forEach(pelement => {
                if (pelement.省市名称 == str) {
                  itemCityCode = pelement.省市代码;
                }
              });
            }
            if (dic["Url"] != undefined && dic["Url"] != "") {
              var params = {
                WebName: dic["WebName"] == undefined ? "" : dic["WebName"],
                Section: dic["Section"] == undefined ? "" : dic["Section"],
                Source: dic["Source"] == undefined ? "" : dic["Source"],
                CityCode: itemCityCode,
                Url: dic["Url"] == undefined ? "" : dic["Url"],
                LastRunTime:
                  dic["LastRunTime"] == undefined ? null : dic["LastRunTime"],
                LastDataTime:
                  dic["LastDataTime"] == undefined ? null : dic["LastDataTime"],
                DataCount: dic["DataCount"] == undefined ? 0 : dic["DataCount"],
                RowXPath: dic["RowXPath"] == undefined ? "" : dic["RowXPath"],
                LinkXPath:
                  dic["LinkXPath"] == undefined ? "" : dic["LinkXPath"],
                TitleXPath:
                  dic["TitleXPath"] == undefined ? "" : dic["TitleXPath"],
                DateXPath:
                  dic["DateXPath"] == undefined ? "" : dic["DateXPath"],
                Remark: dic["Remark"] == undefined ? "" : dic["Remark"]
              };
              this.$store.dispatch("ADD_NEW_PROJECT", params).then(
                function(value) {
                  sCount++;
                  console.log("成功" + sCount);
                },
                function(error) {
                  console.log("失败" + items.length - sCount - 1);
                }
              );
              // setTimeout(() => {
              //     loading.text = "导入" + sCount.toString();
              //   }, 1000);
            }
          }
          // setTimeout(() => {
          //   loading.text = "批量导入完成";
          //   loading.close();
          // }, 1000);
          this.batchAddDialog = false;
        }
      } else {
        alert("输入数据不合法\n请输入合法数据(同时包含表头和数据)");
      }
    },
    initForm() {
      this.form.WebName = "";
      this.form.LinkXPath = "";
      this.form.TitleXPath = "";
      this.form.DateXPath = "";
      this.form.Remark = "";
      this.form.Section = "";
      this.form.CityCode = "";
      this.form.Url = "";
      this.form.LastRunTime = "";
      this.form.LastDataTime = "";
      this.form.DataCount = 0;
      this.form.RowXPath = "";
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
  margin-left: 40px;
  text-align: left;
}
.searchDiv {
  margin-top: 10px;
  margin-left: 40px;
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
.batchDiv {
  width: 100%;
  text-align: center;
}
.batchDiv tr td {
  text-align: center;
  vertical-align: bottom;
}
</style>

