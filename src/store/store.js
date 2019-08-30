import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import moment from 'moment';
import {
    stat
} from 'fs';
import {
    Switch
} from 'element-ui';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        listProject: [],
        searchWebName: '',
        searchCity: '',
        searchStartUrl: '',
        searchLatestTime: '',
        AllCount: 0,
        startindex: 0,
        offsite: 10,
        currentPage: 1,
        ProvinceList: [],
        DataList: [],
        searchedId: "",
        DataCount: 0,
        DataStartIndex: 0,
        DataOffsite: 10,
        DataCurrentPage: 1,
        sortParams: '',
    },
    mutations: {
        SET_PROVINCE_LIST: (state, {
            provincelist
        }) => {
            state.ProvinceList = provincelist
        },
        SET_PROJECT_LIST: (state, {
            projectlist
        }) => {
            var i = 0;
            projectlist.forEach(element => {
                state.ProvinceList.forEach(pelement => {
                    if (pelement.省市代码 == projectlist[i].CityCode) {
                        projectlist[i].CityCode = pelement.省市名称;
                    }
                });
                projectlist[i].LastRunTime = element.LastRunTime == '0000-00-00 00:00:00' || element.LastRunTime == '' || element.LastRunTime == null ? "" : moment(element.LastRunTime).format('YYYY-MM-DD HH:mm:ss');
                projectlist[i].LastDataTime = element.LastDataTime == '0000-00-00 00:00:00' || element.LastDataTime == '' || element.LastDataTime == null ? "" : moment(element.LastDataTime).format('YYYY-MM-DD HH:mm:ss');
                i++;
            });
            state.listProject = projectlist
        },
        SET_ALL_COUNT: (state, {
            count
        }) => {
            if (count < (state.currentPage - 1) * 10)
                state.currentPage = 1;
            state.AllCount = count;
            state.startindex = (state.currentPage - 1) * 10;
            state.offsite = state.currentPage * 10 > state.AllCount ? state.AllCount : 10;
        },
        SET_PAGE: (state, {
            val
        }) => {
            state.currentPage = val;
            state.startindex = (val - 1) * 10;
            state.offsite = 10 > (state.AllCount - (val - 1) * 10) ? (state.AllCount - (val - 1) * 10) : 10;
        },
        SET_SEARCHID: (state, {
            val
        }) => {
            state.searchedId = val;
        },
        SET_DATA_PAGE: (state, {
            val
        }) => {
            state.DataCurrentPage = val;
            state.DataStartIndex = (val - 1) * 10;
            state.DataOffsite = 10 > (state.DataCount - (val - 1) * 10) ? (state.DataCount - (val - 1) * 10) : 10;
        },
        SET_DATA_COUNT: (state, {
            count
        }) => {
            if (count < (state.DataCurrentPage - 1) * 10)
                state.DataCurrentPage = 1;
            state.DataCount = count;
            state.DataStartIndex = (state.DataCurrentPage - 1) * 10;
            state.DataOffsite = state.DataCurrentPage * 10 > state.DataCount ? state.DataCount : 10;
        },
        SET_DATALIST: (state, {
            datalist
        }) => {
            var i = 0;
            datalist.forEach(element => {
                // datalist[i].LastRunTime = element.LastRunTime == '0000-00-00 00:00:00' || element.LastRunTime == '' || element.LastRunTime == null ? "" : moment(element.LastRunTime).format('YYYY-MM-DD ');
                datalist[i].PublishDate = element.PublishDate == '0000-00-00 00:00:00' || element.PublishDate == '' || element.PublishDate == null ? "" : moment(element.PublishDate).format('YYYY-MM-DD');
                i++;
            });
            state.DataList = datalist;
        },
        SET_WENNAME(state, val) {
            state.searchWebName = val
        },
        SET_CITY(state, val) {
            state.searchCity = val;
        },
        SET_URL(state, val) {
            state.searchStartUrl = val;
        },
        SET_SEARCH_LatestTime(state, val) {
            state.searchLatestTime = val;
        },
        SET_SORT_PARAMS: (state, {
            val
        }) => {
            state.sortParams = val;
        }
    },
    actions: {
        LOAD_PROVINCE: function({
            dispatch,
            commit
        }) {
            axios.get('/api/project/getProvince').then((res) => {
                if (res.data.code == 0) {
                    commit('SET_PROVINCE_LIST', {
                        provincelist: res.data.data
                    });
                } else {
                    layer.alert(res.data.msg)
                }

            }, (err) => {
                console.log(err);
            }).then(() => {
                dispatch("LOAD_ALL_COUNT")
            }, (err) => {
                console.log(err);
            })
        },
        //获取记录总数
        LOAD_ALL_COUNT: function({
            dispatch,
            commit
        }) {
            axios.get('/api/project/getItemsNumb').then((res) => {
                if (res.data.code == 0) {
                    commit('SET_ALL_COUNT', {
                        count: parseInt(res.data.data)
                    });
                } else {
                    layer.alert(res.data.msg)
                }
            }, (err) => {
                console.log(err);
            }).then(() => {
                dispatch('LOAD_PROJECT_LIST');
            }, (err) => {
                console.log(err);
            })
        },
        //加载table列表
        LOAD_PROJECT_LIST: function({
            state,
            dispatch,
            commit
        }) {
            let sStarttime = ''
            let sEndtime = ''
            if (state.searchLatestTime != null && state.searchLatestTime != "") {
                sStarttime = moment(state.searchLatestTime[0]).format('YYYY-MM-DD') + " 00:00:00";
                sEndtime = moment(state.searchLatestTime[1]).format('YYYY-MM-DD') + " 23:59:59";
            }
            if (state.searchWebName == '' && state.searchCity == '' && state.searchStartUrl == '' && sStarttime == '') {
                var params = {
                    startIndex: state.startindex,
                    offsite: state.offsite,
                    sortParams: state.sortParams
                };
                axios.post('/api/project/getLimitItem', params).then((res) => {
                    if (res.data.code == 0) {
                        commit('SET_PROJECT_LIST', {
                            projectlist: res.data.data
                        })
                    } else {
                        layer.alert(res.data.msg)
                    }
                });
            } else {
                var params = {
                    searchWebName: state.searchWebName,
                    searchCity: state.searchCity,
                    searchStartUrl: state.searchStartUrl,
                    sStarttime: sStarttime,
                    sEndtime: sEndtime,
                    startIndex: state.startindex,
                    offsite: state.offsite,
                    sortParams: state.sortParams
                };
                axios.post('/api/project/searchItems', params).then((res) => {
                    if (res.data.code == 0) {
                        commit('SET_PROJECT_LIST', {
                            projectlist: res.data.data
                        })
                    } else {
                        layer.alert(res.data.msg)
                    }
                });
            }
        },
        //增加新项目
        ADD_NEW_PROJECT({
            dispatch,
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                axios.post('/api/project/addProject', params).then((res) => {
                    if (res.data.code == 0) {
                        dispatch("SEARCH_PROJECTS")
                        resolve(0)
                    } else {
                        if (res.data.code == 11000) {
                            let errmsg = res.data.msg;
                            let msgIndex = errmsg.indexOf("dup key:");
                            errmsg = errmsg.slice(msgIndex + 14, errmsg.length - 3)
                            errmsg += "写入失败，重复写入"
                            reject(errmsg)
                        } else {
                            reject(res.data.msg)
                        }
                    }
                })
            })
        },
        //删除指定项目
        DELETE_PROJECT: function({
            dispatch,
            commit
        }, item) {
            axios.delete('api/project/deleteItem?_id=' + item).then((res) => {
                if (res.data.code == 0) {
                    dispatch('SEARCH_PROJECTS');
                } else {
                    layer.alert(res.data.msg)
                }
                // dispatch('SEARCH_PROJECTS');
            })
        },
        //更新指定项目
        UPDATE_PROJECT: function({
            dispatch,
            commit
        }, params) {
            axios.post('/api/project/updateItem', params).then((res) => {
                if (res.data.code == 0) {
                    dispatch('LOAD_PROJECT_LIST');
                } else {
                    if (res.data.code == 11000) {
                        let errmsg = res.data.msg;
                        let msgIndex = errmsg.indexOf("dup key:");
                        errmsg = errmsg.slice(msgIndex + 14, errmsg.length - 3)
                        errmsg += "写入失败，该url已存在"
                        layer.alert(errmsg)
                    } else {
                        layer.alert(res.data.msg)
                    }

                }
                // dispatch('LOAD_PROJECT_LIST');
            })
        },
        //查询符合条件的项目
        SEARCH_PROJECTS: function({
            state,
            dispatch,
            commit,
        }) {
            //console.log("enter search");
            let sStarttime = ''
            let sEndtime = ''
            if (state.searchLatestTime != null && state.searchLatestTime != '') {
                sStarttime = moment(state.searchLatestTime[0]).format('YYYY-MM-DD') + " 00:00:00";
                sEndtime = moment(state.searchLatestTime[1]).format('YYYY-MM-DD') + " 23:59:59";
            }
            var params = {
                searchWebName: state.searchWebName,
                searchCity: state.searchCity,
                searchStartUrl: state.searchStartUrl,
                sStarttime: sStarttime,
                sEndtime: sEndtime,
                startIndex: state.startindex,
                offsite: state.offsite,
                sortParams: state.sortParams
            };
            axios.post('api/project/searchItemsCount', params).then((res) => {
                if (res.data.code == 0) {
                    console.log(res.data);
                    commit('SET_ALL_COUNT', {
                        count: parseInt(res.data.data)
                    })
                } else {
                    layer.alert(res.data.msg)
                }
            }).then(() => {
                dispatch('LOAD_PROJECT_LIST');
            }, (err) => {
                console.log(err);
            })
        },
        //cpro翻页
        PAGE_CHANGED: function({
            dispatch,
            commit
        }, params) {
            commit('SET_PAGE', {
                val: params
            });
            dispatch('LOAD_PROJECT_LIST');
        },

        //获取data记录总数
        LOAD_DATA_COUNT: function({
            state,
            dispatch,
            commit
        }) {
            var params = {
                ParseId: state.searchedId,
            }
            axios.post('/api/project/getDataItemsNumb', params).then((res) => {
                if (res.data.code == 0) {
                    commit('SET_DATA_COUNT', {
                        count: parseInt(res.data.data)
                    });
                } else {
                    layer.alert(res.data.msg)
                }
            }, (err) => {
                console.log(err);
            }).then(() => {
                dispatch('SEARCH_DATAS');
            }, (err) => {
                console.log(err);
            })
        },

        //获取指定id的data
        SEARCH_DATAS: function({
            state,
            dispatch,
            commit
        }) {
            var params = {
                ParseId: state.searchedId,
                startIndex: state.DataStartIndex,
                offsite: state.DataOffsite
            };
            axios.post('/api/project/getDataList', params).then((res) => {
                if (res.data.code == 0) {
                    commit('SET_DATALIST', {
                        datalist: res.data.data
                    });
                } else {
                    layer.alert(res.data.msg)
                }
            });
        },
        //data翻页
        DATA_PAGE_CHANGED: function({
            dispatch,
            commit
        }, params) {
            commit('SET_DATA_PAGE', {
                val: params
            });
            dispatch('SEARCH_DATAS');
        },
        //设置searchId
        SEARCHID_CHANGED: function({
            commit
        }, params) {
            commit('SET_SEARCHID', {
                val: params
            });
        },
        SORT_PARAMS: function({
            commit,
            dispatch
        }, params) {
            let sortP = params.sortProp
            if (params.sortOrder == null)
                sortP = ''
            if (params.sortOrder == "descending")
                sortP = '-' + sortP
            commit('SET_SORT_PARAMS', {
                val: sortP
            });
            dispatch("SEARCH_PROJECTS");
        }
    },
    getters: {
        listProject: state => {
            return state.listProject;
        },
        searchWebName: state => {
            return state.searchWebName;
        },
        searchCity: state => {
            return state.searchCity;
        },
        searchStartUrl: state => {
            return state.searchStartUrl;
        },
        AllCount: state => {
            return state.AllCount;
        },
        currentPage: state => {
            return state.currentPage;
        },
        ProvinceList: state => {
            return state.ProvinceList;
        },
        DataCount: state => {
            return state.DataCount;
        },
        DataCurrentPage: state => {
            return state.DataCurrentPage;
        },
        DataList: state => {
            return state.DataList;
        },

    },
})