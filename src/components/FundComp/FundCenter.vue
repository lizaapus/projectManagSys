<template>
  <el-form class="mainC">
    <el-col :gutter="100">
      <el-col :span="24">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item label="基金名称：">
            <el-select
              v-model="SelectedFund"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="searchFunds"
              :loading="loading"
            >
              <el-option
                v-for="item in listFunds"
                :key="item.FundName"
                :label="item.FundName"
                :value="item.FundName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form class="fundDetail" :inline="true">
          <el-form-item label="基金名称：">
            <label v-text="SelectedFund.FundName"></label>
          </el-form-item>
          <el-form-item label="基金ID：">
            <label v-text="SelectedFund.FundID"></label>
          </el-form-item>
          <el-form-item label="基金来源：">
            <label v-text="SelectedFund.SourceType"></label>
          </el-form-item>
        </el-form>
        <div>
          <table class="batchDiv" width="90%">
            <tr width="100%">
              <td width="60px" v-show="isReload">
                <label width="80px">批量数据：</label>
              </td>
              <td width="80%" v-show="isReload">
                <el-input
                  type="textarea"
                  autosize
                  placeholder="请输入内容"
                  v-model="batchString"
                  clearable
                ></el-input>
              </td>
              <td width="10%">
                <el-button
                  type="primary"
                  @click="formatBatch"
                  v-text="buttonText"
                  :disabled="InputEnable"
                ></el-button>
              </td>
            </tr>
          </table>
          <div v-show="isTableShow" class="batchDiv2">
            <el-table
              :data="currentTableDatas"
              border
              style="width:1290px"
              stripe
              size="small"
              row-key="idIndex"
              default-expand-all
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
              <el-table-column prop="ProjectID" label="项目编号" width="180"></el-table-column>
              <el-table-column prop="ProjectName" label="项目名称" width="180"></el-table-column>
              <el-table-column prop="FundID" label="基金ID" width="180"></el-table-column>

              <el-table-column prop="StartTime" label="起始时间" width="110"></el-table-column>
              <el-table-column prop="Leader" label="项目负责人" width="110"></el-table-column>
              <el-table-column prop="LeaderOrg" label="项目负责人单位" width="180"></el-table-column>
              <el-table-column prop="Remark" label="备注" width="160"></el-table-column>
              <el-table-column prop="editOpEnable" fixed="right" label="操作" width="160">
                <template slot-scope="scope">
                  <el-button
                    @click="DeleteBatchItem(scope.$index,scope.row)"
                    type="text"
                    size="normal"
                    :disabled="scope.row.editOpEnable"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-show="isTableShow">
            <el-tag style="margin-top:20px;text-align: left;">{{insertMsg}}</el-tag>
          </div>
          <span slot="footer" class="dialog-footer" v-show="isTableShow">
            <el-button type="primary" @click="BatchSubmit" class="submitBthClass">批 量 添 加</el-button>
            <el-button
              type="primary"
              @click="ForceBatchSubmit"
              class="submitBthClass"
              v-show="forceBtnShow"
            >批 量 添 加（强 制）</el-button>
          </span>
          <div class="block" v-show="isTableShow">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="insertCount"
            ></el-pagination>
          </div>
        </div>
      </el-col>
    </el-col>
  </el-form>
</template>
<script>
import ElementUI from "element-ui";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      loading: false,
      isReload: true,
      isTableShow: false,
      buttonText: "格式化数据",
      batchString: "",
      newInsertDatas: [],
      insertMsg: "",
      insertCount: 0,
      currentIndex: 0,
      successIcount: 0,
      failedICount: 0,
      tempInsertDatas: [],
      currentTableDatas: [],
      forceBtnShow: false,
      loading: undefined,
      loading2: undefined,
      currentPage: 1,
      pageSize: 10,
      form: {
        ProjectID: "",
        ProjectName: "",
        FundID: "",
        StartTime: "",
        Leader: "",
        LeaderOrg: "",
        Remark: ""
      }
    };
  },
  computed: {
    ...mapGetters(["listFunds", "InputEnable"]),
    SelectedFund: {
      get() {
        return this.$store.state.SelectedFund;
      },
      set(value) {
        this.$store.commit("SET_SELECTED_FUND", value);
      }
    }
  },
  methods: {
    searchFunds(query) {
      this.$store.dispatch("SEARCH_FUNDS", { keywords: query });
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
        this.forceBtnShow = false;
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
              let insertItem = {
                idIndex: i,
                ProjectID:
                  dic["ProjectID"] == undefined ? "" : dic["ProjectID"],
                ProjectName:
                  dic["ProjectName"] == undefined ? "" : dic["ProjectName"],
                FundID: this.SelectedFund.FundID,
                StartTime:
                  dic["StartTime"] == undefined ? null : dic["StartTime"],
                Leader: dic["Leader"] == undefined ? "" : dic["Leader"],
                LeaderOrg:
                  dic["LeaderOrg"] == undefined ? "" : dic["LeaderOrg"],
                Remark: dic["Remark"] == undefined ? "" : dic["Remark"],
                editOpEnable: false,
                children: []
              };
              this.newInsertDatas.push(insertItem);
              this.insertCount++;
            }
          }
        }
        this.insertMsg = "插入数据" + this.insertCount + "条";
        this.currentPage = 1;
        this.currentTableDatas = this.newInsertDatas.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        );
      } else {
        this.isReload = true;
        this.buttonText = "格式化数据";
        this.isTableShow = false;
        this.batchString = "";
        this.newInsertDatas = [];
        this.insertCount = 0;
        this.currentPage = 1;
        this.forceBtnShow = false;
      }
    },
    DeleteBatchItem(index, row) {
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ti = 0;
          let deleteIndex = 0;
          this.newInsertDatas.forEach(it => {
            if (it.idIndex == row.idIndex) deleteIndex = ti;
            ti++;
          });
          this.newInsertDatas.splice(deleteIndex, 1);
          this.insertCount--;
          this.currentTableDatas = this.newInsertDatas.slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize
          );
          this.insertMsg = "插入数据" + this.insertCount + "条";
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
    BatchSubmit() {
      this.successIcount = 0;
      this.failedICount = 0;
      this.loopf(0);
      this.loading = this.$loading({
        lock: true,
        text: "批量导入数据中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    ForceBatchSubmit() {
      this.loading2 = this.$loading({
        lock: true,
        text: "强制批量导入数据中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.forceLoopf(0);
    },

    forceLoopf(index) {
      let standardInsertDatas = [];
      this.newInsertDatas.slice(index, index + 200).forEach(ele => {
        let standardInsertData = {
          ProjectID: ele.ProjectID,
          ProjectName: ele.ProjectName,
          FundID: ele.FundID,
          StartTime: ele.StartTime,
          Leader: ele.Leader,
          LeaderOrg: ele.LeaderOrg,
          Remark: ele.Remark
        };
        standardInsertDatas.push(standardInsertData);
      });
      this.$store.dispatch("BATCH_ADD_FUND_PROJECTS", standardInsertDatas).then(
        sucessValue => {
          if (index + 200 >= this.insertCount) {
            this.loading2.close();
            layer.alert("强制批量导入成功");
            this.batchSubmitButtonText = "批量导入";
            this.buttonText = "格式化数据";
            this.isTableShow = false;
            this.isReload = true;
            this.newInsertDatas = [];
            this.batchString = "";
            this.insertMsg = "";
            this.insertCount = 0;
            this.currentPage = 1;
            this.forceBtnShow = false;
          } else {
            this.loading2.text =
              "强制批量导入数据中\n" + index + "/" + this.insertCount;
            this.forceLoopf(index + 200);
          }
        },
        retErr => {
          loading2.close();
          this.newInsertDatas = this.newInsertDatas.slice(index);
          this.insertCount = this.newInsertDatas.length;
          this.currentPage = 1;
          this.currentTableDatas = this.newInsertDatas.slice(
            this.currentPage - 1 * this.pageSize,
            this.currentPage * this.pageSize
          );
          this.forceBtnShow = true;
          alert("强制批量导入失败");
          console.log(retErr);
        }
      );
    },

    loopf(index) {
      this.$store
        .dispatch("FIND_PROJECT_BY_ID", {
          pid: this.newInsertDatas[index].ProjectID
        })
        .then(
          sucessValue => {
            if (sucessValue.length > 0) {
              this.failedICount++;
              let childrenList = [];
              sucessValue.forEach(oldV => {
                let olditem = {
                  idIndex:
                    this.newInsertDatas[index].idIndex * 10000 +
                    Math.ceil(
                      Math.random() * this.newInsertDatas[index].idIndex * 10000
                    ),
                  ProjectID: oldV.ProjectID,
                  ProjectName: oldV.ProjectName,
                  FundID: oldV.FundID,
                  StartTime: oldV.StartTime,
                  Leader: oldV.Leader,
                  LeaderOrg: oldV.LeaderOrg,
                  Remark: oldV.Remark,
                  editOpEnable: true
                };
                childrenList.push(olditem);
              });
              let tempIndex = {
                idIndex: this.newInsertDatas[index].idIndex,
                ProjectID: this.newInsertDatas[index].ProjectID,
                ProjectName: this.newInsertDatas[index].ProjectName,
                FundID: this.newInsertDatas[index].FundID,
                StartTime: this.newInsertDatas[index].StartTime,
                Leader: this.newInsertDatas[index].Leader,
                LeaderOrg: this.newInsertDatas[index].LeaderOrg,
                Remark: this.newInsertDatas[index].Remark,
                editOpEnable: false,
                children: childrenList
              };
              this.tempInsertDatas.push(tempIndex);
            } else {
              let standardInsertDatas = {
                ProjectID: this.newInsertDatas[index].ProjectID,
                ProjectName: this.newInsertDatas[index].ProjectName,
                FundID: this.newInsertDatas[index].FundID,
                StartTime: this.newInsertDatas[index].StartTime,
                Leader: this.newInsertDatas[index].Leader,
                LeaderOrg: this.newInsertDatas[index].LeaderOrg,
                Remark: this.newInsertDatas[index].Remark
              };
              this.$store
                .dispatch("SINGLE_ADD_FUND_PROJECT", standardInsertDatas)
                .then(
                  sucessValue => {
                    this.successIcount++;
                  },
                  retErr => {
                    console.log(retErr);
                  }
                );
            }
            if (index < this.insertCount - 1) {
              index++;
              this.loading.text =
                "批量导入数据中\n" + index + "/" + this.insertCount;
              this.loopf(index);
            } else {
              this.loading.close();
              if (this.failedICount == 0) {
                layer.alert("全部成功插入");
                this.batchSubmitButtonText = "批量导入";
                this.buttonText = "格式化数据";
                this.isTableShow = false;
                this.isReload = true;
                this.newInsertDatas = [];
                this.batchString = "";
                this.insertMsg = "";
                this.insertCount = 0;
                this.currentPage = 1;
                this.forceBtnShow = false;
              } else {
                this.newInsertDatas = this.tempInsertDatas;
                this.insertCount = this.failedICount;
                this.currentPage = 1;
                this.currentTableDatas = this.newInsertDatas.slice(
                  (this.currentPage - 1) * this.pageSize,
                  this.currentPage * this.pageSize
                );
                this.forceBtnShow = true;
                layer.alert(
                  "成功插入" +
                    this.successIcount +
                    "条<br>重复数据" +
                    this.failedICount +
                    "条"
                );
              }
            }
          },
          retErr => {
            console.log(retErr);
          }
        );
    },
    //val/页
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentTableDatas = this.newInsertDatas.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    handleCurrentChange(val) {
      this.currentTableDatas = this.newInsertDatas.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      );
    }
  }
};
</script>
<style scoped>
.mainC {
  width: 100%;
  height: 100%;
  margin-top: 130px;
}
.addDiv {
  margin-top: 20px;
  margin-left: 40px;
  text-align: left;
}
.batchDiv {
  width: 100%;
  text-align: center;
}
.batchDiv2 {
  width: 100%;
  margin-left: 200px;
  margin-top: 30px;
}
.submitBthClass {
  margin-top: 20px;
  margin-bottom: 20px;
}
.batchDiv tr td {
  text-align: right;
  vertical-align: bottom;
}

.batch-el-table {
  text-align: center;
}
.searchDiv {
  margin-top: 10px;
  margin-left: 40px;
  text-align: left;
  width: 100%;
}

.el-table .warning-row {
  background: #aaa !important;
}

.el-table .warning-row:hover > td {
  background: #bbb !important;
}
</style>