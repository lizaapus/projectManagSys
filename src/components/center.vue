<template>
  <el-form class="mainC">
    <el-col :gutter="100">
      <el-col :span="2"></el-col>
      <el-col :span="22">
        <div class="addDiv">
          <el-button type="primary" @click="addNewItem">新建</el-button>
          <el-button type="primary" @click="addBatchItems">批量添加</el-button>
          <!-- 批量添加 dialog -->
          <el-dialog
            :visible.sync="batchAddDialog"
            width="70%"
            min-height="400px"
            center
            title="批量导入数据"
            @close="RefreshList"
            :close-on-click-modal="false"
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
            <!-- <p v-html="tableHtml"></p> -->
            <div v-show="isTableShow">
              <el-table
                :data="newInsertDatas"
                border
                style="width:1190px"
                stripe
                size="small"
                row-key="idIndex"
                default-expand-all
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              >
                <el-table-column prop="WebName" label="网站名" width="220"></el-table-column>
                <el-table-column prop="Section" label="网站栏目" width="220"></el-table-column>
                <el-table-column prop="Source" label="来源" width="110"></el-table-column>
                <!-- <el-table-column prop="CityCode" label="城市" width="110"></el-table-column> -->
                <el-table-column prop="CityName" label="城市" width="110"></el-table-column>
                <el-table-column prop="Url" label="起始地址" width="200">
                  <template slot-scope="scope">
                    <el-link
                      type="primary"
                      :href="scope.row.Url"
                      rel="noreferrer"
                      v-text="scope.row.Url"
                      target="_blank"
                    ></el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="Remark" label="备注" width="160"></el-table-column>
                <el-table-column prop="editOp" fixed="right" label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      @click="InsertOrUpdateItem(scope.$index,scope.row)"
                      type="text"
                      size="normal"
                      v-text="scope.row.editOp"
                    ></el-button>
                    <el-button
                      @click="DeleteBatchItem(scope.$index,scope.row)"
                      type="text"
                      size="normal"
                      v-text="scope.row.editOpDel"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-tag style="margin-top:10px">{{insertMsg}}</el-tag>
            </div>
            <span slot="footer" class="dialog-footer" v-show="isTableShow">
              <el-button @click="batchAddDialog = false">取 消</el-button>
              <el-button type="primary" @click="BatchSubmit" v-text="batchSubmitButtonText"></el-button>
            </span>
          </el-dialog>
        </div>
        <el-form class="searchDiv" size="mini" @submit.native.prevent>
          <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
            <el-form-item label="网站名称：">
              <el-input
                v-model="searchWebName"
                placeholder="网站名称"
                clearable
                @keyup.enter.native="Search"
              ></el-input>
              <!-- <input class="inputC" v-model="searchWebName" placeholder="网站名称" /> -->
            </el-form-item>
            <el-form-item label="城市：">
              <el-select
                v-model="searchCity"
                clearable
                filterable
                placeholder="请选择"
                style="width:120px;"
              >
                <el-option
                  v-for="item in ProvinceList"
                  :key="item.省市代码"
                  :label="item.省市名称"
                  :value="item.省市代码"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Url：">
              <el-input
                v-model="searchStartUrl"
                placeholder="url"
                clearable
                @keyup.enter.native="Search"
              ></el-input>
              <!-- <input class="inputC" v-model="searchStartUrl" placeholder="url" /> -->
            </el-form-item>
            <el-form-item label="数据最新日期">
              <el-date-picker
                v-model="sLatestTime"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                style="width:250px;"
              ></el-date-picker>
              <!-- <el-date-picker placeholder="选择时间" v-model="sLatestTime" style="width: 100%;"></el-date-picker> -->
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="Search">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="listProject"
            border
            style="width:1490px"
            stripe
            size="medium"
            @sort-change="changeSort"
          >
            <el-table-column prop="WebName" label="网站名" width="125" sortable="custom"></el-table-column>
            <el-table-column prop="Section" label="网站栏目" width="125"></el-table-column>
            <el-table-column prop="Source" label="来源" width="80"></el-table-column>
            <el-table-column prop="CityCode" label="城市" width="80"></el-table-column>
            <el-table-column prop="Url" label="起始Url" width="160">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :href="scope.row.Url"
                  v-text="scope.row.Url"
                  rel="noreferrer"
                  target="_blank"
                ></el-link>
              </template>
            </el-table-column>
            <el-table-column prop="LastRunTime" label="上次运行时间" width="160"></el-table-column>
            <el-table-column prop="LastDataTime" label="数据最新日期" width="160" sortable="custom"></el-table-column>
            <el-table-column prop="LastEditTime" label="上次编辑日期" width="160" sortable="custom"></el-table-column>

            <el-table-column prop="DataCount" label="数据总数" width="110" sortable="custom">
              <template slot-scope="scope">
                <el-button
                  @click="SearchDatas(scope.row)"
                  type="text"
                  size="normal"
                  v-text="scope.row.DataCount"
                ></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="Remark" label="备注" width="80"></el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
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
              @submit.native.prevent
            ></el-pagination>
          </div>

          <!-- 添加-修改-删除 dialog -->
          <el-dialog
            :visible.sync="singleAddDialog"
            width="30%"
            center
            @close="RefreshList"
            :close-on-click-modal="false"
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
                <el-checkbox v-model="form.NeedRender"></el-checkbox>
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
          <!-- 数据查看dialog -->
          <el-dialog
            :title="dataDialogtitle"
            :visible.sync="dataListDialog"
            width="80%"
            :close-on-click-modal="false"
          >
            <el-table :data="DataList" border stripe>
              <el-table-column property="Url" label="网址" min-width="250">
                <template slot-scope="scope">
                  <!-- <a :href="scope.row.Url" v-text="scope.row.Url" target="_blank"></a> -->
                  <el-link
                    type="primary"
                    :href="scope.row.Url"
                    rel="noreferrer"
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
import ElementUI from "element-ui";
export default {
  name: "center",
  data() {
    return {
      type: 0,
      singleAddDialog: false,
      batchAddDialog: false,
      dataListDialog: false,
      editShow: true,
      batchString: "",
      tableHtml: "",
      fullscreenLoading: false,
      buttonText: "格式化数据",
      isReload: true,
      isCanDelete: false,
      dataDialogtitle: "",
      newInsertDatas: [],
      isTableShow: false,
      batchSubmitButtonText: "批量导入",
      insertCount: 0,
      insertMsg: "",
      form: {
        WebName: "",
        Section: "",
        Source: "",
        CityCode: "",
        Url: "",
        LastRunTime: "",
        LastDataTime: "",
        LastEditTime: "",
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
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
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
    //console.log("LOAD_PROVINCE");
    this.$store.dispatch("LOAD_PROVINCE");
  },
  methods: {
    //按条件检索
    Search() {
      //console.log("SEARCH_PROJECTS");
      this.$store.dispatch("SEARCH_PROJECTS");
    },
    changeSort(val) {
      this.$store.dispatch("SORT_PARAMS", {
        sortProp: val.prop,
        sortOrder: val.order
      });
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
      this.form.IsParsed = false;
      this.form.NeedRender = false;
      this.form.RowXPath = "";
    },
    addBatchItems() {
      //console.log("enter");
      this.type = 0;
      this.isCanDelete = false;
      this.isReload = true;
      this.batchAddDialog = true;
      this.buttonText = "格式化数据";
      this.batchSubmitButtonText = "批量导入";
      this.isTableShow = false;
      this.batchString = "";
    },
    //add or update
    Submit() {
      if (this.form.Url != "") {
        switch (this.type) {
          case 0:
            var errmsg = this.form.Url + ":";
            this.$store.dispatch("ADD_NEW_PROJECT", this.form).then(
              function(value) {
                layer.alert(errmsg + "写入成功");
              },
              function(error) {
                layer.alert(error);
              }
            );
            break;
          case 1:
            this.form.LastEditTime = this.getNowFormatDate();
            //console.log(this.form);
            this.$store.dispatch("UPDATE_PROJECT", this.form);
            break;
        }
        this.singleAddDialog = false;
        // this.initForm();
      }
    },
    handleCurrentChange(val) {
      this.$store.dispatch("PAGE_CHANGED", val);
      return false;
    },
    DataCurrentChange(val) {
      this.$store.dispatch("DATA_PAGE_CHANGED", val);
    },
    handleClose(done) {
      done();
    },
    //刷新列表
    RefreshList() {
      //console.log("RefreshList");
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
      let errCount = 0;
      if (this.isReload) {
        this.isReload = false;
        this.buttonText = "重新加载数据";
        this.isTableShow = true;
        this.newInsertDatas = [];
        this.insertMsg = "";
        this.insertCount = 0;
        // 将数据写入el-table中
        let items = this.batchString.split("\n");
        if (items.length >= 2) {
          let keys = items[0].split("\t");
          for (let i = 1, len = items.length; i < len; i++) {
            let values = items[i].split("\t");
            if (values.length > 1) {
              let dic = new Array();
              for (let j = 0, jlen = keys.length; j < jlen; j++) {
                dic[keys[j]] = values[j];
              }
              let str = dic["City"] == undefined ? null : dic["City"];
              let itemCityCode = null;
              if (str != null) {
                this.ProvinceList.forEach(pelement => {
                  if (pelement.省市名称 == str) {
                    itemCityCode = pelement.省市代码;
                  }
                });
              }
              let dateNow = new Date();
              let insertItem = {
                idIndex: i,
                WebName: dic["WebName"] == undefined ? "" : dic["WebName"],
                Section: dic["Section"] == undefined ? "" : dic["Section"],
                Source: dic["Source"] == undefined ? "" : dic["Source"],
                CityCode: itemCityCode,
                CityName: dic["City"] == undefined ? null : dic["City"],
                Url: dic["Url"] == undefined ? "" : dic["Url"],
                Remark: dic["Remark"] == undefined ? "" : dic["Remark"],

                editOpDel: "删除"
              };
              if (insertItem.Url != "") {
                this.newInsertDatas.push(insertItem);
                this.insertCount++;
              } else {
                errCount++;
                console.log(insertItem);
              }
            }
          }
        }
        if (errCount > 0) {
          this.$message({
            type: "error",
            message:
              "存在解析失败的url，请确认数据中是否存在url为空的情况或者换行!"
          });
        }

        this.insertMsg = "插入数据" + this.insertCount + "条";
      } else {
        this.isReload = true;
        this.buttonText = "格式化数据";
        this.isTableShow = false;
        this.batchString = "";
        this.newInsertDatas = [];
        this.insertMsg = "";
        this.insertCount = 0;
      }
    },
    //批量提交
    BatchSubmit() {
      if (this.batchSubmitButtonText == "批量导入") {
        this.BatchInsert();
      } else {
        this.BatchUpdate();
      }
    },
    //批量插入
    BatchInsert() {
      const loading = this.$loading({
        lock: true,
        text: "批量导入数据中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let standardInsertDatas = [];
      this.newInsertDatas.forEach(ele => {
        standardInsertDatas.push({
          WebName: ele.WebName,
          Section: ele.Section,
          LinkXPath: "",
          TitleXPath: "",
          DateXPath: "",
          Remark: ele.Remark,
          Source: ele.Source,
          CityCode: ele.CityCode,
          Url: ele.Url,
          LastRunTime: null,
          LastDataTime: null,
          DataCount: 0,
          IsParsed: false,
          NeedRender: false,
          RowXPath: ""
        });
      });
      // console.log(standardInsertDatas.length);
      this.$store.dispatch("BATCH_ADD_PROJECTS", standardInsertDatas).then(
        sucessValue => {
          layer.alert("全部成功写入");
          loading.close();
          this.batchSubmitButtonText = "批量导入";
          this.buttonText = "格式化数据";
          this.isTableShow = false;
          this.isReload = true;
          this.newInsertDatas = [];
          this.batchString = "";
          this.insertMsg = "";
          this.insertCount = 0;
        },
        retErr => {
          this.batchSubmitButtonText = "批量更新";
          let err = retErr.data.err;
          layer.alert(
            "成功" +
              err.result.nInserted +
              "条<br>失败" +
              err.result.writeErrors.length +
              "条"
          );
          this.insertCount = err.result.writeErrors.length;
          this.insertMsg = "更新数据" + this.insertCount + "条";
          loading.close();
          let errList = err.result.writeErrors;
          let tempInsertDatas = [];
          errList.forEach(errItem => {
            let childData = errItem.op;
            let childId = errItem.index + 1 + 1000000;
            let insertErrData = this.newInsertDatas[errItem.index];
            tempInsertDatas.push({
              idIndex: insertErrData.idIndex,
              WebName: insertErrData.WebName,
              Section: insertErrData.Section,
              Source: insertErrData.Source,
              CityCode: insertErrData.CityCode,
              CityName: insertErrData.CityName,
              Url: insertErrData.Url,
              Remark: insertErrData.Remark,
              LastEditTime: this.getNowFormatDate(),
              editOp: "更新",
              editOpDel: "删除",
              children: [
                {
                  idIndex: childId,
                  WebName: childData.WebName,
                  Url: childData.Url,
                  CityCode: childData.CityCode,
                  Section: childData.Section,
                  Source: childData.Source,
                  Remark: childData.Remark
                }
              ]
            });
          });
          //console.log(tempInsertDatas);
          this.newInsertDatas = tempInsertDatas;
        }
      );
    },
    //批量更新
    BatchUpdate() {
      let loading = this.$loading({
        lock: true,
        text: "批量更新数据中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let sCount = 0;
      let eCount = 0;
      let len = this.newInsertDatas.length;
      let errMsg = "";
      this.newInsertDatas.forEach(ele => {
        ele.LastEditTime = this.getNowFormatDate();
        this.$store.dispatch("UPDATE_INSERTFAILED_PROJECT", ele).then(
          success => {
            //console.log(ele.Url);
            let ind = 0;
            let urlIndex = 0;
            this.newInsertDatas.forEach(it => {
              if (it.Url == ele.Url) urlIndex = ind;
              ind++;
            });
            sCount++;
            this.insertCount--;
            this.insertMsg = "更新数据" + this.insertCount + "条";
            this.newInsertDatas.splice(urlIndex, 1);
            if (sCount == len) {
              loading.close();
              layer.alert("全部更新成功");
              this.batchSubmitButtonText = "批量导入";
              this.buttonText = "格式化数据";
              this.isTableShow = false;
              this.isReload = true;
              this.newInsertDatas = [];
              this.batchString = "";
              this.insertCount = 0;
              this.insertMsg = "";
            } else {
              if (eCount + sCount == len) {
                loading.close();
                layer.alert(
                  "成功" +
                    sCount.toString() +
                    "条<br/>失败" +
                    eCount.toString() +
                    "条                                                                            " +
                    errMsg
                );
              }
            }
          },
          err => {
            errMsg += ele.Url + err + "<br/>";
            eCount++;
            if (eCount + sCount == len) {
              loading.close();
              layer.alert(
                "成功" +
                  sCount.toString() +
                  "条<br/>失败" +
                  eCount.toString() +
                  "条                                                                            " +
                  errMsg
              );
            }
          }
        );
      });
    },
    InsertOrUpdateItem(index, row) {
      row.LastEditTime = this.getNowFormatDate();
      // console.log(row);
      this.$store.dispatch("UPDATE_INSERTFAILED_PROJECT", row).then(
        success => {
          let urlIndex = 0;
          let ti = 0;
          this.newInsertDatas.forEach(it => {
            if (it.Url == row.Url) urlIndex = ti;
            ti++;
          });
          this.newInsertDatas.splice(urlIndex, 1);
          this.insertCount--;

          this.$message({
            type: "success",
            message: "更新成功!"
          });
          // this.insertMsg = "更新数据" + this.insertCount + "条";
          // if (this.insertCount == 0) {
          //   this.insertCount = 0;
          //   this.insertMsg = "";
          // }
        },
        err => {
          this.$message({
            type: "error",
            message: "更新失败!"
          });
          console.log(error);
        }
      );
    },
    DeleteBatchItem(index, row) {
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let urlIndex = 0;
          let ti = 0;
          this.newInsertDatas.forEach(it => {
            if (it.Url == row.Url) urlIndex = ti;
            ti++;
          });
          this.newInsertDatas.splice(urlIndex, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
      this.form.IsParsed = false;
      this.form.NeedRender = false;
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var currentdate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes() +
        seperator2 +
        date.getSeconds();
      return currentdate;
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
  width: 100%;
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

