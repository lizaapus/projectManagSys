import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import {
    Alert
} from 'element-ui';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        listProject: [],
        searchWebName: '',
        searchCity: '',
        searchStartUrl: '',
        AllCount: 0,
        startindex: 0,
        offsite: 10,
        currentPage: 1,
    },

    mutations: {
        SET_PROJECT_LIST: (state, {
            projectlist
        }) => {
            state.listProject = projectlist
        },
        SET_ALL_COUNT: (state, {
            count
        }) => {
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
        SET_WENNAME(state, val) {
            state.searchWebName = val
        },
        SET_CITY(state, val) {
            state.searchCity = val;
        },
        SET_URL(state, val) {
            state.searchStartUrl = val;
        }
    },
    actions: {
        //获取记录总数
        LOAD_ALL_COUNT: function({
            dispatch,
            commit
        }) {
            axios.get('/api/project/getItemsNumb').then((res) => {
                commit('SET_ALL_COUNT', {
                    count: parseInt(res.data[0]["count(*)"])
                });
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
            if (state.searchWebName == '' && state.searchCity == '' && state.searchStartUrl == '') {
                var params = {
                    startIndex: state.startindex,
                    offsite: state.offsite
                };
                axios.post('/api/project/getLimitItem', params).then((res) => {
                    commit('SET_PROJECT_LIST', {
                        projectlist: res.data
                    })
                });
            } else {
                var params = {
                    searchWebName: state.searchWebName,
                    searchCity: state.searchCity,
                    searchStartUrl: state.searchStartUrl,
                    startIndex: state.startindex,
                    offsite: state.offsite
                };
                axios.post('/api/project/searchItems', params).then((res) => {
                    commit('SET_PROJECT_LIST', {
                        projectlist: res.data
                    })
                });
            }
        },
        //增加新项目
        ADD_NEW_PROJECT: function({
            dispatch,
            commit
        }, params) {
            axios.post('/api/project/addProject', params).then((res) => {
                dispatch('SEARCH_PROJECTS');
            })
        },
        //删除指定项目
        DELETE_PROJECT: function({
            dispatch,
            commit
        }, item) {
            axios.delete('api/project/deleteItem?id=' + item).then((res) => {
                dispatch('SEARCH_PROJECTS');
            })
        },
        //更新指定项目
        UPDATE_PROJECT: function({
            dispatch,
            commit
        }, params) {
            axios.post('/api/project/updateItem', params).then((res) => {
                dispatch('LOAD_PROJECT_LIST');
            })
        },
        //查询符合条件的项目
        SEARCH_PROJECTS: function({
            state,
            dispatch,
            commit,
        }) {
            console.log('search enter vuex');
            var params = {
                searchWebName: state.searchWebName,
                searchCity: state.searchCity,
                searchStartUrl: state.searchStartUrl,
                startIndex: state.startindex,
                offsite: state.offsite
            };
            axios.post('api/project/searchItemsCount', params).then((res) => {
                console.log(res);
                commit('SET_ALL_COUNT', {
                    count: parseInt(res.data[0]["count(*)"])
                })
            }).then(() => {
                dispatch('LOAD_PROJECT_LIST');
            }, (err) => {
                console.log(err);
            })
        },
        PAGE_CHANGED: function({
            dispatch,
            commit
        }, params) {
            console.log(params);
            commit('SET_PAGE', {
                val: params
            });
            dispatch('LOAD_PROJECT_LIST');
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
        }
    },
})