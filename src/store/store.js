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
        searchWebName: '中国政府网',
        searchCity: '北京',
        searchStartUrl: 'www.gov.cn',
        AllCount:52,
        startindex:0,
        offsite:10
    },

    mutations: {
        SET_PROJECT_LIST: (state, {
            projectlist
        }) => {
            state.listProject = projectlist
            console.log(state.listProject);
        },
        SET_ALL_COUNT:(state,dispatch,{
            count
        })=>{
            state.AllCount = count;
            state.currentPage = 1;
            state.startindex = (state.currentPage-1)*10;
            state.offsite = state.currentPage*10>state.AllCount?10:state.AllCount;
            
        },
        SET_PAGE:(state,dispatch,{
            val
        })=>{
            state.currentPage = val;
            state.startindex = (val-1)*10;
            state.offsite = 10>(state.AllCount-val*10)?10:(state.AllCount-val*10);
            dispatch('LOAD_PROJECT_LIST');
        },
    },
    //action需要一个启动的名称，mutations会根据commit的名称来刷新相应的action
    actions: {
        //获取记录总数
        LOAD_ALL_COUNT:function  ({
            dispatch,
            commit
        }){
            axios.get('/api/project/getItemsNumb').then((res)=>{
                console.log(res.data);
                commit('SET_ALL_COUNT',{count: res.data});
            },(err)=>{
                console.log(err);
            })
        },
        //加载table列表
        LOAD_PROJECT_LIST: function({
            state,
            dispatch,
            commit
        }) {
            var params = {startIndex:state.startindex,offsite:state.offsite};
            console.log(params);
            axios.post('/api/project/getLimitItem',params).then((res)=>{
                // commit('SET_PROJECT_LIST',{
                //     projectlist: res.data
                // })
            });
        },
        //增加新项目
        ADD_NEW_PROJECT: function({
            dispatch,
            commit
        }, params) {
            axios.post('/api/project/addProject', params).then((res) => {
                //更新总数
               
                dispatch('LOAD_ALL_COUNT');
                 //重新加载列表
                dispatch('LOAD_PROJECT_LIST')
            })
        }, 
        //删除指定项目
        DELETE_PROJECT: function({
            dispatch,
            commit
        }, item) {
            axios.delete('api/project/deleteUser?id=' + item).then((res) => {
                dispatch('LOAD_ALL_COUNT');
                dispatch('LOAD_PROJECT_LIST')
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
            dispatch,
            commit,       
        } ,item) {
            axios.post('api/project/searchItems', params).then((res) => {
                userList: res.data
            })
        },
        PAGE_CHANGED:function ({dispatch,commit},params) {
            console.log('ENTER ACTION');
            commit('SET_PAGE',{val:params});
        }
    },
    getters: {
        listProject: state => {
            return state.listProject;
        },
        sWebName: state => {
            return state.searchWebName;
        },
        sCity: state => {
            return state.searchCity;
        },
        sStartUrl: state => {
            return state.searchStartUrl;
        },
        AllCount:state=>{
            return state.AllCount;
        },
        currentPage:state=>{
            return state.currentPage;
        }
    },
})