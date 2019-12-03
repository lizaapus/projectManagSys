<template>
  <div>
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
        <tr v-show="tableVisibility">
          <el-table
            :data="newInsertDatas"
            border
            style="width:1190px"
            stripe
            size="medium"
            @sort-change="changeSort"
          >
            <el-table-column prop="WebName" label="网站名" width="120" sortable="custom"></el-table-column>
            <el-table-column prop="Section" label="网站栏目" width="120"></el-table-column>
            <el-table-column prop="Source" label="来源" width="100"></el-table-column>
            <el-table-column prop="CityCode" label="城市" width="100"></el-table-column>
            <el-table-column prop="Url" label="起始Url" width="200">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :href="scope.row.Url"
                  v-text="scope.row.Url"
                  target="_blank"
                ></el-link>
              </template>
            </el-table-column>
            <el-table-column prop="Remark" label="备注" width="100"></el-table-column>
            <el-table-column fixed="right" label="操作" width="80" v-if="editShow">
              <template slot-scope="scope">
                <el-button @click="UpdateItem(scope.row)" type="text" size="normal">更新</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-tag v-model="insertMsg"></el-tag>
        </tr>
        
      </table>
      <p v-html="tableHtml"></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="BatchSubmit">批量导入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { truncate, truncateSync } from "fs";
import { brotliCompress } from "zlib";
import { type } from "os";
import ElementUI from "element-ui";
export default {
  name: "batchAddItemDialog",
  props: ["isOpen"],
  data() {
    return {
      batchAddDialog: false,
      buttonText: "格式化数据",
      isReload: true,
      tableVisibility: false,
      batchString: "",
      newInsertDatas: []
    };
  },
  computed: {
    SetbatchAddDialog() {
      if (this.isOpen == "true") {
        this.batchAddDialog = true;
      } else {
        this.batchAddDialog = false;
      }
    }
  },
  methods: {
    //格式化数据
    formatBatch() {
      if (this.isReload) {
        this.isReload = false;
        this.buttonText = "重新加载数据";
        this.tableVisibility = true;

      } else {
        this.isReload = true;
        this.buttonText = "格式化数据";
        this.this.tableVisibility = false;
        newInsertDatas = [];
      }
    },
    RefreshList() {},
     BatchSubmit() {
         let items = this.batchString.split("\n");
         if (items.length >= 2) {
             const loading = this.$loading({
            lock: true,
            text: "批量导入数据中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
            });
            let keys = items[0].split("\t");
            for (let i = 1, len = items.length; i < len; i++) {
                let values = items[i].split("\t");
                if (values.length > 1) {
                    var dic = new Array();
                    for (var j = 0, jlen = keys.length; j < jlen; j++) {
                        dic[keys[j]] = values[j];
                    }
                }
            }
         }
     }
  }
};
</script>

<style scoped>
</style>